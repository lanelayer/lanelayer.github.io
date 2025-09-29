---
layout: docs
title: Core Lane RPC API
---

# Core Lane JSON-RPC API

Core Lane provides Ethereum-compatible JSON-RPC API on port 8545.

## Endpoint

```
http://127.0.0.1:8545
```

## Methods

### eth_getBalance
Get account balance.

**Parameters:**
- `address` (string): Account address
- `block` (string): Block number or "latest"

**Returns:**
- `string`: Balance in wei (hex)

**Example:**
```json
{
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": ["0x1234567890123456789012345678901234567890", "latest"],
  "id": 1
}
```

### eth_getTransactionCount
Get transaction count (nonce).

**Parameters:**
- `address` (string): Account address
- `block` (string): Block number or "latest"

**Returns:**
- `string`: Transaction count (hex)

### eth_sendRawTransaction
Send raw transaction.

**Parameters:**
- `data` (string): RLP-encoded transaction

**Returns:**
- `string`: Transaction hash

### eth_getTransactionByHash
Get transaction by hash.

**Parameters:**
- `txHash` (string): Transaction hash

**Returns:**
- `object`: Transaction object or null

### eth_getTransactionReceipt
Get transaction receipt.

**Parameters:**
- `txHash` (string): Transaction hash

**Returns:**
- `object`: Receipt object or null

### eth_blockNumber
Get latest block number.

**Parameters:** None

**Returns:**
- `string`: Block number (hex)

### eth_getBlockByNumber
Get block by number.

**Parameters:**
- `block` (string): Block number or "latest"
- `full` (boolean): Include full transaction objects

**Returns:**
- `object`: Block object or null

### eth_getBlockByHash
Get block by hash.

**Parameters:**
- `blockHash` (string): Block hash
- `full` (boolean): Include full transaction objects

**Returns:**
- `object`: Block object or null

### eth_chainId
Get chain ID.

**Parameters:** None

**Returns:**
- `string`: Chain ID (hex)

### eth_gasPrice
Get gas price.

**Parameters:** None

**Returns:**
- `string`: Gas price in wei (hex)

### eth_estimateGas
Estimate gas for transaction.

**Parameters:**
- `callObject` (object): Transaction call object
- `block` (string): Block number or "latest"

**Returns:**
- `string`: Gas estimate (hex)

### eth_call
Execute call.

**Parameters:**
- `callObject` (object): Call object
- `block` (string): Block number or "latest"

**Returns:**
- `string`: Call result (hex)

### eth_getStorageAt
Get storage value.

**Parameters:**
- `address` (string): Contract address
- `position` (string): Storage position (hex)
- `block` (string): Block number or "latest"

**Returns:**
- `string`: Storage value (hex)

## Error Codes

| Code | Name | Description |
|------|------|-------------|
| -32600 | Invalid Request | The JSON sent is not a valid Request object |
| -32601 | Method not found | The method does not exist |
| -32602 | Invalid params | Invalid method parameter(s) |
| -32603 | Internal error | Internal JSON-RPC error |

## Example Usage

### Get Account Balance
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x1234567890123456789012345678901234567890","latest"],"id":1}' \
  http://localhost:8545
```

### Get Latest Block
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545
```

### Send Raw Transaction
```bash
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["0x..."],"id":1}' \
  http://localhost:8545
```

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.