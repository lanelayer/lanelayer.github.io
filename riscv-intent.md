---
layout: default
title: RISC-V Intent Guide
---

# Develop, Compile, and Upload a RISC-V Intent

This guide explains how to build a minimal RISC-V program, package it with OpenSBI, and upload it as an intent into Core Lane.

## Prerequisites

Install Rust, the RISC-V Rust toolchain, and QEMU:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add RISC-V target
rustup target add riscv64gc-unknown-none-elf

```

## Create the project

Initialize a new Rust binary project named `kernel`:

```bash
cargo init --bin --name kernel
```

## Add a minimal RISC-V runtime

Add `riscv-rt` to reduce boilerplate. It supplies a small runtime, linker script, and a default trap handler. We enable supervisor mode (s-mode) to use the appropriate runtime profile.

```bash
cargo add riscv-rt --features s-mode
```

## Configure toolchain, target, and runner

Create toolchain and cargo config files to lock the Rust version, select the RISC-V target, and set a runner and linker flags.

Create `rust-toolchain.toml`:

```toml
[toolchain]
channel = "stable"
targets = ["riscv64gc-unknown-none-elf"]
```

Create `.cargo/config.toml`:

```toml
[build]
target = "riscv64gc-unknown-none-elf"

# Linker flags
rustflags = [
  "-Clink-arg=-Tmemory.x",
  "-Clink-arg=-Tlink.x",
]
```

## Define memory layout (linker scripts)

The `-Tmemory.x` and `-Tlink.x` flags point the linker to scripts describing how the program is placed in memory. For bare-metal builds this must be specified explicitly. The `riscv-rt` crate provides a default `link.x`; we supply `memory.x` with the RAM map.

For QEMU’s virt machine, place the whole kernel in RAM starting at `0x80200000` with 16 MiB available. Create `memory.x` at the project root:

```ld
MEMORY
{
  RAM : ORIGIN = 0x80200000, LENGTH = 16M
}

REGION_ALIAS("REGION_TEXT", RAM);
REGION_ALIAS("REGION_RODATA", RAM);
REGION_ALIAS("REGION_DATA", RAM);
REGION_ALIAS("REGION_BSS", RAM);
REGION_ALIAS("REGION_HEAP", RAM);
REGION_ALIAS("REGION_STACK", RAM);
```

### Make the linker see `memory.x`

Tell Cargo to copy `memory.x` to the build output and add that directory to the link search path by adding a `build.rs` file:

Create `build.rs` at the project root:

```rust
use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());

    fs::write(out_dir.join("memory.x"), include_bytes!("memory.x")).unwrap();
    println!("cargo:rustc-link-search={}", out_dir.display());
    println!("cargo:rerun-if-changed=memory.x");
    println!("cargo:rerun-if-changed=build.rs");
}
```

## Writing RISC-V intent programe

This section walks through building a minimal bare-metal RISC-V programe that can communicate with a host system. We'll create each file and explain what it does and why it's needed.

### Step 1: Set up dependencies

First, add the required dependencies to `Cargo.toml`:

```toml
[dependencies]
riscv-rt = { version = "0.12", features = ["s-mode"] }
sbi = "0.3"
linked-list-allocator = "0.10"
```

- `riscv-rt`: Provides the runtime, linker script, and entry point for bare-metal RISC-V
- `sbi`: Supervisor Binary Interface for system calls (console, shutdown, etc.)
- `linked-list-allocator`: Simple heap allocator for dynamic memory (`Vec`, `String`, etc.)

### Step 2: Create the panic handler (`src/panic_handler.rs`)

In bare-metal programming, we need to handle panics ourselves since there's no operating system:

```rust
use crate::println;
use core::panic::PanicInfo;
use sbi::system_reset::{ResetReason, ResetType};

#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    println!("A panic occurred: {info}");

    let _ = sbi::system_reset::system_reset(ResetType::Shutdown, ResetReason::SystemFailure);

    println!("System reset failed");
    // We need to loop forever to satisfy the `!` return type,
    // since `!` effectively means "this function never returns".
    loop {}
}
```

**What this does:**
- `#[panic_handler]`: Tells Rust this function handles all panics
- `PanicInfo`: Contains panic location and message
- `sbi::system_reset::system_reset(ResetType::Shutdown, ResetReason::SystemFailure)`: Shuts down the virtual machine cleanly
- `!` return type: Means "never returns" (infinite loop or termination)


### Step 3: Create utility functions (`src/utils.rs`)

Since we can't use `std::println!`, we need to implement our own printing:

