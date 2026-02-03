import './BuilderCTA.css'

export default function BuilderCTA() {
  return (
    <section className="builder-cta">
      <div className="container">
        <h2 className="builder-cta-title">Build on LaneLayer</h2>
        <p className="builder-cta-sub">
          Docs and Discord to get started.
        </p>
        <div className="builder-cta-buttons">
          <a href="https://lanelayer.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Docs</a>
          <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Join Discord</a>
        </div>
      </div>
    </section>
  )
}
