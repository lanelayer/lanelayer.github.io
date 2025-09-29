---
layout: docs
title: Intent System API
---

# Intent System API Reference

Complete API documentation for the LaneLayer Intent System smart contract.

## Overview

The Intent System is a smart contract that manages intent-based transactions on LaneLayer. It provides functions for creating, locking, and solving intents.

## Contract Address

```
0x0000000000000000000000000000000000000045
```

## Interface

```solidity
interface IntentSystem {
    // Intent Management
    function intent(bytes memory intentData, uint256 nonce) 
        external payable returns (bytes32 intentId);
    
    function lockIntentForSolving(bytes32 intentId, bytes memory data) 
        external payable;
    
    function solveIntent(bytes32 intentId, bytes memory data) 
        external payable;
    
    // Intent Queries
    function isIntentSolved(bytes32 intentId) 
        external view returns (bool);
    
    function intentLocker(bytes32 intentId) 
        external view returns (address);
    
    function valueStoredInIntent(bytes32 intentId) 
        external view returns (uint256);
    
    // Blob Management
    function storeBlob(bytes memory data, uint256 expiryTime) 
        external payable;
    
    function prolongBlob(bytes32 blobHash) 
        external payable;
    
    function blobStored(bytes32 blobHash) 
        external view returns (bool);
    
    // Intent from Blob
    function intentFromBlob(bytes32 blobHash, uint256 nonce, bytes memory extraData) 
        external payable returns (bytes32 encumberFromBlob);
    
    // Intent Cancellation
    function cancelIntent(bytes32 intentId, bytes memory data) 
        external payable;
    
    function cancelIntentLock(bytes32 intentId, bytes memory data) 
        external payable;
}
```

## Functions

### intent

Create a new intent.

**Function Signature:**
```solidity
function intent(bytes memory intentData, uint256 nonce) 
    external payable returns (bytes32 intentId)
```

**Parameters:**
- `intentData` (bytes): CBOR-encoded intent data
- `nonce` (uint256): User's nonce for intent ID calculation

**Returns:**
- `intentId` (bytes32): Unique intent identifier

**Example:**
```solidity
// Create AnchorBitcoinFill intent
bytes memory intentData = abi.encode(IntentData({
    intent_type: IntentType.AnchorBitcoinFill,
    data: abi.encode(AnchorBitcoinFill({
        bitcoin_address: "tb1qexample123456789",
        amount: 100000,
        max_fee: 1000,
        expire_by: block.timestamp + 3600
    }))
}));

bytes32 intentId = intentSystem.intent{value: 100000}(intentData, nonce);
```

**Gas Cost:** ~50,000 gas + value

### lockIntentForSolving

Lock an intent for fulfillment by a filler bot.

**Function Signature:**
```solidity
function lockIntentForSolving(bytes32 intentId, bytes memory data) 
    external payable
```

**Parameters:**
- `intentId` (bytes32): Intent identifier
- `data` (bytes): Additional data (can be empty)

**Requirements:**
- Intent must not already be locked
- Caller must have sufficient laneBTC for gas
- Intent must not be expired

**Example:**
```solidity
// Lock intent for solving
intentSystem.lockIntentForSolving{value: 1000}(intentId, "");
```

**Gas Cost:** ~30,000 gas

### solveIntent

Solve a fulfilled intent and claim the laneBTC payment.

**Function Signature:**
```solidity
function solveIntent(bytes32 intentId, bytes memory data) 
    external payable
```

**Parameters:**
- `intentId` (bytes32): Intent identifier
- `data` (bytes): Bitcoin block number or other proof data

**Requirements:**
- Intent must be locked by the caller
- Intent must be fulfilled (Bitcoin transaction confirmed)
- Intent must not be expired

**Example:**
```solidity
// Solve intent with Bitcoin block number
bytes memory blockNumber = abi.encodePacked(block.number);
intentSystem.solveIntent{value: 1000}(intentId, blockNumber);
```

**Gas Cost:** ~40,000 gas

### isIntentSolved

Check if an intent has been solved.

**Function Signature:**
```solidity
function isIntentSolved(bytes32 intentId) 
    external view returns (bool)
```

**Parameters:**
- `intentId` (bytes32): Intent identifier

**Returns:**
- `solved` (bool): True if intent is solved

**Example:**
```solidity
bool solved = intentSystem.isIntentSolved(intentId);
```

**Gas Cost:** ~2,000 gas (view function)

### intentLocker

Get the address that locked an intent.

**Function Signature:**
```solidity
function intentLocker(bytes32 intentId) 
    external view returns (address)
```

**Parameters:**
- `intentId` (bytes32): Intent identifier

