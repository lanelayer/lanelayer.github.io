---
layout: docs
title: Intent System
---

# Intent System

The Intent System is a smart contract deployed on Core Lane that manages user intents for cross-chain operations.

## Overview

The IntentSystem contract serves as the central mechanism for users to express their desire to perform cross-chain operations, particularly for withdrawing laneBTC to Bitcoin.

### Contract Address
- **Default**: `0x0000000000000000000000000000000000000045`
- **Purpose**: Central contract for managing intents

## Interface

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

## Functions

### intent
Submit a new intent.

**Parameters:**
- `intentData`: CBOR-encoded intent data
- `nonce`: Unique number to prevent replay attacks

**Returns:**
- `intentId`: Unique identifier for the intent

**Payable:** Yes (sends laneBTC with the transaction)

### lockIntentForSolving
Lock an intent for fulfillment.

**Parameters:**
- `intentId`: Intent identifier
- `data`: Additional data (currently unused)

**Payable:** Yes

**Purpose:** Prevents other bots from fulfilling the same intent

### solveIntent
Solve a locked intent.

**Parameters:**
- `intentId`: Intent identifier
- `data`: Additional data (currently unused)

**Payable:** Yes

**Purpose:** Finalizes the intent and transfers laneBTC to the solver

### isIntentSolved
Check if an intent has been solved.

**Parameters:**
- `intentId`: Intent identifier

**Returns:**
- `bool`: True if solved, false otherwise

### intentLocker
Get the address that locked an intent.

**Parameters:**
- `intentId`: Intent identifier

**Returns:**
- `address`: Address of the locker, or zero address if not locked

### valueStoredInIntent
Get the laneBTC value stored in an intent.

**Parameters:**
- `intentId`: Intent identifier

**Returns:**
- `uint256`: Amount of laneBTC stored

## Intent Types

### AnchorBitcoinFill
Convert laneBTC to Bitcoin.

**Data Structure:**
```rust
struct AnchorBitcoinFill {
    bitcoin_address: Vec<u8>,
    amount: U256,
    max_fee: U256,
    expire_by: u64,
}
```

**Fields:**
- `bitcoin_address`: Target Bitcoin address (as bytes)
- `amount`: Amount of BTC to send (in satoshis)
- `max_fee`: Maximum fee user is willing to pay
- `expire_by`: Timestamp when intent expires

## Intent Lifecycle

### 1. Creation
User calls `intent` function with CBOR-encoded intent data and sends laneBTC.

### 2. Detection
Filler bot monitors Core Lane blocks for transactions to the IntentSystem contract.

### 3. Parsing
Bot decodes the intent data to extract user's requirements.

### 4. Locking
Bot calls `lockIntentForSolving` to claim the intent for fulfillment.

### 5. Fulfillment
Bot sends Bitcoin to user's specified address.

### 6. Confirmation
Bot monitors Bitcoin transaction for confirmations.

### 7. Solving
Bot calls `solveIntent` to finalize the intent and claim laneBTC.

## Intent Data Format

### CBOR Encoding
Intent data is serialized using CBOR (Concise Binary Object Representation).

### Structure
```rust
struct IntentData {
    intent_type: IntentType,
    data: Vec<u8>, // CBOR-encoded specific data
}

enum IntentType {
    AnchorBitcoinFill = 1,
}
```

### Example
For an AnchorBitcoinFill intent:
1. Encode `AnchorBitcoinFill` struct as CBOR
2. Wrap in `IntentData` with `intent_type = 1`
3. Encode `IntentData` as CBOR
4. Send as `intentData` parameter

## Security Considerations

### Replay Protection
- **Nonce**: Each intent must have a unique nonce
- **Sender**: Intent ID includes sender address
- **Expiry**: Intents expire after specified time

### Locking Mechanism
- **Single Locker**: Only one address can lock an intent
- **Atomic Operations**: Locking and fulfillment are atomic
- **Time Limits**: Intents can expire if not fulfilled

### Economic Incentives
- **Fees**: Users pay fees for intent fulfillment
- **Rewards**: Filler bots receive laneBTC for successful fulfillment
- **Penalties**: Failed fulfillments may result in penalties

## Error Handling

### Common Errors
- **Intent Not Found**: Invalid intent ID
- **Already Locked**: Intent already locked by another bot
- **Already Solved**: Intent already solved
- **Insufficient Value**: Not enough laneBTC sent with intent
- **Expired Intent**: Intent has expired

### Recovery
- **Retry Logic**: Failed operations can be retried
- **State Queries**: Check intent state before operations
- **Error Logging**: Detailed error information for debugging

## Development Status

### Completed
- Basic contract interface
- Intent creation and management
- Locking mechanism
- Solving mechanism

### In Progress
- Advanced error handling
- Gas optimization
- Additional intent types

### TODO
- Intent cancellation
- Fee management
- Advanced security features
- Monitoring and metrics

## License

All rights reserved for now.

<div class="page-navigation">
  <a href="/docs/architecture.html" class="nav-button prev">
    <span class="nav-arrow">←</span>
    <span class="nav-text">Previous: Architecture</span>
  </a>
  <a href="/docs/filler-bot.html" class="nav-button next">
    <span class="nav-text">Next: Filler Bot</span>
    <span class="nav-arrow">→</span>
  </a>
</div>