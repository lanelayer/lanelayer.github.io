---
layout: docs
title: API Reference
---

# API Reference

## Core Lane API

Core Lane provides a basic JSON-RPC API on port 8545 with limited Ethereum-compatible methods.

### Implemented Methods

| Method | Description | Status |
|--------|-------------|--------|
| `eth_getBalance` | Get account balance | ✅ Implemented |
| `eth_getTransactionCount` | Get transaction count | ✅ Implemented |
| `eth_getCode` | Get contract code | ✅ Implemented |
| `eth_sendRawTransaction` | Send raw transaction | ✅ Implemented |
| `eth_getTransactionByHash` | Get transaction by hash | ✅ Implemented |
| `eth_getTransactionReceipt` | Get transaction receipt | ✅ Implemented |
| `eth_blockNumber` | Get latest block number | ✅ Implemented |
| `eth_getBlockByNumber` | Get block by number | ✅ Implemented |
| `eth_getBlockByHash` | Get block by hash | ✅ Implemented |
| `eth_chainId` | Get chain ID | ✅ Implemented |
| `eth_gasPrice` | Get gas price | ✅ Implemented |
| `eth_estimateGas` | Estimate gas | ✅ Implemented |
| `eth_call` | Execute call | ✅ Implemented |
| `eth_getStorageAt` | Get storage value | ✅ Implemented |

**Note**: This is an early implementation. Some methods may have limited functionality or may not work exactly like Ethereum.

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

## Intent System

### Intent Types

- `AnchorBitcoinFill` - Convert laneBTC to Bitcoin

### Intent Data Structure

```rust
struct IntentData {
    intent_type: IntentType,
    data: Vec<u8>, // CBOR-encoded
}

struct AnchorBitcoinFill {
    bitcoin_address: Vec<u8>,
    amount: U256,
    max_fee: U256,
    expire_by: u64,
}
```

### Intent Contract Interface

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

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| -32600 | Invalid Request | The JSON sent is not a valid Request object |
| -32601 | Method not found | The method does not exist |
| -32602 | Invalid params | Invalid method parameter(s) |
| -32603 | Internal error | Internal JSON-RPC error |

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.

<div class="page-navigation">
  <a href="/docs/filler-bot.html" class="nav-button prev">
    <span class="nav-arrow">←</span>
    <span class="nav-text">Previous: Filler Bot</span>
  </a>
  <a href="/docs/development.html" class="nav-button next">
    <span class="nav-text">Next: Development</span>
    <span class="nav-arrow">→</span>
  </a>
</div>