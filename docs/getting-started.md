---
layout: docs
title: Getting Started
---

# Getting Started with LaneLayer

## Prerequisites

- **Rust** (1.70+)
- **Bitcoin Core** (24.0+)
- **Git**

## Setup

### 1. Bitcoin Node

```bash
bitcoind -regtest -daemon
bitcoin-cli -regtest createwallet "mine"
bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)
```

### 2. Core Lane Node

```bash
git clone https://github.com/lanelayer/core-lane.git
cd core-lane
cargo build --release

./target/release/core-lane-node start \
  --rpc-url "http://127.0.0.1:18443" \
  --rpc-user "bitcoin" \
  --rpc-password "bitcoin123" \
  --rpc-wallet "mine" \
  --http-host "127.0.0.1" \
  --http-port "8545"
```

### 3. Filler Bot

```bash
git clone https://github.com/lanelayer/lanelayer-filler-bot.git
cd lanelayer-filler-bot
cargo build --release

./target/release/lanelayer-filler-bot start \
  --core-lane-url "http://127.0.0.1:8545" \
  --bitcoin-rpc-url "http://127.0.0.1:18443" \
  --bitcoin-rpc-user "bitcoin" \
  --bitcoin-rpc-password "bitcoin123" \
  --bitcoin-wallet "filler-bot" \
  --filler-address "0x1234567890123456789012345678901234567890" \
  --exit-marketplace "0x0000000000000000000000000000000000000045" \
  --poll-interval "10"
```

## Core Lane Commands

### start
Start the Core Lane node.

```bash
./target/release/core-lane-node start [OPTIONS]
```

**Required:**
- `--rpc-password <PASSWORD>`

**Optional:**
- `--rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--rpc-user <USER>` (default: `user`)
- `--rpc-wallet <WALLET>` (default: `mine`)
- `--start-block <BLOCK>`
- `--http-host <HOST>` (default: `127.0.0.1`)
- `--http-port <PORT>` (default: `8545`)

### burn
Create Bitcoin burn transaction.

```bash
./target/release/core-lane-node burn [OPTIONS]
```

**Required:**
- `--burn-amount <AMOUNT>`
- `--chain-id <ID>`
- `--eth-address <ADDRESS>`
- `--rpc-password <PASSWORD>`

**Optional:**
- `--rpc-wallet <WALLET>` (default: `mine`)
- `--rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--rpc-user <USER>` (default: `bitcoin`)

### send-transaction
Send transaction to Bitcoin DA.

```bash
./target/release/core-lane-node send-transaction [OPTIONS]
```

**Required:**
- `--raw-tx-hex <HEX>`
- `--rpc-password <PASSWORD>`

**Optional:**
- `--fee-sats <FEE>`
- `--rpc-wallet <WALLET>` (default: `mine`)
- `--rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--rpc-user <USER>` (default: `bitcoin`)

### construct-exit-intent
Construct exit intent data.

```bash
./target/release/core-lane-node construct-exit-intent [OPTIONS]
```

**Required:**
- `--bitcoin-address <ADDRESS>`
- `--amount <AMOUNT>`
- `--expire-by <TIMESTAMP>`

**Optional:**
- `--max-fee <FEE>` (default: `1000`)

## Filler Bot Commands

### start
Start the filler bot.

```bash
./target/release/lanelayer-filler-bot start [OPTIONS]
```

**Required:**
- `--bitcoin-rpc-password <PASSWORD>`
- `--filler-address <ADDRESS>`

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)
- `--bitcoin-rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--bitcoin-rpc-user <USER>` (default: `bitcoin`)
- `--bitcoin-wallet <WALLET>` (default: `filler-bot`)
- `--exit-marketplace <ADDRESS>` (default: `0x0000000000000000000000000000000000000045`)
- `--poll-interval <SECONDS>` (default: `10`)

### test-core-lane
Test Core Lane connection.

```bash
./target/release/lanelayer-filler-bot test-core-lane [OPTIONS]
```

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

### test-bitcoin
Test Bitcoin connection.

```bash
./target/release/lanelayer-filler-bot test-bitcoin [OPTIONS]
```

**Required:**
- `--bitcoin-rpc-password <PASSWORD>`

**Optional:**
- `--bitcoin-rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--bitcoin-rpc-user <USER>` (default: `bitcoin`)

### test-simulator
Test simulator contract.

```bash
./target/release/lanelayer-filler-bot test-simulator [OPTIONS]
```

**Required:**
- `--simulator-address <ADDRESS>`

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

## JSON-RPC API

Core Lane provides Ethereum-compatible JSON-RPC API on port 8545.

### Example Usage

```bash
# Get account balance
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x1234567890123456789012345678901234567890","latest"],"id":1}' \
  http://localhost:8545

# Get latest block number
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

## Intent System

### Creating Exit Intents

```bash
./target/release/core-lane-node construct-exit-intent \
  --bitcoin-address "tb1qexample123456789" \
  --amount 100000 \
  --max-fee 1000 \
  --expire-by 1234567890
```

### Burning Bitcoin for laneBTC

```bash
./target/release/core-lane-node burn \
  --burn-amount 100000 \
  --chain-id 1 \
  --eth-address "0x1234567890123456789012345678901234567890" \
  --rpc-wallet "mine" \
  --rpc-password "bitcoin123"
```

## Troubleshooting

### Common Issues

**Core Lane node won't start:**
- Ensure Bitcoin Core is running
- Check RPC credentials
- Verify wallet exists and has funds

**Filler bot can't connect:**
- Make sure Core Lane node is running on port 8545
- Check filler address is valid
- Ensure exit marketplace address is correct

**No laneBTC after burning:**
- Wait for Bitcoin transaction confirmation
- Check chain ID matches (should be 1 for Core Lane)
- Verify BRN1 data format is correct

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.

---

<div class="page-navigation">
  <div class="nav-previous">
    <a href="/" class="nav-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      <span>Home</span>
    </a>
  </div>
  <div class="nav-next">
    <a href="/docs/core-concepts.html" class="nav-link">
      <span>Core Concepts</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  </div>
</div>