import { Link } from 'react-router-dom'
import UseInMinutes from '../components/UseInMinutes'
import LaneBTCExplain from '../components/LaneBTCExplain'
import './Developers.css'

const DISCORD_INVITE = 'https://discord.gg/F9GwH7zzJm'

export default function Developers() {
  return (
    <article className="developers-page">
      <div className="container">
        <h1>Developers</h1>
        <p className="lead">
          Build normal software. You write services, manage state, and design workflows—without needing deep Bitcoin protocol knowledge or risky bridges.
        </p>
        <section className="dev-section">
          <h2>Start here</h2>
          <ol className="checklist">
            <li><Link to="/build-first-lane">Copy the prompt and build your first lane</Link></li>
            <li>Add the RPC and get laneBTC (steps below)</li>
            <li>Join LaneLayer Discord</li>
            <li>Try a demo lane or faucet</li>
          </ol>
        </section>
        <UseInMinutes />
        <LaneBTCExplain />
        <section className="dev-section">
          <h2>Developer workflow</h2>
          <p>
            LaneLayer handles the hard parts of turning Bitcoin into working capital inside shared market coordination. Execution surfaces and tooling will evolve; the experience that matters is the one builders actually use.
          </p>
        </section>
      </div>
    </article>
  )
}
