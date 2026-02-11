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
    var base = (container && container.getAttribute('data-analytics-base')) || 'https://lanelayer-analytics.fly.dev';
    var ANALYTICS_API = base.replace(/\/$/, '') + '/api/v1';

    // Get or create anonymous user ID
    function getOrCreateUserId() {
        var userId = localStorage.getItem('ll_user_id');
        if (!userId) {
            userId = 'web_' + crypto.randomUUID();
            localStorage.setItem('ll_user_id', userId);
        }
        return userId;
    }

    // Static fallback prompt (used when backend is unavailable)
    function getStaticPrompt() {
        return `# Build My Lane

I want to build a lane on LaneLayer - a Bitcoin-anchored execution environment. Help me figure out what to build and then implement it.

## Keep a journey log

Maintain a \`journey.log\` file in my project root throughout our session. Track:
- All questions you ask me and my responses
- Key decisions we make during development
- Any blockers or issues we encounter
- Solutions we implement

Update it after each significant interaction - helps if I step away and come back later.

## Step 1: Interview me first

Ask me questions to understand my project:
- What type of application do I want to build? (prediction market, escrow service, voting system, NFT marketplace, etc.)
- What are the core features and functionality I need?
- What data needs to be stored persistently?
- What are the key business rules or logic?
- Are there any specific requirements or constraints?
- What programming language do I prefer? (Python is the default, but other languages work)

Log all my answers in journey.log.

## Step 2: Check my CLI

Once we know what we're building, make sure I have the LaneLayer CLI installed. Have me run:

\`\`\`bash
lane --help
\`\`\`

If it doesn't work, help me install it:
\`\`\`bash
npm install -g @lanelayer/cli
\`\`\`

**Important CLI rules:**
- Always run actual CLI commands (\`lane --help\`, \`lane <command> --help\`) to get current syntax
- If commands don't work or seem outdated, have me upgrade: \`npm install -g @lanelayer/cli@latest\`
- The CLI is the source of truth - don't rely on potentially stale documentation
- Check the source at https://github.com/lanelayer/cli if you need implementation details

## Step 3: Build it

Once you understand my requirements:
- Create the lane project with \`lane create <project-name> --template python\`
- Implement the core functionality using the K/V API for persistence
- Follow patterns from the documentation
- Make sure the code is production-ready
- Update journey.log with implementation decisions

## Step 4: Help me test

Guide me through:
- Testing all the endpoints
- Verifying K/V storage works correctly
- Checking that the business logic functions as expected

Update journey.log with test results.

## Docs you can reference

- **Complete Build Guide**: https://lanelayer.com/guide-reference.html (full tutorial with project setup, K/V API usage, code examples, and deployment)
- **Project Setup**: https://lanelayer.com/guide-reference.html#step-2-create-your-lane
- **K/V API Reference**: https://lanelayer.com/guide-reference.html#step-4-understanding-the-kv-api
- **Debugging & Development**: https://lanelayer.com/guide-reference.html#step-3-start-development-mode
- **Deployment**: https://lanelayer.com/guide-reference.html#step-7-deploy-to-flyio
- **CLI Source**: https://github.com/lanelayer/cli

## If we get stuck

If I seem stuck or we hit issues you can't resolve:

1. First, break down the problem and give me clear step-by-step guidance
2. Point me to the relevant documentation above
3. If still stuck, help me post in the LaneLayer Discord (https://discord.gg/F9GwH7zzJm):
   - Draft a well-formatted question for me that includes what I'm trying to do, what I've tried, the exact error, relevant code, and my CLI version
   - Format it so I can just copy and paste it into Discord

## Key things to remember

- CLI installation is always the first priority
- Always use the K/V API for persistent storage
- Follow the project structure from the documentation
- Use the same patterns for route handlers and data management
- Keep the code clean, well-commented, and following best practices
- Test thoroughly before suggesting deployment
- Keep journey.log updated throughout

## Start now

Ask me what I want to build.`;
    }

    // Fetch prompt with tracking from backend, fallback to static
    async function getPromptWithTracking() {
        try {
            var resp = await fetch(ANALYTICS_API + '/prompt/latest');
            if (resp.ok) {
                var data = await resp.json();
                return { content: data.content, sessionId: data.session_id, version: data.version };
            }
        } catch (e) {
            // Backend unavailable, use static prompt
        }
        return { content: getStaticPrompt(), sessionId: null, version: 'static' };
    }

    // Track copy event (non-blocking)
    function trackCopyEvent(userId, sessionId, version) {
        fetch(ANALYTICS_API + '/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'copy_prompt',
                user_id: userId,
                session_id: sessionId,
                data: {
                    prompt_version: version,
                    source: window.location.pathname,
                    referrer: document.referrer
                }
            })
        }).catch(function() {});
    }

    // Copy to clipboard
    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                document.body.removeChild(textArea);
                return true;
            } catch (err) {
                document.body.removeChild(textArea);
                return false;
            }
        }
    }

    // Show feedback message
    function showFeedback(button, message) {
        var originalText = button.innerHTML;
        button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ' + message;
        button.classList.add('copied');
        setTimeout(function() {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    // Setup copy prompt button
    var copyPromptBtn = document.getElementById('copyPromptBtn');
    if (copyPromptBtn) {
        copyPromptBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            try {
                var userId = getOrCreateUserId();
                var prompt = await getPromptWithTracking();

                var success = await copyToClipboard(prompt.content);

                if (success) {
                    showFeedback(copyPromptBtn, 'Copied!');
                    trackCopyEvent(userId, prompt.sessionId, prompt.version);
                } else {
                    console.error('Clipboard copy failed');
                    window.prompt('Copy this text:', prompt.content);
                }
            } catch (error) {
                console.error('Error copying prompt:', error);
                // Fallback to static prompt
                var fallback = getStaticPrompt();
                var fallbackSuccess = await copyToClipboard(fallback);
                if (fallbackSuccess) {
                    showFeedback(copyPromptBtn, 'Copied!');
                }
            }
        });
    }
})();
</script>
