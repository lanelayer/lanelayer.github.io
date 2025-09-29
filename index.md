---
layout: default
title: LaneLayer
---

<div class="homepage-hero">
    <h1>LaneLayer</h1>
    <p>Coordination layer for deals, anchored in Bitcoin</p>
    <p style="font-size: 1.1rem; color: var(--text-muted); margin-top: 1rem;">Making Bitcoin more useful and more secure</p>
</div>

Bitcoin today is the most trusted money on the internet — but it's limited: You can send and hold BTC, but building apps usually means centralized exchanges or risky bridges. Miners earn less and less from block rewards, so Bitcoin's long-term security budget is shrinking.

**LaneLayer changes this:**

It lets people do trustless deals, swaps, lending, betting, and payments anchored in Bitcoin — without locking BTC in giant risky contracts. All of this still settles back to Bitcoin, so miners earn more transaction fees as usage grows. Developers can build distributed apps, DeFi protocols, even games — all tied directly to BTC, without breaking Bitcoin's simplicity or security.

**→ LaneLayer makes Bitcoin more useful (apps and DeFi) and more secure (fees for miners).**

It's like giving Bitcoin smart superpowers without changing its core. We will later extend same principles to Ethereum and other chains.

<div class="feature-grid">
    <div class="feature-card">
        <h3>
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Bitcoin Anchored
        </h3>
        <ul>
            <li>No Locked BTC: Deals happen without locking Bitcoin in risky contracts</li>
            <li>Miner Revenue: All activity settles back to Bitcoin, increasing miner fees</li>
            <li>BRN1 Protocol: Secure Bitcoin burning for laneBTC minting</li>
            <li>Taproot Integration: Efficient data storage using Bitcoin's Taproot</li>
        </ul>
    </div>

    <div class="feature-card">
        <h3>
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
            Trustless Deals
        </h3>
        <ul>
            <li>Swaps & Lending: Trustless deals without centralized exchanges</li>
            <li>Intent-Based: Express what you want, not how to do it</li>
            <li>Automated Fulfillment: LaneLayer Filler Bot executes deals</li>
            <li>No Counterparty Risk: Deals settle directly to Bitcoin</li>
        </ul>
    </div>

    <div class="feature-card">
        <h3>
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Developer Platform
        </h3>
        <ul>
            <li>DeFi & Games: Build distributed apps tied directly to BTC</li>
            <li>Ethereum-Compatible: Full EVM compatibility for existing dApps</li>
            <li>Bitcoin Security: Maintains Bitcoin's simplicity and security</li>
            <li>Future Multi-Chain: Will extend to Ethereum and other chains</li>
        </ul>
    </div>
</div>

## How LaneLayer Works

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Bitcoin L1    │    │   LaneLayer      │    │   Filler Bots   │
│   (Settlement)  │    │   (Coordination) │    │   (Deal Fulfill)│
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Anchor Deals       │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 2. Settlement Data    │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │                       │ 3. Detect Deals       │
         │                       │◀──────────────────────│
         │                       │                       │
         │ 4. Execute Deals      │                       │
         │◀──────────────────────│                       │
```

**LaneLayer is a coordination layer that:**
- Anchors deals in Bitcoin without locking BTC
- Coordinates trustless swaps, lending, and payments
- Settles everything back to Bitcoin for miner revenue
- Enables DeFi and apps tied directly to BTC

## Quick Start

### 1. Set Up Bitcoin Node

```bash
bitcoind -regtest -daemon
bitcoin-cli -regtest createwallet "mine"
bitcoin-cli -regtest generatetoaddress 101 $(bitcoin-cli -regtest getnewaddress)
```

### 2. Run Core Lane Node

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

### 3. Deploy Filler Bot

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

### 4. Create Exit Intent

```bash
./target/release/core-lane-node construct-exit-intent \
  --bitcoin-address "tb1qexample123456789" \
  --amount 100000 \
  --max-fee 1000 \
  --expire-by 1234567890
```

## Core Lane Commands

### start
Start the Core Lane node.

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

**Required:**
- `--bitcoin-address <ADDRESS>`
- `--amount <AMOUNT>`
- `--expire-by <TIMESTAMP>`

**Optional:**
- `--max-fee <FEE>` (default: `1000`)

## Filler Bot Commands

### start
Start the filler bot.

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

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

### test-bitcoin
Test Bitcoin connection.

**Required:**
- `--bitcoin-rpc-password <PASSWORD>`

**Optional:**
- `--bitcoin-rpc-url <URL>` (default: `http://127.0.0.1:18443`)
- `--bitcoin-rpc-user <USER>` (default: `bitcoin`)

