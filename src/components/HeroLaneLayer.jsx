import { Link } from 'react-router-dom'
import './HeroLaneLayer.css'
import heroLogo from '../assets/lanelayer-logo-512.png'

export default function HeroLaneLayer() {
  return (
    <section className="hero-lane">
      <div className="container hero-lane-inner">
        <div className="hero-badge">Bitcoin-anchored execution infrastructure</div>

        <div className="hero-lane-image-wrap" aria-hidden="true">
          <img
            className="hero-lane-image"
            src={heroLogo}
            width={512}
            height={512}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
        </div>

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
          <Link to="/developers" className="btn btn-primary">Start building</Link>
          <Link to="/how-it-works" className="btn btn-secondary">How it works</Link>
        </div>
      </div>
    </section>
  )
}
