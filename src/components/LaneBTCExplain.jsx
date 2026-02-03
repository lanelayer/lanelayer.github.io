import './LaneBTCExplain.css'

export default function LaneBTCExplain() {
  return (
    <section id="lanebtc" className="lanebtc-explain">
      <div className="container">
        <h2 className="lanebtc-title">laneBTC</h2>
        <p className="lanebtc-lead">
          Bitcoin-denominated working capital for applications. Parity with Bitcoin is maintained through open-market incentives—not custody or governance.
        </p>
        <div className="lanebtc-grid">
          <div className="lanebtc-card">
            <h3>Two-asset symmetry</h3>
            <p>
              New laneBTC originates from provable Bitcoin burns that deterministically mint on-lane. No arbitrary minting: supply stays economically anchored to Bitcoin burns.
            </p>
          </div>
          <div className="lanebtc-card">
            <h3>Solvers and fillers</h3>
            <p>
              Solvers peg-in (BTC → laneBTC). Fillers peg-out (laneBTC → BTC). Their opposing exposures create a market that keeps prices near parity.
            </p>
          </div>
          <div className="lanebtc-card">
            <h3>Arbitrage</h3>
            <p>
              Discounts get bought; premiums get sold. Larger deviations create stronger incentives—pulling prices back toward parity without a governance vote or oracle.
            </p>
          </div>
          <div className="lanebtc-card">
            <h3>Bitcoin as anchor</h3>
            <p>
              Burns and exits settle on Bitcoin—provable supply, no custodial risk, immutable accounting.
            </p>
          </div>
        </div>
        <p className="lanebtc-intuition">
          <strong>Intuition:</strong> laneBTC is like offshore BTC—faster and programmable, economically tethered to Bitcoin.
        </p>
      </div>
    </section>
  )
}
