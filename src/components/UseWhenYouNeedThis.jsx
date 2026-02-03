import { Link } from 'react-router-dom'
import './UseWhenYouNeedThis.css'

const needs = [
  'Unfakeable value flows',
  'Unchangeable rules',
  'Non-custodial multi-party settlement',
  'Bitcoin-denominated working capital',
]

export default function UseWhenYouNeedThis() {
  return (
    <section className="use-when">
      <div className="container">
        <h2 className="section-title">Use LaneLayer when you need</h2>
        <p className="use-when-lead">
          Use LaneLayer when you need at least two hard guarantees—without bridges or a new chain to believe in.
        </p>
        <ul className="use-when-list">
          {needs.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <p className="use-when-cta">
          <Link to="/developers" className="btn btn-secondary">Start here</Link>
        </p>
      </div>
    </section>
  )
}
