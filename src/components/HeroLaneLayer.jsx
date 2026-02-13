import { Link } from 'react-router-dom'
import './HeroLaneLayer.css'
import heroLogo from '../assets/lanelayer-logo-512.png'

export default function HeroLaneLayer() {
  return (
    <section className="hero-lane">
      <div className="container hero-lane-inner">
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
          Build real applications that pay with Bitcoin, run like cloud apps, and anchor directly to Bitcoin.
        </h1>
        <p className="hero-lane-tagline">Built for real use cases, not hype. Ship today.</p>
        <ul className="hero-lane-bullets">
          <li>No bridges</li>
          <li>Bitcoin-anchored execution infrastructure</li>
          <li>Normal developer workflows</li>
        </ul>
        <div className="hero-lane-ctas">
          <Link to="/developers" className="btn btn-primary">Get started</Link>
        </div>
      </div>
    </section>
  )
}
