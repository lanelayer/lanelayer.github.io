---
layout: docs
title: Core Concepts
---

# Core Concepts

## LaneLayer Coordination Layer

LaneLayer is a coordination layer for deals, anchored in Bitcoin. It enables trustless swaps, lending, betting, and payments without locking BTC in risky contracts.

### Deal Coordination
LaneLayer coordinates deals between parties using laneBTC tokens (minted by burning Bitcoin), but all deals ultimately settle back to Bitcoin. This ensures miners earn more fees as usage grows.

### Bitcoin Anchoring
LaneLayer achieves security by anchoring deal coordination to the Bitcoin blockchain without locking Bitcoin in contracts.

### Data Availability
Deal coordination data is stored on Bitcoin using Taproot envelopes. This ensures all deal data is publicly available and immutable on Bitcoin.

### Bitcoin Burns
Users can burn Bitcoin (send it to an unspendable address) on Bitcoin L1 to mint equivalent `laneBTC` tokens for deal coordination. This is a one-way peg-in mechanism.

## Deal Intent System

An intent represents a user's desire to perform a deal involving both Core Lane and Bitcoin.

### Intent Types
- **Anchor Bitcoin Fill Intent**: User wants to exchange `laneBTC` for real BTC on Bitcoin L1

### Deal Lifecycle
1. **Creation** - User sends transaction to IntentSystem contract
2. **Detection** - Filler bot monitors Core Lane blocks for deals
3. **Locking** - Bot calls lockIntentForSolving to claim deal
4. **Fulfillment** - Bot sends Bitcoin to user's address
5. **Solving** - Bot calls solveIntent to finalize deal
6. **Settlement** - Deal settles back to Bitcoin, miner earns fees

## LaneLayer Filler Bot

The LaneLayer Filler Bot is a deal fulfillment system that monitors and executes deals.

### Core Functions
- **Deal Monitoring**: Continuously monitors the `IntentSystem` contract on Core Lane for new deals
- **Deal Fulfillment**: Sends real BTC to user's specified Bitcoin address
- **LaneBTC Collection**: Receives user's `laneBTC` (plus fees) on Core Lane
- **Deal Settlement**: Ensures all deals settle back to Bitcoin for miner revenue

## Core Lane Node

The Core Lane node is the execution environment.

### Core Functions
- **Bitcoin Block Scanner**: Continuously scans the Bitcoin blockchain
- **Transaction Processing**: Identifies and processes two main types of transactions:
  - **Bitcoin Burns (BRN1)**: Processes transactions where Bitcoin is burned to mint `laneBTC`
  - **Core Lane DA Transactions**: Extracts and executes Ethereum-style transactions from Taproot envelopes
- **State Management**: Maintains account balances, transaction history, and block data
- **JSON-RPC Interface**: Exposes Ethereum-compatible JSON-RPC API

## BRN1 Protocol

BRN1 is the format used in Bitcoin `OP_RETURN` outputs for burning Bitcoin and minting tokens on Core Lane.

### Structure
- **OP_RETURN** opcode
- **BRN1** identifier (4 bytes)
- **Chain ID** (4 bytes)
- **Ethereum Address** (20 bytes)
- **Amount** (8 bytes)

## Taproot Data Availability

Core Lane uses Taproot envelopes for data availability.

### Structure
- **Taproot Output**: Contains Core Lane transaction data
- **Envelope Format**: Specific encoding for transaction data
- **Data Extraction**: Core Lane node extracts and processes envelope data

## Intent Data Format

Intent data is CBOR-encoded and contains:

### AnchorBitcoinFill Structure
```rust
struct AnchorBitcoinFill {
    bitcoin_address: Vec<u8>,
    amount: U256,
    max_fee: U256,
    expire_by: u64,
}
```

### CBOR Encoding
Intent data is serialized using CBOR (Concise Binary Object Representation) for efficient encoding and decoding.

## Account Management

Core Lane maintains account state including:

### Account Data
- **Balance**: laneBTC balance
- **Nonce**: Transaction count
- **Code**: Contract bytecode (if applicable)
- **Storage**: Contract storage (if applicable)

### State Transitions
Account state is updated through transaction execution, maintaining consistency with Bitcoin anchoring.

## Transaction Processing

### Bitcoin Burn Processing
1. Detect BRN1 format in Bitcoin transaction
2. Validate burn amount and destination
3. Mint equivalent laneBTC to specified address
4. Update account balances

### Core Lane Transaction Processing
1. Extract transaction from Taproot envelope
2. Validate transaction format
3. Execute transaction in EVM-compatible environment
4. Update account state
5. Generate transaction receipt

## Security Model

### Bitcoin Security
Core Lane inherits Bitcoin's security through anchoring. All state transitions are backed by Bitcoin's proof-of-work.

### Intent Security
Intents are secured through:
- **Locking Mechanism**: Prevents double-spending
- **Time Expiry**: Intents expire after specified time
- **Fee Structure**: Economic incentives for proper behavior

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.

---

<div class="page-navigation">
  <div class="nav-previous">
    <a href="/docs/getting-started.html" class="nav-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      <span>Getting Started</span>
    </a>
  </div>
  <div class="nav-next">
    <a href="/docs/architecture.html" class="nav-link">
      <span>Architecture</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  </div>
</div>