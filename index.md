---
layout: default
title: LaneLayer
---

<div class="homepage-hero">
    <h1>LaneLayer</h1>
    <p>Coordination layer for intent-driven execution, anchored in Bitcoin</p>
    <p style="font-size: 1.1rem; color: var(--text-muted); margin-top: 1rem;">Making Bitcoin more useful and more secure</p>
</div>

Bitcoin today is the most trusted money on the internet but it's limited: You can send and hold BTC, but building apps usually means centralized exchanges or risky bridges. Miners earn less and less from block rewards, so Bitcoin's long-term security budget is shrinking.

**LaneLayer changes this:**

It lets people execute trustless intents, swaps, lending, betting, and payments anchored in Bitcoin without locking BTC in giant risky contracts. All of this still settles back to Bitcoin, so miners earn more transaction fees as usage grows. Developers can build distributed apps, DeFi protocols, even games all tied directly to BTC, without breaking Bitcoin's simplicity or security.

**LaneLayer makes Bitcoin more useful (apps and DeFi) and more secure (fees for miners).**

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
            <li>No locked BTC in contracts</li>
            <li>All activity settles to Bitcoin</li>
            <li>Miner fees increase with usage</li>
        </ul>
    </div>

    <div class="feature-card">
               <h3>
                   <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <circle cx="12" cy="12" r="10"/>
                       <circle cx="12" cy="12" r="6"/>
                       <circle cx="12" cy="12" r="2"/>
                   </svg>
                   Intent-Driven Execution
               </h3>
               <ul>
                   <li>Trustless swaps and lending</li>
                   <li>Express what you want, not how</li>
                   <li>Automated fulfillment</li>
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
            <li>Build apps tied to BTC</li>
            <li>Ethereum-compatible</li>
            <li>Bitcoin security</li>
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

**LaneLayer coordinates intents without locking BTC, settles everything back to Bitcoin.**

## How to Use LaneLayer

Bring up Core Lane node on Bitcoin

```bash
# Start Bitcoin regtest node (for development)
docker run --rm -d --name bitcoin-regtest \
  -p 18443:18443 -p 18444:18444 \
  bitcoin/bitcoin:29.0 \
  -regtest -server=1 -printtoconsole \
  -rpcuser=bitcoin -rpcpassword=bitcoin123 \
  -rpcallowip=0.0.0.0/0 -rpcbind=0.0.0.0 -txindex=1

# Create wallet and mine blocks
docker exec bitcoin-regtest bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin123 createwallet "mine"
docker exec bitcoin-regtest bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin123 -rpcwallet=mine generatetoaddress 101 $(docker exec bitcoin-regtest bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin123 -rpcwallet=mine getnewaddress "" bech32)

# Start Core Lane node
./target/debug/core-lane-node start \
  --start-block 0 \
  --rpc-user bitcoin \
  --rpc-password bitcoin123 \
  --http-host 127.0.0.1 \
  --http-port 8546
```

Get a wallet address to receive Bitcoin

```bash
# Get Bitcoin address for receiving funds
docker exec bitcoin-regtest bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin123 -rpcwallet=mine getnewaddress "" bech32

# Get Ethereum address for Core Lane
cast wallet new
```

Send value using cast

```bash
# Send ETH to your address
cast send --private-key <PRIVATE_KEY> --value 1ether <TO_ADDRESS> --rpc-url http://127.0.0.1:8546

# Check balance
cast balance <ADDRESS> --rpc-url http://127.0.0.1:8546
```

Burn real BTC to get laneBTC

```bash
# Burn Bitcoin and mint laneBTC
./target/debug/core-lane-node burn \
  --burn-amount 1000000 \
  --chain-id 1 \
  --eth-address <YOUR_ETH_ADDRESS> \
  --rpc-password bitcoin123

# Check laneBTC balance
cast balance <YOUR_ETH_ADDRESS> --rpc-url http://127.0.0.1:8546
```

Transfer laneBTC to another address and check it has arrived

```bash
# Transfer laneBTC to another address
cast send <TO_ADDRESS> --value <AMOUNT> \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://127.0.0.1:8546

# Check if transfer arrived
cast balance <TO_ADDRESS> --rpc-url http://127.0.0.1:8546
```

Send calldata tx and pick it up with eth_getTransactionByHash after seeing it in a block

```bash
# Send calldata transaction
cast send <TARGET_CONTRACT> <CALLDATA> \
  --private-key <PRIVATE_KEY> \
  --rpc-url http://127.0.0.1:8546

# Get transaction hash and check in block
cast tx <TX_HASH> --rpc-url http://127.0.0.1:8546

# Query using JSON-RPC
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params":["<TX_HASH>"],"id":1}' \
  http://127.0.0.1:8546
```

Exit value back to Bitcoin

```bash
# Create exit intent using Core Lane CLI
./target/debug/core-lane-node construct-exit-intent \
  --bitcoin-address <YOUR_BTC_ADDRESS> \
  --amount <LANEBTC_AMOUNT> \
  --expire-by <TIMESTAMP>

# Start the filler bot to fulfill intents
./target/debug/lanelayer-filler-bot start \
  --core-lane-url http://127.0.0.1:8546 \
  --bitcoin-rpc-url http://127.0.0.1:18443 \
  --bitcoin-rpc-user bitcoin \
  --bitcoin-rpc-password bitcoin123 \
  --bitcoin-wallet filler-bot \
  --filler-address <FILLER_ETH_ADDRESS>

# Check your Bitcoin wallet for the received funds
docker exec bitcoin-regtest bitcoin-cli -regtest -rpcuser=bitcoin -rpcpassword=bitcoin123 -rpcwallet=mine getbalance
```


