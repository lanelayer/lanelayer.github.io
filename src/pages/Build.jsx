import { useState, useEffect, useRef } from 'react'
import {
  applyPlaceholders,
  attachCopyPromptListener,
  createPromptCopyClient,
  resolveAnalyticsBase,
} from '../lib/promptCopy'
import './Build.css'

const PREVIEW_LINES = 8

function highlightPrompt(text) {
  return text.split('\n').map((line) => {
    const e = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    if (/^#{1,3} /.test(e)) return `<span style="color:#9CA3AF;font-weight:600">${e}</span>`
    if (/^```|^    /.test(e)) return `<span style="color:#9CA3AF">${e}</span>`
    if (/^---$/.test(e.trim())) return `<span style="color:#2a2a2a">${e}</span>`
    return `<span style="color:#9CA3AF">${e}</span>`
  }).join('\n')
}

export default function Build() {
  const [expanded, setExpanded] = useState(false)
  const [promptHtml, setPromptHtml] = useState({ preview: '', full: '' })
  const containerRef = useRef(null)

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => document.head.removeChild(meta)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const client = createPromptCopyClient(resolveAnalyticsBase(container))
    const { fetchPrompt } = client

    fetchPrompt()
      .then(function (s) {
        const text = applyPlaceholders(s.content, s.sessionId, s.userId)
        const lines = text.split('\n')
        setPromptHtml({
          preview: highlightPrompt(lines.slice(0, PREVIEW_LINES).join('\n')),
          full: highlightPrompt(lines.slice(PREVIEW_LINES).join('\n')),
        })
      })
      .catch(function () {})

    const copyPromptBtn = container.querySelector('#copyPromptBtn')
    if (copyPromptBtn) {
      return attachCopyPromptListener(copyPromptBtn, client)
    }
  }, [])

  return (
    <div className="build-root" ref={containerRef} data-analytics-base="https://lanelayer-analytics.fly.dev">
      <main>

        {/* ── Hero ── */}
        <section className="b-hero">
          <div className="container">
            <div className="b-hero-inner">

              <div className="b-hero-left">
                <span className="b-badge">Bitcoin-anchored execution</span>
                <h1 className="b-title">Give your AI agent<br />Bitcoin rails.</h1>
                <p className="b-sub">
                  Get out your Cursor or Claude Code. Paste this prompt and your agent handles everything — interviews you, builds the backend, and ships a live RPC endpoint.
                </p>
              </div>

              <div className="b-hero-right">
                <div className="b-terminal-panel">
                  <div className="b-terminal-bar">
                    <div className="b-dot"></div>
                    <div className="b-dot"></div>
                    <div className="b-dot"></div>
                    <span className="b-terminal-title">cursor — lanelayer-project</span>
                  </div>
                  <div className="b-terminal-body">
                    <div className="b-line"><span className="b-prompt">$</span> <span className="b-cmd">paste prompt into cursor...</span></div>
                    <div className="b-line b-d1"><span className="b-agent">agent</span> <span className="b-out">What would you like to build?</span></div>
                    <div className="b-line b-d2"><span className="b-agent">you</span> <span className="b-out">A marketplace escrow for buyers and sellers</span></div>
                    <div className="b-line b-d3"><span className="b-agent">agent</span> <span className="b-out">Building your lane...</span></div>
                    <div className="b-line b-d4"><span className="b-agent">agent</span> <span className="b-out">Running local tests... ✓ all passed</span></div>
                    <div className="b-line b-d5"><span className="b-agent">agent</span> <span className="b-out">Deploying to LaneLayer network...</span></div>
                    <div className="b-line b-d6 b-success"><span className="b-agent">✓</span><span>RPC_URL=https://escrow-xyz.lanelayer.dev</span></div>
                  </div>
                  <div className="b-terminal-overlay">
                    <div className="b-play-btn">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="b-coming-soon">Demo coming soon</span>
                  </div>
                </div>
                <p className="b-caption">Paste prompt → agent builds → live endpoint in ~5 minutes</p>
              </div>

            </div>
          </div>
        </section>

        {/* ── The Prompt ── */}
        <section className="b-prompt-section" data-animate>
          <div className="container">
            <span className="b-prompt-label">The Prompt</span>

            <div className="b-prompt-box">
              <div className="b-toolbar">
                <div className="b-toolbar-dot"></div>
                <div className="b-toolbar-dot"></div>
                <div className="b-toolbar-dot"></div>
                <span className="b-filename">lanelayer-prompt.md</span>
              </div>
              <div className="b-prompt-preview" dangerouslySetInnerHTML={{ __html: promptHtml.preview }} />
              <button
                className={`b-expand-btn${expanded ? ' open' : ''}`}
                onClick={() => setExpanded(!expanded)}
              >
                <span className="b-expand-arrow">▼</span>&nbsp;&nbsp;
                {expanded ? 'Hide full prompt' : 'Show full prompt'}
              </button>
              <div
                className={`b-prompt-full${expanded ? ' visible' : ''}`}
                dangerouslySetInnerHTML={{ __html: promptHtml.full }}
              />
            </div>

            <button id="copyPromptBtn" className="b-hero-copy-btn b-prompt-copy">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy Prompt
            </button>

            <div className="b-works-with">
              <span className="b-works-label">Works with</span>
              <div className="b-tool-badge"><span className="b-dot-green"></span>Cursor</div>
              <div className="b-tool-badge"><span className="b-dot-green"></span>Claude Code</div>
              <div className="b-tool-badge"><span className="b-dot-green"></span>Any AI Agent</div>
            </div>
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="b-outcomes" data-animate>
          <div className="container">
            <span className="b-prompt-label">What you get</span>
            <div className="b-outcomes-grid">
              <div className="b-outcome-card">
                <div className="b-outcome-icon">⚡</div>
                <div className="b-outcome-title">Live RPC Endpoint</div>
                <div className="b-outcome-desc">A deployed coordination system with callable API endpoints in ~5 minutes</div>
              </div>
              <div className="b-outcome-card">
                <div className="b-outcome-icon">🔒</div>
                <div className="b-outcome-title">No Smart Contracts</div>
                <div className="b-outcome-desc">Escrow, shared balances, milestone payments — without Solidity or audits</div>
              </div>
              <div className="b-outcome-card">
                <div className="b-outcome-icon">₿</div>
                <div className="b-outcome-title">Bitcoin-Anchored</div>
                <div className="b-outcome-desc">Deterministic execution anchored to Bitcoin — not a database, not a server</div>
              </div>
              <div className="b-outcome-card">
                <div className="b-outcome-icon">🤖</div>
                <div className="b-outcome-title">Agent-Native</div>
                <div className="b-outcome-desc">Your AI agent handles everything — interview, build, test, deploy</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Discord help ── */}
        <section className="b-help" data-animate>
          <div className="container">
            <div className="b-help-card">
              <div className="b-help-left">
                <div className="b-help-title">Get help from the community</div>
                <div className="b-help-desc">Stuck on setup, hit an error, or just want to show what you built? Join the Discord — builders helping builders.</div>
              </div>
              <a href="https://discord.gg/F9GwH7zzJm" target="_blank" rel="noreferrer" className="b-discord-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}
