import { Link } from 'react-router-dom'
import './HeroLaneLayer.css'

export default function HeroLaneLayer() {
  return (
    <section className="hero-lane">
      <div className="container hero-lane-inner">
        <div className="hero-badge">Bitcoin-anchored execution infrastructure</div>

        <h1 className="hero-lane-title">
          Build apps that pay with Bitcoin
        </h1>

        <p className="hero-lane-sub">
          No bridges. No new chain. Normal developer workflows,
          anchored directly to Bitcoin.
        </p>

        <ul className="hero-lane-chips">
          <li>No bridges</li>
          <li>Bitcoin-anchored</li>
          <li>Normal dev workflows</li>
        </ul>

        <div className="hero-lane-ctas">
          <Link to="/#build-first-lane" className="btn btn-primary">Build your first lane</Link>
          <Link to="/how-it-works" className="btn btn-secondary">How it works</Link>
        </div>
      </div>
    </section>
  )
}
