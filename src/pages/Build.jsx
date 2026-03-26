import { useState, useEffect } from 'react'
import './Build.css'

const rawPrompt = `# Build My Lane

I want to build a lane on LaneLayer (Bitcoin-anchored execution environment). Help me from idea to a live derived lane RPC endpoint. Seek out the information you need from the URLs below. Do not assume everything is in this prompt.

---

## Stateless Agent Rules

You have no memory across restarts.
You cannot form new memories between sessions.
When this folder is opened again in a new chat or agent, you have no recall of prior conversation.

The only persistent state allowed across sessions is \`journey.log\` inside the project root.

---

## Session Tracking

Every interaction with a LaneLayer backend must carry the session ID for telemetry. The session ID for this prompt instance is defined at the bottom of this file after \`Session:\`.

When fetching any LaneLayer backend URL, append \`?session=4n0t6csx5w4b\` to the URL. When a URL already has query parameters, use \`&session=4n0t6csx5w4b\` instead.

This applies to every HTTP request the agent makes to any \`analytics.lanelayer.com\` endpoint. No exceptions.

---

## journey.log Schema (Strict)

Every write to \`journey.log\` must follow this exact structure. Do not freeform write to it.

\`\`\`
## Session: 4n0t6csx5w4b | <ISO timestamp>

### Interview
Q: <question>
A: <user answer>
... (repeat for all questions)

### Registration
Email: <email>
Verified: yes/no
Verified at: <timestamp>

### Requirements Summary
<confirmed summary after interview>

### CLI
- Installed: yes/no
- Version: <output of lane --help>

### Build
- Lane name: <n>
- Template: <template>
- Checkpoints: <list with timestamps>
- Architectural decisions: <list>

### Local Test Gate
- Test method: <host | container-internal | both>
- Endpoints tested: yes/no
- Endpoint test results: <list of endpoints with status codes and response summaries>
- Container built successfully: yes/no
- Container build output: <summary of build output or error>
- All passed: yes/no — DO NOT proceed to deploy until this is yes

### Deploy
- Command used: <exact command with env vars>
- Full CLI output: <every line of output from lane push>
- Container pushed to registry: yes/no

### Resilience
- Issues encountered: <list>
- Recovery attempted: <what was tried>
- Escalated: yes/no

### End State
- Status: deployed / pending / failed
- Developer cleared for frontend: yes/no
\`\`\`

A new session must reconstruct full context from this file alone. If a field is unknown, write \`unknown\` — never omit the field.

---

## Session Start Rules (Strict)

On every session start:

- Do NOT inspect parent directories.
- Do NOT scan the workspace.
- Do NOT ask for folder names or paths.
- Treat the current working directory as the project root.

Then:
- Check for \`journey.log\` in the current directory ONLY.
- If it exists, read it and resume from the last incomplete step.
- If it does not exist, treat as fresh start and create it.

No branching. No options. No asking for filesystem paths.

---

## Step 0: Pre-Interview Briefing

Before asking any interview questions, send a short kickoff message in this style:

"We're going to build and deploy your own lane — a verifiable microservice that runs on Bitcoin-anchored infrastructure. You write the logic, LaneLayer makes it provable.

Here's how it works:
I'll ask a few questions about what you want to build, then I handle everything — code, tests, and deployment. You just answer questions and verify your email.

What you'll end up with:
A live container on the LaneLayer network with your custom API endpoints, built-in persistent storage, and a cryptographic hash proving your code runs exactly as written.

Let's get started."

Keep it concise and friendly (roughly 4-8 sentences), then proceed to Step 1.

---

## Prerequisites Check (Mandatory — Agent Executes Everything)

Before Step 1, you (the agent) must verify the machine has the required tooling to build and deploy lanes.

If any prerequisite is missing, you must STOP and guide the user to install it. Do NOT attempt to install system prerequisites yourself. After the user confirms they completed the install, re-run the verification commands and only proceed when all checks pass.

### Required

- **Node.js + npm**: Node.js 20+ available as \`node\` and \`npm\`
- **Docker**: Docker CLI available as \`docker\` and engine usable (able to run \`docker ps\`)

### Windows-specific (only if running on Windows)

- **WSL2**: WSL is installed and version 2 is enabled
- **Docker Desktop (WSL2 backend)**: Docker is configured to work inside WSL2

### Verification commands (run these)

\`\`\`
node --version
npm --version
docker --version
docker ps
\`\`\`

If on Windows, also run:
\`\`\`
wsl --status
wsl -l -v
\`\`\`

### Installation rules

- If Node.js is missing or too old, instruct the user to install/update to Node.js 20+ (prefer the platform's standard method) and then re-run the verification commands.
- If Docker is missing or not usable:
  - On Linux, instruct the user to install Docker Engine and ensure the daemon is running, then re-run \`docker ps\`.
  - On macOS, instruct the user to install Docker Desktop, start it, then re-run \`docker ps\`.
  - On Windows, instruct the user to install WSL2 (if missing) and Docker Desktop with WSL2 integration, ensure Docker works from within WSL, then re-run \`docker ps\`.

Do not proceed until all required tooling checks pass.

---

## Step 1: Interview

Fetch and follow:

Interview questions: \`https://analytics.lanelayer.com/api/v1/docs/interview-guide?session=4n0t6csx5w4b\`

Ask all required questions one at a time.
Log all answers in \`journey.log\` under \`### Interview\`.

Do not proceed to Step 2 until the interview is complete and the requirements summary is confirmed by the user.

---

## Step 2: Email Signup

After the interview is confirmed, ask the developer for their email address.

Register with:
\`\`\`
lane signup <developer_email> --session 4n0t6csx5w4b --api-url https://analytics.lanelayer.com
\`\`\`

Then ask for the 6-digit code from their inbox and verify with:
\`\`\`
lane verify <6_digit_code> --session 4n0t6csx5w4b --api-url https://analytics.lanelayer.com
\`\`\`

If verification is not successful, retry until it returns verified.

Log results in \`journey.log\` under \`### Registration\`.

Do not proceed to Step 3 until verification succeeds.

---

## Step 3: CLI Check

Install the exact version:
\`\`\`
npm install -g @lanelayer/cli@0.4.20
\`\`\`

Do not install any other version. If a different version is already installed, reinstall with the command above.

Then run:
\`\`\`
lane --help
\`\`\`

Log the CLI version in \`journey.log\` under \`### CLI\`.

CLI is source of truth: \`https://github.com/lanelayer/cli\`

Always rely on real CLI output for syntax. Never assume command flags or options.

---

## Step 4: Build

Bootstrap the lane from the sample template:
\`\`\`
curl -sL "https://analytics.lanelayer.com/sample.tar?session=4n0t6csx5w4b" | tar xf -
\`\`\`

Follow:
- Build guide: \`https://analytics.lanelayer.com/api/v1/docs/guide?session=4n0t6csx5w4b\`

After each meaningful milestone (lane created, core logic complete), run:
\`\`\`
git add .
git commit -m "<descriptive message>"
\`\`\`

Log architectural decisions and commit checkpoints in \`journey.log\` under \`### Build\`.

---

## Step 5: Local Test Gate (Mandatory — Agent Executes Everything)

Before any deployment, you (the agent) must execute and verify all of the following yourself. Do not ask the user to run commands, paste output, or confirm results. You run every command, read every output, and determine pass/fail.

Do not proceed to Step 6 until every test passes.

### How to reach the lane

Lanes run inside containers. Try host-level first, fall back to container-internal if needed:

**Method A: Host-level (try first)**
\`\`\`
curl http://localhost:8080/<endpoint>
\`\`\`

**Method B: Container-internal (use if Method A fails)**

If host-level requests fail (curl error 52, connection refused, status 000), this is a container networking issue — NOT a lane failure. Switch to container-internal testing immediately. Do not escalate. Do not stop.
\`\`\`
lane exec -- curl -s http://localhost:8080/health
\`\`\`

If \`lane exec\` has issues with complex arguments, write a test script first:
\`\`\`
cat > /tmp/test_endpoints.sh << 'EOF'
#!/bin/bash
curl -s -w "\\nHTTP %{http_code}\\n" http://localhost:8080/health
EOF
chmod +x /tmp/test_endpoints.sh
lane exec -- bash /tmp/test_endpoints.sh
\`\`\`

Adapt the script to include ALL endpoints the lane exposes. Container-internal test results are fully valid.

### Test 1: Test all lane endpoints

1. Start the lane locally if not already running.
2. Hit every endpoint. Read every response. Confirm correct status codes and response shapes.
3. If any endpoint fails from inside the container, debug and re-test.
4. Log every endpoint, status code, and response summary in \`journey.log\`.

### Gate check

After all tests pass:
- Set \`All passed: yes\` in \`journey.log\`.
- Run:
  \`\`\`
  git add .
  git commit -m "All local tests passing — ready to deploy"
  \`\`\`

If any test fails, debug in place and re-test. Do not proceed until all pass.

---

## Step 6: Deploy

Only after the Local Test Gate is fully passed.

### How deployment works

\`@lanelayer/cli@0.4.20\` handles deployment in a single command. It does two things:

1. Builds a production RISC-V container and pushes it to the Docker registry.
2. Registers and publishes the lane metadata through the CLI flow.

### Deploy command

Run this exact command (substitute \`<n>\` with the lane name from \`journey.log\`):

\`\`\`
lane push <n>:latest
\`\`\`

Do not modify this command. Do not ask the user what registry to use. Do not use a full registry URL. The CLI handles the registry. The short path (\`<n>:latest\`) is correct.

### After running the command

1. Read the full CLI output. Log every line in \`journey.log\` under \`### Deploy → Full CLI output\`.
2. Confirm the push succeeded (image pushed to registry, no errors).
3. Log \`Container pushed to registry: yes\`.

If the push fails, read the error, attempt one fix, and retry. If it fails again, go to Resilience & Recovery.

After a successful push, run:
\`\`\`
git add .
git commit -m "Deployed — container pushed"
\`\`\`

Log all results in \`journey.log\` under \`### Deploy\`.

---

## Resilience & Recovery

If anything fails at any step, follow this triage order:

1. **Identify**: What exactly failed? (CLI output, endpoint response, build error)
2. **Classify**:
   - Host networking issue (curl 52, connection refused, status 000) → NOT a failure. Switch to container-internal testing. Do not escalate.
   - Build/code error → debug in place, reference the build docs
   - CLI error → check \`lane --help\`, reference \`https://github.com/lanelayer/cli\`
   - Push error → check \`lane --help\`, verify command syntax, retry
   - Infra/deployment error → check health endpoints, retry once
3. **Recover**: Attempt one fix. Log what was tried in \`journey.log\`.
4. **Escalate** if still blocked — help me post in Discord with this exact payload:

\`\`\`
What I'm building: <from journey.log Requirements Summary>
Step I'm on: <current step>
What I tried: <recovery attempt>
Exact error: <paste>
CLI version: @lanelayer/cli@0.4.20
Session ID: 4n0t6csx5w4b
Command used: lane push <n>:latest
\`\`\`

Discord: \`https://discord.gg/F9GwH7zzJm\`

Log all issues and outcomes in \`journey.log\` under \`### Resilience\`.

---

## Non-Negotiable Rules

- Always append \`?session=4n0t6csx5w4b\` (or \`&session=4n0t6csx5w4b\`) to every LaneLayer backend URL. No backend request without a session ID.
- The agent executes all commands, reads all output, and determines all pass/fail results. Never ask the user to run a command, paste output, or confirm a result.
- Always install \`@lanelayer/cli@0.4.20\`. No other version.
- Always use the short registry path (\`<n>:latest\`). Never specify a full registry URL.
- Never ask the user what registry to use. The CLI default is correct.
- Never escalate host networking issues as lane failures. If host curl fails, switch to container-internal testing and keep going.
- Never inspect parent directories.
- Never ask for filesystem paths.
- Never deploy before the Local Test Gate is fully passed.
- CLI is the source of truth — always use real output, never assume syntax.
- Use K/V API for all persistence.
- Keep \`journey.log\` updated at every meaningful milestone using the defined schema.
- Commit checkpoints are mandatory at the milestones defined in Steps 4, 5, and 6.

---

## Start Now

Check for \`journey.log\` in the current directory.
If it exists, read it and resume from the last incomplete step.
If it does not exist, start fresh with Step 1.

---
LaneLayer Prompt 1.2.0 | CLI: @lanelayer/cli@0.4.20 | Session: 4n0t6csx5w4b`

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
  'Not "Bitcoin smart contracts"—execution is outside Bitcoin, anchored economically to it.',
  'Not "laneBTC = BTC"—laneBTC is working capital; parity is maintained by open markets.',
  'Not finished or final—a constrained core with expanding execution surfaces.',
]