```rust
pub fn print(t: &str) {
    for c in t.chars() {
        sbi::legacy::console_putchar(c.try_into().unwrap_or(b'?'))
    }
}

struct Writer {}

pub fn print_args(t: core::fmt::Arguments) {
    use core::fmt::Write;
    let mut writer = Writer {};
    writer.write_fmt(t).unwrap();
}

impl core::fmt::Write for Writer {
    fn write_str(&mut self, s: &str) -> core::fmt::Result {
        print(s);
        Ok(())
    }
}

#[macro_export]
macro_rules! print {
    ($fmt:literal$(, $($arg: tt)+)?) => {
        $crate::utils::print_args(format_args!($fmt $(,$($arg)+)?))
    }
}

#[macro_export]
macro_rules! println {
    ($fmt:literal$(, $($arg: tt)+)?) => {{
        $crate::print!($fmt $(,$($arg)+)?);
        $crate::utils::print("\n");
    }};
    () => {
        $crate::utils::print("\n");
    }
}

pub fn shutdown() -> ! {
    let _ = sbi::system_reset::system_reset(
        sbi::system_reset::ResetType::Shutdown,
        sbi::system_reset::ResetReason::NoReason,
    );
    unreachable!("System reset failed");
}
```

**What this does:**
- `print()`: Sends each character to the console via `sbi::legacy::console_putchar`
- `Writer` struct: Implements `fmt::Write` trait for formatted output
- `print!`/`println!` macros: Provide familiar printing interface using `format_args!`
- `shutdown()`: Uses `sbi::system_reset::system_reset` to terminate the virtual machine


### Step 4: Create the CMIO driver (`src/cmio.rs`)

CMIO (Cartesi Machine I/O) allows communication between the guest kernel and host system:

```rust
#![allow(dead_code)]
extern crate alloc;

use alloc::vec;
use alloc::vec::Vec;

// SBI extension and function IDs
const SBI_YIELD: usize = 9;

// CMIO buffer addresses
pub const PMA_CMIO_RX_BUFFER_START: usize = 0x60000000;
pub const PMA_CMIO_TX_BUFFER_START: usize = 0x60800000;

pub const HTIF_DEVICE_YIELD: u8 = 2;
pub const HTIF_YIELD_CMD_MANUAL: u8 = 1;

pub fn sbi_yield(req: u64) -> usize {
    unsafe { sbi::ecall1(req as usize, SBI_YIELD, 0) }.unwrap_or(0)
}

pub fn pack_yield(dev: u8, cmd: u8, reason: u16, data: u32) -> u64 {
    ((dev as u64) << 56) | ((cmd as u64) << 48) | ((reason as u64) << 32) | (data as u64)
}

pub struct CMIODriver {
    rx_base: usize,
    tx_base: usize,
}

impl CMIODriver {
    pub const fn new() -> Self {
        Self {
            rx_base: PMA_CMIO_RX_BUFFER_START,
            tx_base: PMA_CMIO_TX_BUFFER_START,
        }
    }

    pub fn tx_write(&self, data: &[u8]) -> usize {
        unsafe {
            let dst_payload = core::slice::from_raw_parts_mut(self.tx_base as *mut u8, data.len());
            dst_payload.copy_from_slice(data);
        }

        data.len()
    }

    pub fn rx_read(&self, rx_len: usize) -> Vec<u8> {
        let mut out = vec![0u8; rx_len];
        unsafe {
            let src = core::slice::from_raw_parts(self.rx_base as *const u8, rx_len);
            out.copy_from_slice(src);
        }

        out
    }
}
```

**What this does:**
- **Buffer addresses**: `PMA_CMIO_RX_BUFFER_START` (0x60000000) and `PMA_CMIO_TX_BUFFER_START` (0x60800000) are memory-mapped regions shared with the host
- **`sbi_yield()`**: Makes a supervisor call using `sbi::ecall1` with `SBI_YIELD` extension to notify the host
- **`pack_yield()`**: Packs `HTIF_DEVICE_YIELD`, `HTIF_YIELD_CMD_MANUAL`, reason, and data into a 64-bit value
- **`CMIODriver`**: Provides safe access to the shared memory buffers via `new()`, `tx_write()`, and `rx_read()`
- **`tx_write()`**: Uses `core::slice::from_raw_parts_mut` to copy data to the TX buffer (guest → host)
- **`rx_read()`**: Uses `core::slice::from_raw_parts` to copy data from the RX buffer (host → guest)


### Step 5: Create the main program (`src/main.rs`)

Now we put it all together in the main entry point:

