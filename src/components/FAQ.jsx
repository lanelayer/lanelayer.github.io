import { useState } from 'react'
import './FAQ.css'

const whatIs = [
  'Infrastructure that lets applications use Bitcoin without being Bitcoin experts.',
  'Bitcoin-anchored execution: Bitcoin is the secure, neutral anchor for value and ordering; execution happens off-chain.',
  'Normal software for developers: services, state, workflows—not transactions, scripts, and chain mechanics.',
  'Intents and laneBTC: signed outcome statements backed by Bitcoin-denominated working capital; markets fulfill intents.',
  'Market-coordinated: no single bridge or operator; legitimacy earned through usage.',
]

const whatIsNot = [
  'Not proof-enforced global finality—correctness emerges from shared rules, incentives, and adoption.',
  'Not a locked-BTC custody system—no single bridge that can be drained.',
  'Not “Bitcoin smart contracts”—execution is outside Bitcoin, anchored economically to it.',
  'Not “laneBTC = BTC”—laneBTC is working capital; parity is maintained by open markets.',
  'Not finished or final—a constrained core with expanding execution surfaces.',
]

export default function FAQ() {
  const [openBroader, setOpenBroader] = useState(false)
  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2 className="faq-title">What LaneLayer is</h2>
        <ul className="faq-list what-is">
          {whatIs.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <h2 className="faq-title">What LaneLayer is not</h2>
        <ul className="faq-list what-not">
          {whatIsNot.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <button
          type="button"
          className="faq-accordion"
          onClick={() => setOpenBroader(!openBroader)}
          aria-expanded={openBroader}
        >
          {openBroader ? 'Hide' : 'Show'} broader explanation
        </button>
        {openBroader && (
          <div className="faq-broader">
            <p>
              LaneLayer lets people build around Bitcoin without turning Bitcoin into an application platform and without relying on custodians or a single bridge. Applications express intents; independent participants compete to fulfill them. Execution happens off-chain; Bitcoin provides ordering, value anchoring, and settlement references. The state that matters is the one participants actually run, build on, and settle against.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
