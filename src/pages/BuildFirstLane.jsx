import { useEffect, useRef } from 'react'
import {
  attachCopyPromptListener,
  createPromptCopyClient,
  resolveAnalyticsBase,
} from '../lib/promptCopy'
import './BuildFirstLane.css'

export default function BuildFirstLane() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const client = createPromptCopyClient(resolveAnalyticsBase(container))
    client.fetchPrompt().catch(function () {})

    const copyPromptBtn = container.querySelector('#copyPromptBtn')
    if (copyPromptBtn) {
      return attachCopyPromptListener(copyPromptBtn, client)
    }
  }, [])

  return (
    <div id="build-first-lane" className="ai-first-hero" ref={containerRef} data-analytics-base="https://lanelayer-analytics.fly.dev">
      <h1>Build Your First Lane</h1>
      <p className="hero-intro">Get out your ChatGPT, Cursor or Claude Code</p>
      <p className="hero-subtitle">We recommend opening up a new project in Cursor or Claude Code first, then paste this prompt.</p>

      <div className="copy-prompt-container">
        <button id="copyPromptBtn" className="copy-prompt-btn" title="Copy AI prompt">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Copy Prompt
        </button>
      </div>
    </div>
  )
}