const howSteps = [
  { label: 'Intents', desc: 'Signed outcome statements backed by Bitcoin-denominated working capital' },
  { label: 'Lanes', desc: 'Normal execution environments with state, APIs, deterministic processing' },
  { label: 'laneBTC', desc: 'Working capital for applications—not a store of value, parity via open markets' },
  { label: 'Settlement', desc: 'Economic truth anchored to Bitcoin; no custody honeypots, no single bridge' },
]

export default function Build() {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const lines = rawPrompt.split('\n')
  const previewHtml = highlightPrompt(lines.slice(0, PREVIEW_LINES).join('\n'))
  const fullHtml = highlightPrompt(lines.slice(PREVIEW_LINES).join('\n'))

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

  function copyPrompt() {
    navigator.clipboard.writeText(rawPrompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="build-root">
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
              <div className="b-prompt-preview" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              <button
                className={`b-expand-btn${expanded ? ' open' : ''}`}
                onClick={() => setExpanded(!expanded)}
              >
                <span className="b-expand-arrow">▼</span>&nbsp;&nbsp;
                {expanded ? 'Hide full prompt' : 'Show full prompt'}
              </button>
              <div
                className={`b-prompt-full${expanded ? ' visible' : ''}`}
                dangerouslySetInnerHTML={{ __html: fullHtml }}
              />
            </div>

            <button className={`b-hero-copy-btn b-prompt-copy${copied ? ' copied' : ''}`} onClick={copyPrompt}>
              {copied ? (
                <><span>✓</span> Copied!</>
              ) : (
                <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg> Copy Prompt</>
              )}
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
