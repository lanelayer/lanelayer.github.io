import { useState } from 'react'
import './UseInMinutes.css'

const DISCORD_INVITE = 'https://discord.gg/F9GwH7zzJm'
const RPC_URL = 'https://rpc.lanelayer.com'
const CHAIN_ID = '1281453634'
const NETWORK_NAME = 'LaneLayer'
const CURRENCY_SYMBOL = 'laneBTC'

function CopyBlock({ label, value, onCopy }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="copy-block">
      <span className="copy-label">{label}</span>
      <code className="copy-value">{value}</code>
      <button type="button" className="copy-btn" onClick={handleCopy} aria-label={`Copy ${label}`}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default function UseInMinutes() {
  const fullPrompt = `Network name: ${NETWORK_NAME}
RPC URL: ${RPC_URL}
Chain ID: ${CHAIN_ID}
Currency symbol: ${CURRENCY_SYMBOL}`
  const [promptCopied, setPromptCopied] = useState(false)
  const copyPrompt = () => {
    navigator.clipboard.writeText(fullPrompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  return (
    <section id="use-in-minutes" className="use-in-minutes">
      <div className="container">
        <h2 className="uim-title">Use LaneLayer in minutes</h2>
        <div className="uim-warning">
          <strong>Experimental software.</strong> Live on Bitcoin mainnet. Today’s guarantee: BTC burns are honored to the specified Core Lane address. Formats and semantics may change. Don’t risk money you can’t afford to lose.
        </div>
        <div className="uim-step">
          <h3>1) Add the public RPC (MetaMask)</h3>
          <p>Use “Add network” in MetaMask. Copy individual fields, or copy the whole block.</p>
          <div className="copy-prompt-block">
            <pre className="copy-prompt-text">{fullPrompt}</pre>
            <button type="button" className="btn copy-prompt-btn" onClick={copyPrompt}>
              {promptCopied ? 'Copied to clipboard' : 'Copy to prompt'}
            </button>
          </div>
          <div className="copy-blocks">
            <CopyBlock label="Network name" value={NETWORK_NAME} />
            <CopyBlock label="RPC URL" value={RPC_URL} />
            <CopyBlock label="Chain ID" value={CHAIN_ID} />
            <CopyBlock label="Currency symbol" value={CURRENCY_SYMBOL} />
          </div>
        </div>
        <div className="uim-step">
          <h3>2) Get a wallet address</h3>
          <p>With LaneLayer selected in MetaMask, click the account name to copy your address.</p>
        </div>
        <div className="uim-step uim-step-discord">
          <h3>3) Join the Discord and share your address</h3>
          <p>Join Discord → onboarding → “Start Onboarding” → paste your Core Lane address. You’ll receive 0.00001 laneBTC.</p>
          <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="btn btn-primary discord-cta">
            Join Discord
          </a>
        </div>
        <div className="uim-step">
          <h3>4) Send some laneBTC</h3>
          <p>Send 0.0000001 laneBTC to someone in Discord (you’ll need an address).</p>
        </div>
      </div>
    </section>
  )
}
