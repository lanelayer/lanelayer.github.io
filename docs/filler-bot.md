---
layout: docs
title: Filler Bot
---

# LaneLayer Filler Bot

The LaneLayer Filler Bot is an automated system that fulfills user intents by exchanging laneBTC for BTC.

## Overview

The Filler Bot monitors Core Lane for exit intents and fulfills them by sending real BTC to users' Bitcoin addresses.

### Core Functions
- **Intent Monitoring**: Monitors Core Lane blocks for new intents
- **Intent Fulfillment**: Sends BTC to user's specified address
- **LaneBTC Collection**: Receives user's laneBTC (plus fees) on Core Lane
- **Confirmation**: Monitors Bitcoin transaction confirmations and finalizes intents

## Commands

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

## Intent Lifecycle

### States
- **Pending**: Intent detected but not yet locked
- **Locked**: Bot has locked the intent for fulfillment
- **Fulfilling**: Bot is sending BTC to user
- **Fulfilled**: BTC sent and confirmed
- **Solved**: Intent solved on Core Lane
- **Failed**: Error occurred

### Process
1. **Detection**: Bot monitors Core Lane blocks for transactions to exit marketplace
2. **Parsing**: Bot decodes intent data from transaction
3. **Locking**: Bot attempts to lock intent for fulfillment
4. **Fulfillment**: Bot sends BTC to user's address
5. **Confirmation**: Bot monitors Bitcoin transaction confirmations
6. **Solving**: Bot calls solveIntent on Core Lane
7. **Completion**: laneBTC transferred to bot

## Configuration

### Core Lane Connection
- **URL**: JSON-RPC endpoint (default: `http://127.0.0.1:8545`)
- **Authentication**: None required

### Bitcoin Connection
- **URL**: RPC endpoint (default: `http://127.0.0.1:18443`)
- **Username**: RPC username (default: `bitcoin`)
- **Password**: RPC password (required)
- **Wallet**: Wallet name (default: `filler-bot`)

### Intent Settings
- **Exit Marketplace**: IntentSystem contract address (default: `0x0000000000000000000000000000000000000045`)
- **Filler Address**: Bot's Core Lane address (required)
- **Poll Interval**: Block polling interval in seconds (default: `10`)

## Monitoring

### Logging
The bot provides structured logging:

```
🚀 Starting LaneLayer Filler Bot
📡 Exit marketplace: 0x0000000000000000000000000000000000000045
🤖 Filler address: 0x1234567890123456789012345678901234567890
⏰ Polling interval: 10 seconds
✅ Core Lane connected - Latest block: 123
✅ Bitcoin connected - Balance: 1000000 sats (0.01000000 BTC)
```

### Metrics
- **Intent Count**: Number of intents processed
- **Success Rate**: Percentage of successful fulfillments
- **Bitcoin Balance**: Available BTC for fulfillment
- **Core Lane Sync**: Latest processed block number

## Error Handling

### Common Errors
- **Connection Failed**: Cannot connect to Core Lane or Bitcoin
- **Insufficient Funds**: Not enough BTC for fulfillment
- **Intent Lock Failed**: Another bot already locked the intent
- **Bitcoin Send Failed**: Bitcoin transaction failed
- **Confirmation Timeout**: Bitcoin transaction not confirmed in time

### Recovery
- **Automatic Retry**: Failed operations are retried with exponential backoff
- **State Persistence**: Intent state is maintained across restarts
- **Error Logging**: Detailed error information for debugging

## Development Status

### Completed
- Basic repository setup with Rust
- Bitcoin RPC integration
- Core Lane JSON-RPC client
- Intent management system
- Basic filler bot logic

### In Progress
- Intent ABI parsing (currently mocked)
- Actual contract interaction transactions
- Error handling and recovery

### TODO
- Real Intent ABI implementation
- Transaction signing and submission
- Advanced monitoring and metrics
- Configuration file support
- Docker containerization

## Troubleshooting

### Bot Won't Start
- Check Core Lane node is running
- Verify Bitcoin node is accessible
- Ensure filler address is valid
- Check exit marketplace address

### No Intents Detected
- Verify exit marketplace address is correct
- Check Core Lane node is processing blocks
- Ensure intent transactions are being sent

### Bitcoin Send Failures
- Check Bitcoin wallet has sufficient funds
- Verify Bitcoin RPC credentials
- Check network connectivity

### Intent Lock Failures
- Another bot may have locked the intent
- Check bot's Core Lane address is correct
- Verify intent is still valid

## License

All rights reserved for now.

<div class="page-navigation">
  <a href="/docs/intent-system.html" class="nav-button prev">
    <span class="nav-arrow">←</span>
    <span class="nav-text">Previous: Intent System</span>
  </a>
  <a href="/docs/api-reference.html" class="nav-button next">
    <span class="nav-text">Next: API Reference</span>
    <span class="nav-arrow">→</span>
  </a>
</div>