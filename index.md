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
        <div class="feature-content">
            <div>No locked BTC in contracts</div>
            <div>All activity settles to Bitcoin</div>
            <div>Miner fees increase with usage</div>
        </div>
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
               <div class="feature-content">
                   <div>Trustless swaps and lending</div>
                   <div>Express what you want, not how</div>
                   <div>Automated fulfillment</div>
               </div>
    </div>

    <div class="feature-card">
        <h3>
            <svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Developer Platform
        </h3>
        <div class="feature-content">
            <div>Build apps tied to BTC</div>
            <div>Ethereum-compatible</div>
            <div>Bitcoin security</div>
        </div>
    </div>
</div>

## How LaneLayer Works

![How LaneLayer Works](assets/images/lanelayer-sequence-diagram.svg)

**LaneLayer coordinates intents without locking BTC, settles everything back to Bitcoin.**

## How to Use LaneLayer

**Clone and Setup**
```bash
git clone https://github.com/lanelayer/core-lane.git
cd core-lane
```

**Set Environment Variables**
```bash
export RPC_USER="your_bitcoin_rpc_user"
export RPC_PASSWORD="your_bitcoin_rpc_password"
export CORE_LANE_RPC_URL="http://127.0.0.1:8545"
export BITCOIN_RPC_URL="http://127.0.0.1:8332"
```

**Start Services**
```bash
docker-compose -f docker/docker-compose.yml up -d
```

**Get Bitcoin Wallet Address**
```bash
# Create wallet
docker exec bitcoind bitcoin-cli -rpcuser=$RPC_USER -rpcpassword=$RPC_PASSWORD createwallet "hot"

# Get address
BITCOIN_ADDRESS=$(docker exec bitcoind bitcoin-cli -rpcuser=$RPC_USER -rpcpassword=$RPC_PASSWORD -rpcwallet=hot getnewaddress "" bech32)
echo "Bitcoin address: $BITCOIN_ADDRESS"
```

**Send Value (using cast)**
```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc && foundryup

# Generate Ethereum address
cast wallet new

# Send laneBTC (requires real BTC)
cast send --rpc-url $CORE_LANE_RPC_URL --private-key YOUR_PRIVATE_KEY RECIPIENT_ADDRESS --value 1000000000000000000 --legacy
```

**Burn Real BTC to Get laneBTC**
```bash
cd core-lane
./target/debug/core-lane-node burn \
  --burn-amount 100000 \
  --chain-id 1 \
  --eth-address YOUR_ETH_ADDRESS \
  --rpc-user $RPC_USER \
  --rpc-password $RPC_PASSWORD \
  --rpc-url $BITCOIN_RPC_URL \
  --rpc-wallet hot
```

**Transfer laneBTC**
```bash
# Send laneBTC to another address
cast send --rpc-url $CORE_LANE_RPC_URL --private-key YOUR_PRIVATE_KEY RECIPIENT_ADDRESS --value 500000000000000000 --legacy

# Check balance
cast balance --rpc-url $CORE_LANE_RPC_URL RECIPIENT_ADDRESS
```

**Send Calldata and Retrieve Transaction**
```bash
# Send transaction with calldata
TX_HASH=$(cast send --rpc-url $CORE_LANE_RPC_URL --private-key YOUR_PRIVATE_KEY TARGET_ADDRESS "0x1234567890abcdef" --legacy)

# Get transaction details
cast rpc --rpc-url $CORE_LANE_RPC_URL eth_getTransactionByHash $TX_HASH
```

**Exit Value (Bitcoin Withdrawal)**
```bash
# Create exit intent
cd core-lane
./target/debug/core-lane-node construct-exit-intent \
  --bitcoin-address $BITCOIN_ADDRESS \
  --amount 50000000 \
  --expire-by 1000000

# The exit intent will be processed by the intent system
# Check your Bitcoin wallet for the received funds
```
