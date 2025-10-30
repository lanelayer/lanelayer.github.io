---
layout: default
title: Terminology
---

# Terminology

**LaneLayer**: A coordination layer for intent-driven execution, anchored in Bitcoin. It enables trustless swaps, lending, and payments without locking BTC in risky contracts.

**Core Lane**: A Bitcoin-anchored execution environment that processes Bitcoin burns and Core Lane DA transactions. It runs as a Rust binary (`core-lane-node`) that connects to Bitcoin RPC and provides Ethereum-compatible JSON-RPC at port 8545.

**LaneLayer Filler Bot**: An automated system (`lanelayer-filler-bot`) that monitors for intents and fulfills them by executing the necessary Bitcoin transactions and laneBTC transfers. It connects to both Core Lane JSON-RPC and Bitcoin RPC.

**Intent Coordination**: The process by which LaneLayer coordinates trustless intents between parties without requiring them to lock Bitcoin in contracts.

**IntentData**: The core data structure containing intent type and serialized intent information.

**AnchorBitcoinFill**: Intent type for exchanging laneBTC back to Bitcoin. Contains Bitcoin address, amount, max fee, and expiration.

**UserIntent**: Complete intent state including ID, user address, Bitcoin destination, amount, fee, status, and timestamps.

**laneBTC**: Bitcoin tokens minted when Bitcoin is burned. 1 satoshi = 10^10 wei on Core Lane.

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