```rust
#![no_std]
#![no_main]

extern crate alloc;
use alloc::vec::Vec;
use core::str::from_utf8;
use linked_list_allocator::LockedHeap;

#[global_allocator]
static ALLOCATOR: LockedHeap = LockedHeap::empty();

use riscv_rt::entry;
mod cmio;
mod panic_handler;
mod utils;
const HEAP_START: usize = 0x8100_0000;
const HEAP_SIZE: usize = 512 * 1024;
use crate::cmio::HTIF_DEVICE_YIELD;
use crate::cmio::HTIF_YIELD_CMD_MANUAL;
use crate::cmio::pack_yield;
use crate::cmio::sbi_yield;

#[entry]
fn main(a0: usize) -> ! {
    unsafe {
        ALLOCATOR.lock().init(HEAP_START as *mut u8, HEAP_SIZE);
    }

    println!("Hello world {}!", a0);

    let dev = cmio::CMIODriver::new();

    let msg = b"GUEST_MARK\n";
    let written: usize = dev.tx_write(msg);
    println!("GUEST: wrote {} bytes to HOST(TX)", written);

    let req = pack_yield(HTIF_DEVICE_YIELD, HTIF_YIELD_CMD_MANUAL, 0, written as u32);
    let rx_len = sbi_yield(req);
    let read_back: Vec<u8> = dev.rx_read(rx_len);

    let received_request = from_utf8(&read_back).unwrap();

    println!(
        "GUEST: received {} bytes from HOST",
        &received_request.len()
    );
    println!("GUEST: read: {}", &received_request);
    utils::shutdown();
}
```

**What this does step by step:**

