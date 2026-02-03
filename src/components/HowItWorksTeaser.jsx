import { Link } from 'react-router-dom'
import './HowItWorksTeaser.css'

const steps = [
  { label: 'Intents', desc: 'Signed outcome statements backed by Bitcoin-denominated working capital' },
  { label: 'Lanes', desc: 'Normal execution environments with state, APIs, deterministic processing' },
  { label: 'laneBTC', desc: 'Working capital for applications—not a store of value, parity via open markets' },
  { label: 'Settlement', desc: 'Economic truth anchored to Bitcoin; no custody honeypots, no single bridge' },
]

export default function HowItWorksTeaser() {
  return (
    <section className="how-teaser">
      <div className="container">
        <h2 className="section-title">How it works</h2>
        <p className="how-teaser-lead">
          Intents → Lanes → laneBTC → Settlement references. Execution off-chain; Bitcoin provides ordering and value anchoring.
        </p>
        <div className="how-teaser-grid">
          {steps.map((step, i) => (
            <div key={i} className="how-teaser-item">
              <span className="how-teaser-label">{step.label}</span>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
        <p className="how-teaser-cta">
          <Link to="/how-it-works" className="btn btn-primary">Full picture</Link>
        </p>
      </div>
    </section>
  )
}
