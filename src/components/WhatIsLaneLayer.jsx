import { Link } from 'react-router-dom'
import './WhatIsLaneLayer.css'

export default function WhatIsLaneLayer() {
  return (
    <section id="what-is-lanelayer" className="what-is-lane">
      <div className="container">
        <h2 className="section-title">What is LaneLayer?</h2>
        <p className="what-is-lane-simple">
          LaneLayer is infrastructure that lets applications <em>use Bitcoin</em> without making every team become Bitcoin experts. Bitcoin is the conservative settlement and ordering layer; lanes run like normal software.
        </p>
        <p className="what-is-lane-diff">
          Developers think in services, state, and workflows—not scripts and transaction mechanics. Execution happens off Bitcoin, while economic truth stays anchored to Bitcoin. No custody honeypots. No single bridge that everything depends on.
        </p>
        <p className="what-is-lane-cta">
          <Link to="#faq">What LaneLayer is / is not</Link> · <Link to="/how-it-works">How it works</Link>
        </p>
      </div>
    </section>
  )
}