1. **`#![no_std]`**: Disables standard library (we're bare-metal)
2. **`#![no_main]`**: We provide our own entry point
3. **`#[global_allocator]`**: Sets up `LockedHeap` allocator for `Vec` and other dynamic types
4. **`#[entry]`**: Marks this as the program entry point (replaces `main`)
5. **Heap initialization**: Calls `ALLOCATOR.lock().init()` to set up 512KB of heap memory at `HEAP_START` (0x8100_0000)
6. **Print greeting**: Uses `println!` macro to show the kernel is running (includes boot argument `a0`)
7. **Create CMIO driver**: Calls `cmio::CMIODriver::new()` to set up communication with host
8. **Write message**: Calls `dev.tx_write(b"GUEST_MARK\n")` to send data to the host via TX buffer
9. **Yield to host**: Uses `pack_yield()` and `sbi_yield()` to notify host to process our message
10. **Read response**: Calls `dev.rx_read(rx_len)` to get the host's reply from RX buffer
11. **Print results**: Uses `from_utf8()` to decode and `println!` to show what we received
12. **Shutdown**: Calls `utils::shutdown()` to cleanly terminate the virtual machine


## Building Your RISC-V Program

### Step 1: Build Your Kernel

Build your kernel for production:

```bash
cargo build --release
```

**What this does:** Compiles your kernel with optimizations enabled, creating a smaller and faster executable.

### Step 2: Create Binary Image

Convert the ELF executable into a raw binary that can be loaded by a bootloader:

```bash
rust-objcopy -O binary target/riscv64gc-unknown-none-elf/release/kernel $(pwd)/Image
```

**What this does:** 
- `rust-objcopy`: Tool to manipulate object files
- `-O binary`: Output format is raw binary (no headers)
- Creates `Image` file containing just the executable code

---

## Uploading Your RISC-V Intent to Core Lane

Now that your future intent is built, let's upload it as an intent to Core Lane. 


### Step 1: Store Your Kernel as a Blob

First, upload your compiled kernel binary to Core Lane's blob storage:

```bash
target/debug/core-lane store-blob \
  --rpc-url <rpc-url> \
  --contract <contract> \
  --private-key <private-key> \
  --file <path-to-Image-file> \
  --max-fee-per-gas <max-fee-per-gas> \
  --max-priority-fee-per-gas <max-priority-fee-per-gas>
```

**What this does:**
- Uploads your `Image` file to Core Lane's blob storage
- Returns a blob hash that references your kernel
- Uses gas parameters for transaction fees

### Step 2: Submit Intent (CBOR intentData)

Now submit an intent where `intentData` is CBOR-encoded and includes the RISC-V blob hash from Step 1:

```bash
# Example: intent(intentData, nonce)
cast send --rpc-url <rpc-url> --private-key <private-key> \
  <contract> \
  "intent(bytes,uint256)" <cbor-intent-data-hex> <nonce> \
  -- --max-fee-per-gas <max-fee-per-gas> --max-priority-fee-per-gas <max-priority-fee-per-gas>
```

Where `<cbor-intent-data-hex>` is a hex-encoded CBOR blob that embeds `<blob-hash>` and any other parameters your RISC-V program needs.

**What this does:**
- Submits the intent directly using CBOR `intentData`
- Returns an intent ID for the next steps

### Step 3: Lock Intent for Solving

Lock the intent so it can be solved by providing a Bitcoin transaction:

```bash
INTENT_ID=<intent-id>

cast send -r <rpc-url> \
--legacy --async \
--private-key <private-key> \
<contract> \
"function lockIntentForSolving(bytes32 intentId, bytes data) payable" "$INTENT_ID" <data>
```

**What this does:**
- Locks the intent for solving (prevents other changes)
- The intent is now waiting for a Bitcoin transaction to fulfill it

### Step 4: Create Bitcoin Fill Transaction

Create a Bitcoin transaction that will fulfill the intent. This demonstrates the Bitcoin anchoring:

```bash
# Set up Bitcoin transaction parameters
export DEST=<destination-address>
export AMOUNT_SATS=<amount>

# Connect to Bitcoin regtest node
export BCLI='docker exec <bitcoin-container-name> bitcoin-cli -regtest -rpcuser=<rpc-user> -rpcpassword=<rpc-password>'

# Ensure wallet exists and has funds
if ! $BCLI -rpcwallet=mine getwalletinfo >/dev/null 2>&1; then
  $BCLI -named loadwallet filename=mine >/dev/null 2>&1 || \
  $BCLI -named createwallet wallet_name=mine descriptors=true >/dev/null 2>&1
fi
export BCLI_WALLET="$BCLI -rpcwallet=mine"

# Mine blocks to get spendable coins
ADDR=$($BCLI_WALLET getnewaddress mine bech32)
$BCLI generatetoaddress 101 "$ADDR" >/dev/null 2>&1 || true

# Create transaction with intent ID in OP_RETURN
PAY_BTC=$(python3 -c 'import os;print("{:.8f}".format(int(os.environ["AMOUNT_SATS"])/1e8))')
INTENT_ID_NO0X=${INTENT_ID#0x}

# Build, fund, sign, and send transaction
RAW=$($BCLI_WALLET createrawtransaction "[]" "{\"$DEST\":$PAY_BTC,\"data\":\"$INTENT_ID_NO0X\"}")
FUNDED_HEX=$($BCLI_WALLET fundrawtransaction "$RAW" | jq -r .hex)
SIGNED_HEX=$($BCLI_WALLET signrawtransactionwithwallet "$FUNDED_HEX" | jq -r .hex)
TXID=$($BCLI sendrawtransaction "$SIGNED_HEX"); echo "fill tx: $TXID"

# Verify transaction structure
$BCLI getrawtransaction "$TXID" 1 | jq '.vout | length'
$BCLI getrawtransaction "$TXID" 1 | jq -r '.vout[] | {n:.n, sats:(.value*100000000|floor), type:.scriptPubKey.type, asm:.scriptPubKey.asm}'
```

**What this does:**
- Creates a Bitcoin transaction that pays to `DEST` address
- Embeds the intent ID in an OP_RETURN output
- This transaction "fills" the intent by providing the required Bitcoin proof

### Step 5: Get Bitcoin Block Height

Extract the block height where the Bitcoin transaction was confirmed:

```bash
# Get the block hash for our transaction
BLOCKHASH=$($BCLI getrawtransaction "$TXID" 1 | jq -r .blockhash)
if [ -z "$BLOCKHASH" ] || [ "$BLOCKHASH" = "null" ]; then
  # If not confirmed, mine a block
  MINE_TO=$($BCLI getnewaddress mine bech32)
  $BCLI generatetoaddress 1 "$MINE_TO" >/dev/null
  BLOCKHASH=$($BCLI getrawtransaction "$TXID" 1 | jq -r .blockhash)
fi

# Get block height and convert to little-endian format
export HEIGHT=$($BCLI getblockheader "$BLOCKHASH" | jq -r .height)
export LE=$(python3 -c 'import struct,os;print("0x"+struct.pack("<Q", int(os.environ["HEIGHT"])) .hex())')
echo "little endian: $LE"
```

**What this does:**
- Finds the block height where the Bitcoin transaction was confirmed
- Converts the height to little-endian format (required by the intent)
- This height proves the Bitcoin transaction was included in a block

### Step 6: Solve the Intent

Finally, solve the intent by providing the Bitcoin block height proof:

```bash
cast send -r <rpc-url> --legacy --async --private-key <private-key> \
  <contract> \
  "function solveIntent(bytes32 intentId, bytes data) payable" \
  "$INTENT_ID" "$LE"
```

**What this does:**
- Submits the Bitcoin block height as proof
- Core Lane verifies the Bitcoin transaction and block height
- If valid, the intent is solved and your RISC-V kernel can be executed