**Returns:**
- `locker` (address): Address that locked the intent (zero address if not locked)

**Example:**
```solidity
address locker = intentSystem.intentLocker(intentId);
```

**Gas Cost:** ~2,000 gas (view function)

### valueStoredInIntent

Get the value stored in an intent.

**Function Signature:**
```solidity
function valueStoredInIntent(bytes32 intentId) 
    external view returns (uint256)
```

**Parameters:**
- `intentId` (bytes32): Intent identifier

**Returns:**
- `value` (uint256): Value in laneBTC

**Example:**
```solidity
uint256 value = intentSystem.valueStoredInIntent(intentId);
```

**Gas Cost:** ~2,000 gas (view function)

## Intent Data Format

### IntentData Structure

```rust
struct IntentData {
    intent_type: IntentType,    // 1 byte
    data: Vec<u8>,             // CBOR-encoded data
}
```

### IntentType Enum

```rust
enum IntentType {
    AnchorBitcoinFill = 1,
    // Future intent types will be added here
}
```

### AnchorBitcoinFill Structure

```rust
struct AnchorBitcoinFill {
    bitcoin_address: Vec<u8>,  // Bitcoin address as bytes
    amount: U256,              // Amount in laneBTC
    max_fee: U256,             // Maximum fee willing to pay
    expire_by: u64,            // Expiration timestamp
}
```

### CBOR Encoding

Intents use CBOR (Concise Binary Object Representation) for efficient serialization:

```rust
use ciborium::{from_reader, into_writer};
use std::io::Cursor;

// Serialize intent data
let intent_data = IntentData {
    intent_type: IntentType::AnchorBitcoinFill,
    data: fill_data.to_cbor()?,
};

let mut buffer = Vec::new();
into_writer(&intent_data, &mut buffer)?;

// Deserialize intent data
let mut cursor = Cursor::new(&buffer);
let intent_data: IntentData = from_reader(&mut cursor)?;
```

## Intent ID Calculation

Intent IDs are calculated using a deterministic hash:

```rust
use sha2::{Sha256, Digest};

fn calculate_intent_id(
    from: Address,
    nonce: u64,
    intent_data: Vec<u8>
) -> B256 {
    let mut hasher = Sha256::new();
    hasher.update(from.as_slice());
    hasher.update(&nonce.to_le_bytes());
    hasher.update(&intent_data);
    B256::from_slice(&hasher.finalize())
}
```

**Parameters:**
- `from`: User's address
- `nonce`: User's nonce
- `intent_data`: CBOR-encoded intent data

**Returns:**
- `intent_id`: 32-byte intent identifier

## Events

### IntentCreated

Emitted when a new intent is created.

```solidity
event IntentCreated(
    bytes32 indexed intentId,
    address indexed user,
    uint256 value,
    bytes intentData
);
```

### IntentLocked

Emitted when an intent is locked for solving.

```solidity
event IntentLocked(
    bytes32 indexed intentId,
    address indexed locker
);
```

### IntentSolved

Emitted when an intent is solved.

```solidity
event IntentSolved(
    bytes32 indexed intentId,
    address indexed solver,
    bytes data
);
```

### IntentCancelled

Emitted when an intent is cancelled.

```solidity
event IntentCancelled(
    bytes32 indexed intentId,
    address indexed user,
    bytes data
);
```

## Integration Examples

### JavaScript/TypeScript

```typescript
import { ethers } from 'ethers';

// Contract ABI
const intentSystemABI = [
  "function intent(bytes memory intentData, uint256 nonce) external payable returns (bytes32 intentId)",
  "function lockIntentForSolving(bytes32 intentId, bytes memory data) external payable",
  "function solveIntent(bytes32 intentId, bytes memory data) external payable",
  "function isIntentSolved(bytes32 intentId) external view returns (bool)",
  "function intentLocker(bytes32 intentId) external view returns (address)",
  "function valueStoredInIntent(bytes32 intentId) external view returns (uint256)"
];

// Connect to contract
const provider = new ethers.JsonRpcProvider('http://localhost:8545');
const wallet = new ethers.Wallet(privateKey, provider);
const intentSystem = new ethers.Contract(contractAddress, intentSystemABI, wallet);

// Create intent
const intentData = ethers.AbiCoder.defaultAbiCoder().encode(
  ['uint8', 'bytes'],
  [1, cborEncodedData]
);

const tx = await intentSystem.intent(intentData, nonce, { value: 100000 });
const receipt = await tx.wait();
const intentId = receipt.logs[0].args.intentId;

// Check if intent is solved
const solved = await intentSystem.isIntentSolved(intentId);

// Get intent locker
const locker = await intentSystem.intentLocker(intentId);
```

