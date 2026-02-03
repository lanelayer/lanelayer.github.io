import { Link } from 'react-router-dom'
import './HowItWorks.css'

export default function HowItWorks() {
  return (
    <article className="how-it-works-page">
      <div className="container">
        <h1>How LaneLayer works</h1>
        <p className="lead">
          Bitcoin anchors ordering and settlement. Lanes run like normal software. Intents and laneBTC move value without custody honeypots.
        </p>
        <section className="how-section">
          <h2>Bitcoin’s role</h2>
          <p>
            Bitcoin is the secure, neutral anchor for value and ordering. Execution happens off-chain; Bitcoin provides the economic base everyone can independently verify.
          </p>
        </section>
        <section className="how-section">
          <h2>Intents</h2>
          <p>
            Applications express intents: signed outcome statements backed by Bitcoin-denominated working capital. Participants compete to fulfill intents. If they succeed, they get paid; if they fail, they lose money or burn capital.
          </p>
        </section>
        <section className="how-section">
          <h2>Lanes</h2>
          <p>
            Lanes look like normal execution environments: state, programs, APIs, deterministic processing. They can fail, restart, or be replaced. Legitimacy comes from who runs them, who fills intents, and who settles against the results.
          </p>
        </section>
        <section className="how-section">
          <h2>laneBTC</h2>
          <p>
            laneBTC is Bitcoin-denominated working capital for applications—not a store of value and not a replacement for Bitcoin. It exists so apps can have balances, fees, and settlement without pooled custody. Parity is maintained through open market activity.
          </p>
        </section>
        <section className="how-section">
          <h2>Failure and degradation</h2>
          <p>
            There is no proof-enforced canonical state. The state that matters is the one participants run, build on, and settle against. LaneLayer is designed to be legible, inspectable, and degrade without catastrophic custody loss.
          </p>
        </section>
        <p className="cta-wrap">
          <Link to="/developers" className="btn btn-primary">Start building</Link>
        </p>
      </div>
    </article>
  )
}
