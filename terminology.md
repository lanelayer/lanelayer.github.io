---
layout: default
title: Terminology
---

# Terminology

**LaneLayer**: A coordination layer for deals, anchored in Bitcoin. It enables trustless swaps, lending, betting, and payments without locking BTC in risky contracts.

**Core Lane**: The execution environment that processes deals and coordinates with Bitcoin. It handles intent-based transactions and deal fulfillment.

**LaneLayer Filler Bot**: An automated system that monitors for deals and fulfills them by executing the necessary Bitcoin transactions and laneBTC transfers.

**Deal Coordination**: The process by which LaneLayer coordinates trustless deals between parties without requiring them to lock Bitcoin in contracts.

**BRN1 Format**: A specific format used in Bitcoin OP_RETURN outputs for burning Bitcoin and minting laneBTC tokens.

**Taproot Integration**: Data storage on Bitcoin using Taproot envelopes for efficient deal coordination data.

**laneBTC**: Bitcoin tokens minted when Bitcoin is burned, used for deal coordination without locking actual BTC.

**Deal Settlement**: The process by which deals are settled back to Bitcoin, ensuring miners earn transaction fees.

**Intent System**: A smart contract system that manages deal intents and coordinates their fulfillment.

**Bitcoin Anchoring**: The process of anchoring deal coordination to Bitcoin's security without locking BTC.

**Deal Locking**: The process by which a filler bot locks a deal for fulfillment to prevent double-spending.

**Deal Solving**: The process by which a locked deal is fulfilled and settled back to Bitcoin.

**OP_RETURN**: A Bitcoin script opcode used to store deal coordination data in Bitcoin transactions.

**JSON-RPC**: A remote procedure call protocol used for communication with the Core Lane node.

**CBOR**: Concise Binary Object Representation, used for serializing IntentData.

**Alloy Primitives**: Ethereum-compatible libraries used for transaction parsing and contract interaction.

**Consensus**: The mechanism by which Core Lane nodes agree on the state of the system.

**RLP**: Recursive Length Prefix encoding used in Ethereum and Core Lane.

**Sol-types**: Type definitions for Solidity contracts used in Core Lane.

---

<div class="page-navigation">
  <div class="nav-previous">
    <a href="/" class="nav-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      <span>Home</span>
    </a>
  </div>
  <div class="nav-next">
    <a href="/faq.html" class="nav-link">
      <span>FAQ</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  </div>
</div>
