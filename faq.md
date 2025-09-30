---
layout: default
title: FAQ
---

# FAQ

**Q: What is LaneLayer?**
A: LaneLayer is a coordination layer for intent-driven execution, anchored in Bitcoin. It enables trustless swaps, lending, betting, and payments without locking BTC in risky contracts, while ensuring all activity settles back to Bitcoin for miner revenue.

**Q: How does LaneLayer work?**
A: LaneLayer coordinates intents between parties using laneBTC tokens (minted by burning Bitcoin), but all intents ultimately settle back to Bitcoin. This means miners earn more fees as usage grows, making Bitcoin more secure.

**Q: How do I get started?**
A: Start by bringing up Core Lane Docker Compose on Bitcoin, then follow the workflow to burn BTC, get laneBTC, transfer it, and exit back to Bitcoin.

**Q: Is this production ready?**
A: This is an early implementation. The architecture and APIs may change significantly as development progresses.

**Q: What's the difference between LaneLayer and other Layer 2s?**
A: LaneLayer is not a Layer 2 - it's a coordination layer. It doesn't lock Bitcoin in contracts, but instead coordinates intents that settle back to Bitcoin, increasing miner revenue.

**Q: How do I burn Bitcoin to get laneBTC?**
A: Use the Core Lane node's burn command: `./target/debug/core-lane-node burn --burn-amount 100000 --chain-id 1 --eth-address <ADDRESS> --rpc-password bitcoin123`

**Q: How do I exchange laneBTC back to Bitcoin?**
A: Create an exit intent using `./target/debug/core-lane-node construct-exit-intent`, then start the filler bot to fulfill it by sending Bitcoin to your address.

**Q: What is the Exit Marketplace?**
A: The Exit Marketplace is a smart contract that facilitates the exchange of laneBTC back to Bitcoin through the intent system.

**Q: How secure is LaneLayer?**
A: LaneLayer inherits Bitcoin's security through anchoring, and all state changes are verified against Bitcoin's blockchain.

**Q: Can I run my own Core Lane node?**
A: Yes, you can run your own Core Lane node to participate in the network and process transactions.

---

<div class="page-navigation">
  <div class="nav-previous">
    <a href="/terminology.html" class="nav-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      <span>Terminology</span>
    </a>
  </div>
</div>
