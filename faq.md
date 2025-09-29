---
layout: default
title: FAQ
---

# FAQ

**Q: What is LaneLayer?**
A: LaneLayer is a coordination layer for deals, anchored in Bitcoin. It enables trustless swaps, lending, betting, and payments without locking BTC in risky contracts, while ensuring all activity settles back to Bitcoin for miner revenue.

**Q: How does LaneLayer work?**
A: LaneLayer coordinates deals between parties using laneBTC tokens (minted by burning Bitcoin), but all deals ultimately settle back to Bitcoin. This means miners earn more fees as usage grows, making Bitcoin more secure.

**Q: What is the BRN1 format?**
A: BRN1 is a standardized format for Bitcoin OP_RETURN outputs that contains the necessary data to burn Bitcoin and mint laneBTC tokens for deal coordination.

**Q: How do I get started?**
A: Start by setting up a Bitcoin node, then run the Core Lane node and Filler Bot. See the Getting Started guide for detailed instructions.

**Q: Is this production ready?**
A: This is an early implementation. The architecture and APIs may change significantly as development progresses.

**Q: What's the difference between LaneLayer and other Layer 2s?**
A: LaneLayer is not a Layer 2 - it's a coordination layer. It doesn't lock Bitcoin in contracts, but instead coordinates deals that settle back to Bitcoin, increasing miner revenue.

**Q: How do I burn Bitcoin to get laneBTC?**
A: Use the Core Lane node's burn command with the BRN1 format to create a Bitcoin transaction that burns BTC and mints laneBTC for deal coordination.

**Q: How do I exchange laneBTC back to Bitcoin?**
A: Create an exit intent through the Intent System, and a filler bot will fulfill it by sending Bitcoin to your address, settling the deal back to Bitcoin.

**Q: What is the Exit Marketplace?**
A: The Exit Marketplace is a smart contract that facilitates the exchange of laneBTC back to Bitcoin through the intent system.

**Q: How secure is LaneLayer?**
A: LaneLayer inherits Bitcoin's security through anchoring, and all state changes are verified against Bitcoin's blockchain.

**Q: Can I run my own Core Lane node?**
A: Yes, you can run your own Core Lane node to participate in the network and process transactions.

**Q: What programming languages are used?**
A: The Core Lane node and Filler Bot are written in Rust, while smart contracts use Solidity.

**Q: How do I contribute to the project?**
A: Check the GitHub repository for contribution guidelines and open issues.

**Q: Where can I find more technical details?**
A: See the Architecture and API Reference sections for detailed technical documentation.

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
  <div class="nav-next">
    <a href="/docs/getting-started.html" class="nav-link">
      <span>Getting Started</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  </div>
</div>
