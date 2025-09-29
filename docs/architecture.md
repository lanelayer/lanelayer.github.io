---
layout: docs
title: Architecture
---

# LaneLayer Architecture

LaneLayer consists of three main components: Bitcoin L1, Core Lane Node, and LaneLayer Filler Bot.

## System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Bitcoin L1    │    │   LaneLayer      │    │   Filler Bot    │
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

## Bitcoin L1

### Role
Provides settlement and security for LaneLayer deal coordination.

### Components
- **Bitcoin Blocks**: Deal coordination is anchored to Bitcoin blocks
- **Data Availability**: Deal data is embedded in Bitcoin transactions using Taproot envelopes
- **Bitcoin Burns**: Mechanism for minting laneBTC for deal coordination
- **Deal Settlement**: All deals ultimately settle back to Bitcoin for miner revenue

### BRN1 Protocol
- **Format**: `OP_RETURN` + `BRN1` + `ChainID` + `Address` + `Amount`
- **Purpose**: Burn Bitcoin and mint laneBTC for deal coordination
- **Security**: Immutable on Bitcoin blockchain

## Core Lane Node

### Role
EVM-compatible execution environment anchored to Bitcoin.

### Components

#### Bitcoin Block Scanner
- Continuously monitors Bitcoin blockchain
- Processes new blocks for Core Lane transactions
- Maintains synchronization with Bitcoin

#### Transaction Processor
- **Burn Processor**: Identifies Bitcoin burn transactions and mints laneBTC
- **DA Transaction Processor**: Extracts and executes Ethereum-style transactions from Taproot envelopes

#### State Management
- **Account Manager**: Manages account balances, nonces, and contract state
- **Block Manager**: Maintains Core Lane block history
- **Transaction Manager**: Tracks transaction receipts and status

#### JSON-RPC Server
- **Ethereum Compatibility**: Supports standard Ethereum RPC methods
- **Core Lane Extensions**: Additional methods for Core Lane-specific functionality
- **Port**: 8545 (default)

### Data Structures

#### CoreLaneBlock
```rust
struct CoreLaneBlock {
    number: u64,
    hash: B256,
    parent_hash: B256,
    timestamp: u64,
    transactions: Vec<StoredTransaction>,
    bitcoin_block_hash: B256,
}
```

#### CoreLaneState
```rust
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

## Filler Bot

### Role
Automated system for fulfilling user intents.

### Components

#### Core Lane Client
- Connects to Core Lane Node's JSON-RPC interface
- Monitors for new blocks and transactions
- Interacts with IntentSystem contract

#### Bitcoin Client
- Connects to Bitcoin node's RPC interface
- Sends Bitcoin transactions
- Monitors transaction confirmations

#### Intent Manager
- Tracks intent lifecycle states
- Manages intent fulfillment logic
- Handles error recovery

### Intent Lifecycle States

```rust
enum IntentStatus {
    Pending,
    Locked,
    Fulfilling,
    Fulfilled,
    Solved,
    Failed,
}
```

### Data Structures

#### UserIntent
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
```

## Intent System Contract

### Interface
```solidity
interface IntentSystem {
    function intent(bytes memory intentData, uint256 nonce)
        external payable returns (bytes32 intentId);

    function lockIntentForSolving(bytes32 intentId, bytes memory data)
        external payable;

    function solveIntent(bytes32 intentId, bytes memory data)
        external payable;

    function isIntentSolved(bytes32 intentId)
        external view returns (bool);

    function intentLocker(bytes32 intentId)
        external view returns (address);

    function valueStoredInIntent(bytes32 intentId)
        external view returns (uint256);
}
```

### Address
- **Default**: `0x0000000000000000000000000000000000000045`
- **Purpose**: Central contract for managing intents

## Data Flow

### 1. Bitcoin Burn (Peg-in)
1. User sends Bitcoin with BRN1 data
2. Core Lane detects burn transaction
3. laneBTC minted to specified address
4. State updated on Core Lane

### 2. Intent Creation
1. User sends transaction to IntentSystem contract
2. Intent data stored in contract
3. Filler bot detects new intent
4. Intent added to bot's queue

### 3. Intent Fulfillment
1. Bot locks intent for fulfillment
2. Bot sends Bitcoin to user's address
3. Bot monitors Bitcoin confirmation
4. Bot calls solveIntent on Core Lane
5. laneBTC transferred to bot

### 4. Core Lane Transaction
1. User sends raw transaction to Core Lane
2. Transaction inscribed to Bitcoin via Taproot
3. Core Lane processes transaction
4. State updated on Core Lane

## Security Model

### Bitcoin Security
- **Proof of Work**: Inherits Bitcoin's security
- **Immutability**: All data permanently stored on Bitcoin
- **Decentralization**: No single point of failure

### Intent Security
- **Locking Mechanism**: Prevents double-spending
- **Time Expiry**: Intents expire after specified time
- **Economic Incentives**: Fees ensure proper behavior

### State Consistency
- **Bitcoin Anchoring**: All state changes backed by Bitcoin
- **Transaction Ordering**: Determined by Bitcoin block order
- **Finality**: Bitcoin confirmation provides finality

## Performance Considerations

### Bitcoin Integration
- **Block Time**: 10-minute average confirmation time
- **Data Size**: Taproot envelopes optimize data storage
- **Cost**: Bitcoin transaction fees for data availability

### Core Lane Performance
- **EVM Compatibility**: Standard Ethereum performance
- **State Management**: In-memory state for fast access
- **RPC Interface**: Standard JSON-RPC for compatibility

### Filler Bot Efficiency
- **Polling**: Configurable polling interval
- **Parallel Processing**: Multiple intents processed simultaneously
- **Error Recovery**: Robust error handling and retry logic

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.

<div class="page-navigation">
  <a href="/docs/core-concepts.html" class="nav-button prev">
    <span class="nav-arrow">←</span>
    <span class="nav-text">Previous: Core Concepts</span>
  </a>
  <a href="/docs/intent-system.html" class="nav-button next">
    <span class="nav-text">Next: Intent System</span>
    <span class="nav-arrow">→</span>
  </a>
</div>