### test-simulator
Test simulator contract.

**Required:**
- `--simulator-address <ADDRESS>`

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

## JSON-RPC API

Core Lane provides a basic JSON-RPC API on port 8545 with limited Ethereum-compatible methods.

### Implemented Methods

- `eth_getBalance` - Get account balance
- `eth_getTransactionCount` - Get transaction count
- `eth_getCode` - Get contract code
- `eth_sendRawTransaction` - Send raw transaction
- `eth_getTransactionByHash` - Get transaction by hash
- `eth_getTransactionReceipt` - Get transaction receipt
- `eth_blockNumber` - Get latest block number
- `eth_getBlockByNumber` - Get block by number
- `eth_getBlockByHash` - Get block by hash
- `eth_chainId` - Get chain ID
- `eth_gasPrice` - Get gas price
- `eth_estimateGas` - Estimate gas
- `eth_call` - Execute call
- `eth_getStorageAt` - Get storage value

**Note**: This is an early implementation. Many methods may not be fully functional or may have limited capabilities.

## Intent System

The IntentSystem is a smart contract that manages user intents for cross-chain operations.

### Contract Interface

```solidity
interface IntentSystem {
    function storeBlob(bytes data, uint256 expiryTime) payable;
    function prolongBlob(bytes32 blobHash) payable;
    function blobStored(bytes32 blobHash) view returns (bool);
    function intent(bytes intentData, uint256 nonce) payable returns (bytes32 intentId);
    function intentFromBlob(bytes32 blobHash, uint256 nonce, bytes extraData) payable returns (bytes32 encumberFromBlob);
    function cancelIntent(bytes32 intentId, bytes data) payable;
    function lockIntentForSolving(bytes32 intentId, bytes data) payable;
    function solveIntent(bytes32 intentId, bytes data) payable;
    function cancelIntentLock(bytes32 intentId, bytes data) payable;
    function isIntentSolved(bytes32 intentId) view returns (bool);
    function intentLocker(bytes32 intentId) view returns (address);
    function valueStoredInIntent(bytes32 intentId) view returns (uint256);
}
```

### Intent Types

- `AnchorBitcoinFill` - Convert laneBTC to Bitcoin

### Intent Data Structure

```rust
struct IntentData {
    intent_type: IntentType,
    data: Vec<u8>, // CBOR-encoded
}

enum IntentType {
    AnchorBitcoinFill = 1,
}

struct AnchorBitcoinFill {
    bitcoin_address: Vec<u8>,
    amount: U256,
    max_fee: U256,
    expire_by: u64,
}
```

### Intent Lifecycle

1. **Creation** - User sends transaction to IntentSystem contract
2. **Detection** - Filler bot monitors Core Lane blocks
3. **Locking** - Bot calls lockIntentForSolving to claim intent
4. **Fulfillment** - Bot sends Bitcoin to user's address
5. **Solving** - Bot calls solveIntent to finalize intent
6. **Completion** - laneBTC transferred to bot

## Terminology

**Core Lane**: A Bitcoin-anchored execution environment that processes Bitcoin burns and Core Lane DA transactions.

**LaneLayer Filler Bot**: An automated system that listens for user intents on Core Lane and fulfills them by exchanging laneBTC for BTC.

**Intent System**: A smart contract on Core Lane that manages user intents for Bitcoin operations.

**BRN1 Format**: A specific format used in Bitcoin OP_RETURN outputs for burning Bitcoin and minting tokens on Core Lane.

**Taproot DA**: Data availability layer on Bitcoin using Taproot envelopes for Core Lane transactions.

**laneBTC**: Bitcoin tokens minted on Core Lane when Bitcoin is burned.

**Exit Marketplace**: A contract that facilitates the exchange of laneBTC back to Bitcoin.

## FAQ

**Q: What is LaneLayer?**
A: LaneLayer is a Bitcoin-anchored execution environment that enables Bitcoin operations through an intent-based system, allowing users to burn Bitcoin and receive laneBTC tokens on Core Lane.

**Q: How does the Filler Bot work?**
A: The Filler Bot monitors the Intent System for user requests, then fulfills them by exchanging laneBTC for actual Bitcoin, providing liquidity for the system.

**Q: What is the BRN1 format?**
A: BRN1 is a standardized format for Bitcoin OP_RETURN outputs that contains the necessary data to burn Bitcoin and mint corresponding tokens on Core Lane.

**Q: How do I get started?**
A: Start by setting up a Bitcoin node, then run the Core Lane node and Filler Bot. See the Getting Started guide for detailed instructions.

**Q: Is this production ready?**
A: This is an early implementation. The architecture and APIs may change significantly as development progresses.

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.

## License