### Python

```python
from web3 import Web3
import json

# Contract ABI
intent_system_abi = [
    {
        "name": "intent",
        "type": "function",
        "inputs": [
            {"name": "intentData", "type": "bytes"},
            {"name": "nonce", "type": "uint256"}
        ],
        "outputs": [{"name": "intentId", "type": "bytes32"}],
        "stateMutability": "payable"
    },
    # ... other functions
]

# Connect to contract
w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))
intent_system = w3.eth.contract(
    address=contract_address,
    abi=intent_system_abi
)

# Create intent
intent_data = w3.codec.encode(['uint8', 'bytes'], [1, cbor_encoded_data])
tx = intent_system.functions.intent(intent_data, nonce).transact({
    'value': 100000,
    'from': account.address
})
receipt = w3.eth.wait_for_transaction_receipt(tx)
intent_id = receipt.logs[0].args.intentId

# Check if intent is solved
solved = intent_system.functions.isIntentSolved(intent_id).call()
```

### Rust

```rust
use alloy_sol_types::{sol, SolCall};
use alloy_provider::{Provider, RootProvider};

// Define the contract interface
sol! {
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
}

// Connect to contract
let provider = RootProvider::new("http://localhost:8545".parse()?);
let intent_system = IntentSystem::new(contract_address, &provider);

// Create intent
let intent_data = abi.encode(&[intent_type, cbor_data]);
let tx = intent_system.intent(intent_data, nonce).value(100000).send().await?;
let receipt = tx.get_receipt().await?;
let intent_id = receipt.logs[0].args.intentId;

// Check if intent is solved
let solved = intent_system.isIntentSolved(intent_id).call().await?;
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Intent already locked` | Intent is already locked by another bot | Wait for next intent |
| `Intent not found` | Invalid intent ID | Check intent ID format |
| `Intent expired` | Intent has passed expiration time | Create new intent |
| `Insufficient value` | Not enough laneBTC for gas | Add more laneBTC |
| `Invalid intent data` | Malformed intent data | Check CBOR encoding |

### Error Events

```solidity
event IntentError(
    bytes32 indexed intentId,
    string reason
);
```

## Gas Optimization

### Gas Costs

| Function | Gas Cost | Notes |
|----------|----------|-------|
| `intent` | ~50,000 + value | Depends on intent data size |
| `lockIntentForSolving` | ~30,000 | Fixed cost |
| `solveIntent` | ~40,000 | Fixed cost |
| `isIntentSolved` | ~2,000 | View function |
| `intentLocker` | ~2,000 | View function |
| `valueStoredInIntent` | ~2,000 | View function |

### Optimization Tips

1. **Batch operations** when possible
2. **Use view functions** for read-only operations
3. **Optimize intent data** size
4. **Cache results** of view functions
5. **Use appropriate gas limits**

## Security Considerations

### Intent Security

- **Atomic locking**: Only one bot can lock an intent
- **Time limits**: Intents expire if not fulfilled
- **Economic incentives**: Filler bots compete for profitable intents
- **Fee structure**: Prevents spam and ensures profitability

### Contract Security

- **Access control**: Only authorized functions can be called
- **Input validation**: All inputs are validated
- **Reentrancy protection**: Prevents reentrancy attacks
- **Integer overflow protection**: Safe math operations

### Best Practices

1. **Validate intent data** before processing
2. **Check intent status** before operations
3. **Handle errors gracefully**
4. **Monitor gas usage**
5. **Use events** for monitoring

## Testing

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_intent_creation() {
        // Test intent creation
    }
    
    #[test]
    fn test_intent_locking() {
        // Test intent locking
    }
    
    #[test]
    fn test_intent_solving() {
        // Test intent solving
    }
}
```

### Integration Tests

```rust
#[tokio::test]
async fn test_intent_lifecycle() {
    // Test complete intent lifecycle
}
```

### Test Data

```rust
fn create_test_intent() -> IntentData {
    IntentData {
        intent_id: "0x1234567890123456789012345678901234567890".to_string(),
        user_address: Address::from_str("0x1234567890123456789012345678901234567890").unwrap(),
        btc_destination: "tb1qexample123456789".to_string(),
        lane_btc_amount: U256::from(100000),
        fee: U256::from(1000),
    }
}
```

## Next Steps

1. **[Core Lane API](/api/core-lane)** - Core Lane node API reference
2. **[Filler Bot API](/api/filler-bot)** - Filler bot command-line interface
3. **[Getting Started](/docs/getting-started)** - Set up your development environment
4. **[Intent System Guide](/docs/intent-system)** - Detailed intent system documentation



