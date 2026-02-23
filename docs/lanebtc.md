---
layout: default
title: LaneBTC
---

# The LaneBTC-BTC Peg

<div class="highlight-box" markdown="1">
LaneBTC maintains near 1:1 parity with Bitcoin, not by custody or governance, but through economic symmetry and open-market incentives.

The peg persists because every participant in the LaneLayer has a financial motive to keep LaneBTC's value close to BTC. It is also always cheaper to arbitrage away a deviation than to sustain it - rational profit seeking rather than design!
</div>

Our LaneBTC-BTC peg works due to the following key factors:

## 1. Two-Asset Symmetry

LaneBTC exists as a Bitcoin-anchored twin asset. There are only two real assets in the system:

- **BTC on the Bitcoin network**, and
- **LaneBTC on LaneLayer**, its verifiable 1:1 counterpart.

Every new LaneBTC originates from a provable Bitcoin transaction - a burn that deterministically mints its equivalent on-lane. No one can mint LaneBTC arbitrarily; every token maps to real BTC visible on-chain as having become unspendable.

Solvers may temporarily front LaneBTC from existing float backed by prior burns, but the aggregate supply across the system always remains economically anchored to Bitcoin burns.

This symmetry ensures that the total LaneBTC in existence always has a direct economic link to real BTC - giving the market a solid foundation for arbitrage whenever there's a price deviation from BTC.

## 2. Solvers and Fillers as Market Makers

Two key participants sustain liquidity and keep parity tight:

- **Solver** — short LaneBTC, long BTC; wants LaneBTC ≈ BTC so rebalancing float is loss-free.
- **Filler** — long LaneBTC, short BTC; wants LaneBTC ≈ BTC to avoid losses on BTC payouts.

Solvers provide LaneBTC to users in exchange for BTC (peg-in), while fillers accept LaneBTC from users in exchange for BTC (peg-out).

Their opposing exposures resemble buyers and sellers in a foreign-exchange market — each side is motivated to quote prices near 1 BTC to protect inventory value.

## 3. Arbitrage: The Self-Correcting Mechanism

<div class="scenario-box" markdown="1">
#### When LaneBTC < BTC:

- **Fillers buy discounted LaneBTC**: Fillers notice that LaneBTC is trading at a discount to BTC. They buy LaneBTC at the lower price.
- **Filling Exit**: Fillers provide liquidity to users by buying LaneBTC from them in exchange for BTC.
- **Resell for profit**: Fillers can later resell the LaneBTC at a higher parity or to solvers needing float, earning the spread.
- **Price rises**: As fillers buy LaneBTC, the demand increases, causing the price of LaneBTC to rise.
</div>

<div class="scenario-box" markdown="1">
#### When LaneBTC > BTC:

- **Solvers mint or release LaneBTC**: Solvers notice that LaneBTC is trading at a premium to BTC. They mint new LaneBTC by burning BTC.
- **Sell at premium**: Solvers sell the LaneBTC at the higher market price.
- **Price falls**: As solvers sell LaneBTC, the supply increases, causing the price of LaneBTC to fall.
</div>

This self-interest loop continually corrects deviations (the larger the deviation, the stronger the arbitrage incentive-pulling prices back to parity). No governance vote or oracle is needed — just open access and verifiable Bitcoin settlement.

This creates a live, self-balancing market where LaneBTC naturally tracks BTC at parity, without any external stabilizer or discretionary intervention.

## 4. Bitcoin Finality: The Anchor

Every burn, transfer, and filler exit settles on Bitcoin; ensuring provable supply, no custodial risk, and immutable accounting. This means all supply operations are verifiable Bitcoin transactions or deterministic on-lane events, making it impossible for any single person or custodian to mint or freeze supply, and ensuring all burns are auditable. As a result, parity is backed by Bitcoin's own trust model, allowing for independent arbitrage without any governance dependency.

## 5. Intuition: "Offshore Bitcoin"

LaneBTC functions like offshore BTC — faster and programmable, but always economically tethered to Bitcoin. If its price slips, traders step in because it's cheaper to arbitrage the gap than to tolerate it.

Just as eurodollars maintain parity with USD through market liquidity and settlement convertibility, LaneBTC maintains parity with Bitcoin through solver and filler arbitrage.

**It's Bitcoin liquidity, unbound from Bitcoin's block time.**

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
    <a href="/" class="nav-link">
      <span>Home</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  </div>
</div>
