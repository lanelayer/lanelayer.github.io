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

## Getting Started

**Quick Start**

```bash
# Clone the repository
git clone https://github.com/lanelayer/core-lane.git
cd core-lane

# Build the Docker image
docker build -t core-lane .

# Generate mnemonic using Docker image
MNEMONIC=$(docker run --rm core-lane ./core-lane-node create-wallet --mnemonic-only --network mainnet)

# Start the services (replace MNEMONIC with the generated phrase)
cd docker
RPC_USER=bitcoin RPC_PASSWORD=bitcoin123 CORE_LANE_MNEMONIC="$MNEMONIC" docker compose -f docker-compose.yml up --build --wait -d

# Get your Bitcoin address
docker exec core-lane /app/core-lane-node get-address --network mainnet --data-dir /data
```

**What to Expect:**

- Uses remote Bitcoin RPC (no local Bitcoin node)
- Much faster startup (no sync needed)
- Core Lane starts immediately
- Wallet database created automatically

**Note:** If you get "Wallet database not found" error, create the wallet database manually:

```bash
docker exec core-lane /app/core-lane-node create-wallet --network mainnet --mnemonic "$MNEMONIC" --data-dir /data
```

**Troubleshooting:**

- **"Wallet database not found"** - Create a wallet first with `create-wallet`
- **"Invalid mnemonic"** - Check your mnemonic phrase (12 or 24 words)
- **"Services not starting"** - Check Docker logs with `docker compose logs -f core-lane`

## How to Use LaneLayer

**Get Bitcoin Wallet Address**

```bash
# Get address from your wallet
BITCOIN_ADDRESS=$(docker exec core-lane /app/core-lane-node --plain get-address --network mainnet --data-dir /data)
echo "Bitcoin address: $BITCOIN_ADDRESS"
```

**Send Value (using cast)**

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc && foundryup

# Generate Ethereum address and save the private key
cast wallet new
# Note: Save the private key and address that are displayed

# Send laneBTC to a specific address (requires real BTC)
# Replace YOUR_PRIVATE_KEY with the private key from above
# Replace RECIPIENT_ADDRESS with the address you want to send to
# Replace AMOUNT with the amount you want to send (in wei)
cast send --rpc-url http://127.0.0.1:8545 --private-key YOUR_PRIVATE_KEY RECIPIENT_ADDRESS --value AMOUNT --legacy
```

**Burn Real BTC to Get laneBTC**

```bash
# Generate a new mnemonic for burning
docker run --rm core-lane ./core-lane-node create-wallet --mnemonic-only --network mainnet

# Burn Bitcoin to get laneBTC (replace MNEMONIC with the generated phrase)
docker run --rm -v $(pwd):/data core-lane ./core-lane-node burn \
  --burn-amount BURN_AMOUNT \
  --chain-id CHAIN_ID \
  --eth-address YOUR_ETH_ADDRESS \
  --network mainnet \
  --mnemonic "your twelve word mnemonic phrase here" \
  --electrum-url "ssl://electrum.blockstream.info:50002" \
  --data-dir /data
```

**Transfer laneBTC**

```bash
# Send laneBTC from your address to another address
# Replace YOUR_PRIVATE_KEY with your private key from 'cast wallet new'
# Replace RECIPIENT_ADDRESS with the address you want to send laneBTC to
# Replace AMOUNT with the amount you want to send (in wei)
cast send --rpc-url http://127.0.0.1:8545 --private-key YOUR_PRIVATE_KEY RECIPIENT_ADDRESS --value AMOUNT --legacy

# Check balance of the recipient address
cast balance --rpc-url http://127.0.0.1:8545 RECIPIENT_ADDRESS
```

**Send Calldata and Retrieve Transaction**

```bash
# Send transaction with calldata to a specific address
# Replace YOUR_PRIVATE_KEY with your private key from 'cast wallet new'
# Replace TARGET_ADDRESS with the address you want to send calldata to
# Replace CALLDATA with your actual calldata (hex string starting with 0x)
TX_HASH=$(cast send --rpc-url http://127.0.0.1:8545 --private-key YOUR_PRIVATE_KEY TARGET_ADDRESS CALLDATA --legacy)

# Get transaction details using the transaction hash
cast rpc --rpc-url http://127.0.0.1:8545 eth_getTransactionByHash $TX_HASH
```

**Exit Value (Bitcoin Withdrawal)**

```bash
# Create exit intent
docker exec core-lane /app/core-lane-node construct-exit-intent \
  --bitcoin-address $BITCOIN_ADDRESS \
  --amount 50000000 \
  --expire-by 1000000 \
  --data-dir /data

# The exit intent will be processed by the intent system
# Check your Bitcoin wallet for the received funds
```
