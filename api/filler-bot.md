---
layout: docs
title: Filler Bot CLI
---

# LaneLayer Filler Bot CLI

The LaneLayer Filler Bot is controlled via command-line interface.

## Usage

```bash
./target/release/lanelayer-filler-bot [COMMAND] [OPTIONS]
```

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

**Example:**
```bash
./target/release/lanelayer-filler-bot start \
  --core-lane-url "http://127.0.0.1:8545" \
  --bitcoin-rpc-url "http://127.0.0.1:18443" \
  --bitcoin-rpc-password "bitcoin123" \
  --filler-address "0x1234567890123456789012345678901234567890" \
  --exit-marketplace "0x0000000000000000000000000000000000000045" \
  --poll-interval 5
```

### test-core-lane
Test Core Lane connection.

```bash
./target/release/lanelayer-filler-bot test-core-lane [OPTIONS]
```

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

**Example:**
```bash
./target/release/lanelayer-filler-bot test-core-lane \
  --core-lane-url "http://127.0.0.1:8545"
```

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

**Example:**
```bash
./target/release/lanelayer-filler-bot test-bitcoin \
  --bitcoin-rpc-url "http://127.0.0.1:18443" \
  --bitcoin-rpc-password "bitcoin123"
```

### test-simulator
Test simulator contract.

```bash
./target/release/lanelayer-filler-bot test-simulator [OPTIONS]
```

**Required:**
- `--simulator-address <ADDRESS>`

**Optional:**
- `--core-lane-url <URL>` (default: `http://127.0.0.1:8545`)

**Example:**
```bash
./target/release/lanelayer-filler-bot test-simulator \
  --core-lane-url "http://127.0.0.1:8545" \
  --simulator-address "0x..."
```

## Configuration

### Core Lane Settings
- **URL**: JSON-RPC endpoint for Core Lane node
- **Authentication**: None required

### Bitcoin Settings
- **URL**: RPC endpoint for Bitcoin node
- **Username**: RPC username
- **Password**: RPC password (required)
- **Wallet**: Wallet name for Bitcoin operations

### Intent Settings
- **Exit Marketplace**: Address of IntentSystem contract
- **Filler Address**: Bot's Core Lane address (required)
- **Poll Interval**: Block polling interval in seconds

## Output

### Success
```
🚀 Starting LaneLayer Filler Bot
📡 Exit marketplace: 0x0000000000000000000000000000000000000045
🤖 Filler address: 0x1234567890123456789012345678901234567890
⏰ Polling interval: 10 seconds
✅ Core Lane connected - Latest block: 123
✅ Bitcoin connected - Balance: 1000000 sats (0.01000000 BTC)
```

### Error
```
❌ Failed to connect to Core Lane: Connection refused
❌ Failed to connect to Bitcoin: Invalid credentials
❌ Invalid filler address: 0xinvalid
```

## Troubleshooting

### Connection Issues
- Verify Core Lane node is running
- Check Bitcoin node is accessible
- Verify RPC credentials

### Configuration Issues
- Check all required parameters are provided
- Verify addresses are valid
- Ensure wallet exists and has funds

### Runtime Issues
- Check logs for detailed error information
- Verify intent marketplace address
- Ensure sufficient Bitcoin balance

## Development Status

This is an early implementation. The architecture and APIs may change significantly as development progresses.