---
layout: docs
title: Development
---

# Development Guide

## Project Structure

### Core Lane
- **Repository**: `https://github.com/lanelayer/core-lane`
- **Language**: Rust
- **Purpose**: Bitcoin-anchored execution environment

**Key Files:**
- `src/main.rs` - CLI interface and node orchestration
- `src/rpc.rs` - JSON-RPC server implementation
- `src/transaction.rs` - Transaction and intent data structures
- `src/account.rs` - Account management
- `src/taproot_da.rs` - Taproot data availability

### Filler Bot
- **Repository**: `https://github.com/lanelayer/filler-bot`
- **Language**: Rust
- **Purpose**: Intent fulfillment system

**Key Files:**
- `src/main.rs` - CLI interface
- `src/filler_bot.rs` - Core bot logic
- `src/core_lane_client.rs` - Core Lane RPC client
- `src/bitcoin_client.rs` - Bitcoin RPC client
- `src/intent_manager.rs` - Intent state management
- `src/intent_types.rs` - Intent data structures

## Building

### Core Lane
```bash
git clone https://github.com/lanelayer/core-lane.git
cd core-lane
cargo build --release
```

### Filler Bot
```bash
git clone https://github.com/lanelayer/filler-bot.git
cd filler-bot
cargo build --release
```

## Testing

### Core Lane Tests
```bash
cd core-lane
cargo test
```

### Filler Bot Tests
```bash
cd filler-bot
cargo test
```

### Simulator Tests
```bash
cd filler-bot
./target/release/lanelayer-filler-bot test-simulator \
  --simulator-address "0x..."
```

## Development Environment

### Prerequisites
- **Rust** (1.70+)
- **Bitcoin Core** (24.0+)
- **Git**

### Setup
1. Start Bitcoin node in regtest mode
2. Run Core Lane node
3. Run Filler Bot
4. Test with simulator contract

### Local Development
```bash
# Terminal 1: Bitcoin
bitcoind -regtest -daemon
bitcoin-cli -regtest createwallet "mine"
bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)

# Terminal 2: Core Lane
cd core-lane
cargo run -- start --rpc-password "bitcoin123"

# Terminal 3: Filler Bot
cd filler-bot
cargo run -- start --bitcoin-rpc-password "bitcoin123" --filler-address "0x1234567890123456789012345678901234567890"
```

## Code Structure

### Core Lane Architecture

#### Main Components
- **CoreLaneNode**: Main node orchestrator
- **CoreLaneState**: State management
- **RpcServer**: JSON-RPC interface
- **AccountManager**: Account state management
- **TaprootDA**: Data availability layer

#### Data Structures
```rust
struct CoreLaneBlock {
    number: u64,
    hash: B256,
    parent_hash: B256,
    timestamp: u64,
    transactions: Vec<StoredTransaction>,
    bitcoin_block_hash: B256,
}

struct CoreLaneState {
    account_manager: AccountManager,
    transactions: HashMap<B256, StoredTransaction>,
    transaction_receipts: HashMap<B256, TransactionReceipt>,
    blocks: Vec<CoreLaneBlock>,
    block_hashes: HashMap<u64, B256>,
    intents: HashMap<B256, UserIntent>,
    bitcoin_client: Client,
}
```

### Filler Bot Architecture

#### Main Components
- **FillerBot**: Core bot logic
- **CoreLaneClient**: Core Lane RPC client
- **BitcoinClient**: Bitcoin RPC client
- **IntentManager**: Intent state management
- **IntentContract**: Contract interaction

#### Data Structures
```rust
struct UserIntent {
    intent_id: B256,
    user_address: Address,
    btc_destination: String,
    lane_btc_amount: U256,
    fee: U256,
    status: IntentStatus,
    created_at: u64,
    bitcoin_txid: Option<String>,
    bitcoin_confirmations: u32,
}

enum IntentStatus {
    Pending,
    Locked,
    Fulfilling,
    Fulfilled,
    Solved,
    Failed,
}
```

## API Development

### JSON-RPC Methods
Core Lane supports standard Ethereum JSON-RPC methods:

- `eth_getBalance`
- `eth_getTransactionCount`
- `eth_sendRawTransaction`
- `eth_getTransactionByHash`
- `eth_getTransactionReceipt`
- `eth_blockNumber`
- `eth_getBlockByNumber`
- `eth_getBlockByHash`
- `eth_chainId`
- `eth_gasPrice`
- `eth_estimateGas`
- `eth_call`
- `eth_getStorageAt`

### Adding New Methods
1. Add method to `RpcServer` struct
2. Implement handler function
3. Add to method dispatcher
4. Update documentation

## Intent System Development

### Adding New Intent Types
1. Define data structure in `intent_types.rs`
2. Add to `IntentType` enum
3. Implement CBOR serialization
4. Update parsing logic
5. Add tests

### Example Intent Type
```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
struct NewIntentType {
    field1: String,
    field2: U256,
    field3: Vec<u8>,
}

impl CborEncode for NewIntentType {
    fn cbor_encode(&self) -> Result<Vec<u8>, CborError> {
        // Implementation
    }
}

impl CborDecode for NewIntentType {
    fn cbor_decode(data: &[u8]) -> Result<Self, CborError> {
        // Implementation
    }
}
```

## Testing

### Unit Tests
```bash
cargo test
```

### Integration Tests
```bash
cargo test --test integration
```

### Manual Testing
1. Start Bitcoin node
2. Run Core Lane node
3. Run Filler Bot
4. Create test intents
5. Verify fulfillment

## Debugging

### Logging
Both projects use `tracing` for structured logging:

```rust
use tracing::{info, warn, error, debug};

info!("Starting Core Lane Node");
warn!("Low Bitcoin balance: {} sats", balance);
error!("Failed to process block: {}", error);
debug!("Processing transaction: {}", tx_hash);
```

### Environment Variables
```bash
export RUST_LOG=debug
export RUST_LOG=lanelayer_filler_bot=info
export RUST_LOG=core_lane_node=debug
```

### Common Issues
- **Bitcoin RPC errors**: Check credentials and wallet
- **Core Lane connection**: Verify node is running
- **Intent parsing**: Check CBOR encoding
- **Bitcoin send failures**: Verify wallet has funds

## Contributing

### Code Style
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Follow Rust conventions
- Add documentation for public APIs

### Pull Requests
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit pull request

### Commit Messages
- Use clear, descriptive messages
- Reference issues when applicable
- Follow conventional commit format

## License

All rights reserved for now.

<div class="page-navigation">
  <a href="/docs/api-reference.html" class="nav-button prev">
    <span class="nav-arrow">←</span>
    <span class="nav-text">Previous: API Reference</span>
  </a>
  <a href="/" class="nav-button next">
    <span class="nav-text">Next: Home</span>
    <span class="nav-arrow">→</span>
  </a>
</div>