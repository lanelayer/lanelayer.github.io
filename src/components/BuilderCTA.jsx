import { Link } from 'react-router-dom'
import './BuilderCTA.css'

export default function BuilderCTA() {
  return (
    <section className="builder-cta">
      <div className="container">
        <h2 className="builder-cta-title">Build on LaneLayer</h2>
        <p className="builder-cta-sub">
          Copy the prompt, paste it into your AI assistant, and build your first lane.
        </p>
        <div className="builder-cta-buttons">
          <Link to="/build-first-lane" className="btn btn-primary">Build your first lane</Link>
          <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Join Discord</a>
        </div>
      </div>
    </section>
  )
}
