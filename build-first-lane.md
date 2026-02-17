---
layout: default
title: Build Your First Lane
---

<div class="ai-first-hero">
    <h1>Build Your First Lane</h1>
    <p class="hero-intro">Get out your ChatGPT, Cursor or Claude Code</p>
    <p class="hero-subtitle">We recommend opening up a new project in Cursor or Claude Code first, then paste this prompt.</p>
    
    <div class="copy-prompt-container" data-analytics-base="{{ site.analytics_base_url | default: 'https://lanelayer-analytics.fly.dev' }}">
        <button id="copyPromptBtn" class="copy-prompt-btn" title="Copy AI prompt">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Copy Prompt
        </button>
</div>
</div>

<script>
(function() {
    var container = document.querySelector('.copy-prompt-container');
    var ANALYTICS_BASE = (container && container.getAttribute('data-analytics-base')) || 'https://lanelayer-analytics.fly.dev';
    var USER_ID_KEY = 'lanelayer_web_user_id';
    var state = { content: null, sessionId: null, version: null, userId: null };

    function getOrCreateUserId() {
        try {
            var id = localStorage.getItem(USER_ID_KEY);
            if (id) return id;
            id = 'web_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
            localStorage.setItem(USER_ID_KEY, id);
            return id;
        } catch (e) { return 'web_' + Date.now(); }
    }

    function getFallbackPrompt() {
        return `# Build My Lane

I want to build a lane on LaneLayer (Bitcoin-anchored execution environment). Help me from idea to a live derived lane RPC endpoint. Seek out the information you need from the URLs below; don't assume everything is in this prompt.

## You have no memory across restarts

You cannot form new memories between sessions. When this folder is opened again (new chat or new agent), you have no recall of prior conversation.

- **On every session start:** Before doing anything else, read \`journey.log\` in the project root. Use it to see where we are, what was decided, and what to do next.
- **Leave notes so the next run can resume:** Write everything that matters into \`journey.log\`. The next run must be able to continue from that file alone.
- **Never assume prior context:** No journey.log or empty? Treat as fresh start. If there is content, summarize what you learned and propose the next step.

## Keep a journey log

Maintain \`journey.log\` in the project root. It is your only persistent memory. Track: questions and answers, key decisions, current phase (interview, git, building, testing, deployment), blockers, solutions. Update after each significant step.

## Step 1: Interview me

Interview me based on the guidance at https://lanelayer-analytics.fly.dev/api/v1/docs/interview-guide (fetch that URL for the full interview rules and questions). Log all answers in journey.log.

## Step 2: Guide me through Git and GitHub

From the start, guide me through source control: repo init, commit flow, GitHub repo setup, push, and container packaging. Follow the guidance at https://lanelayer-analytics.fly.dev/api/v1/docs/github-flow (fetch that URL for the full Git/GitHub steps). Prompt me with the exact git commands; I run them. Log each step in journey.log.

## Step 3: Check my CLI

Have me run \`lane --help\`. If missing: \`npm install -g @lanelayer/cli\`. Always use real CLI output for current syntax. CLI is the source of truth: https://github.com/lanelayer/cli

## Step 4: Build it

Create the lane (\`lane create <name> --template python\` or per guide), implement with the K/V API, follow patterns from the docs. Get details from https://lanelayer.com/guide-reference.html. Update journey.log with decisions.

## Step 5: Test, then deployment

Guide me through testing endpoints and K/V. For deployment (push to registry, LaneLayer infra, live RPC/Anvil), see https://lanelayer-analytics.fly.dev/api/v1/docs/developer-workflow (fetch that URL for the full workflow) and the deployment section of the guide.

## Where to look (fetch when you need details)

- **Interview questions:** https://lanelayer-analytics.fly.dev/api/v1/docs/interview-guide
- **Git/GitHub flow:** https://lanelayer-analytics.fly.dev/api/v1/docs/github-flow
- **Full workflow (RISC-V, deployment, resilience):** https://lanelayer-analytics.fly.dev/api/v1/docs/developer-workflow
- **Build guide (setup, K/V, deploy):** https://lanelayer.com/guide-reference.html
- **CLI (source of truth):** https://github.com/lanelayer/cli
- **Help / escalation:** https://discord.gg/F9GwH7zzJm

## If we get stuck

Break down the problem; point me to the docs above. If still stuck, help me post in Discord with: what I'm doing, what I tried, exact error, CLI version. Format so I can copy-paste.

## Key things to remember

- On session start: read journey.log before acting.
- Guide me through Git/GitHub from the start using the github-flow guidance.
- CLI is source of truth; use K/V API for persistence; test before deploy.
- Keep journey.log updated so the next session can resume.

## Start now

If this folder has a journey.log, read it and say where we are and what you suggest next. If not, ask me what I want to build.`;
    }

    function applyPlaceholders(text, sessionId, userId) {
        if (!text) return text;
        return text.replace(/\{\{SESSION_ID\}\}/g, sessionId || 'none').replace(/\{\{USER_ID\}\}/g, userId || '');
    }

    function getFullPrompt() {
        var userId = state.userId || getOrCreateUserId();
        state.userId = userId;
        if (state.content != null)
            return applyPlaceholders(state.content, state.sessionId, userId);
        return getFallbackPrompt();
    }

    function fetchPrompt() {
        state.userId = getOrCreateUserId();
        return fetch(ANALYTICS_BASE + '/api/v1/prompt/latest', { method: 'GET', cache: 'no-store' })
            .then(function(r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function(data) {
                state.content = data.content;
                state.sessionId = data.session_id;
                state.version = data.version;
                return state;
            })
            .catch(function() { return null; });
    }

    function sendCopyEvent() {
        if (!state.sessionId || !state.userId) return Promise.resolve();
        return fetch(ANALYTICS_BASE + '/api/v1/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'copy_prompt',
                user_id: state.userId,
                session_id: state.sessionId,
                data: state.version ? { prompt_version: state.version } : {}
            })
        }).catch(function() {});
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                var ok = document.execCommand('copy');
                document.body.removeChild(textArea);
                return ok;
            } catch (e) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    function showFeedback(button, message) {
        var originalText = button.innerHTML;
        button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ' + message;
        button.classList.add('copied');
        setTimeout(function() {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    var copyPromptBtn = document.getElementById('copyPromptBtn');
    if (copyPromptBtn) {
        fetchPrompt();
        copyPromptBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                await fetchPrompt();
                var fullPrompt = getFullPrompt();
                var success = await copyToClipboard(fullPrompt);
                if (success) {
                    showFeedback(copyPromptBtn, 'Copied!');
                    sendCopyEvent();
                } else {
                    prompt('Copy this text:', fullPrompt);
                }
            } catch (error) {
                console.error('Error copying prompt:', error);
                alert('Error copying prompt. Check console for details.');
            }
        });
    }
})();
</script>
