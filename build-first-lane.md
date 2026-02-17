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

    function applyPlaceholders(text, sessionId, userId) {
        if (!text) return text;
        return text.replace(/\{\{SESSION_ID\}\}/g, sessionId || 'none').replace(/\{\{USER_ID\}\}/g, userId || '');
    }

    function fetchPrompt() {
        state.userId = getOrCreateUserId();
        var url = ANALYTICS_BASE + '/api/v1/prompt/latest?t=' + Date.now();
        return fetch(url, { method: 'GET', cache: 'no-store' })
            .then(function(r) {
                if (!r.ok) { var e = new Error('fetch_failed'); e.status = r.status; throw e; }
                return r.json();
            })
            .then(function(data) {
                state.content = data.content;
                state.sessionId = data.session_id;
                state.version = data.version;
                return state;
            });
    }

    function sendPromptFetchError(err, status) {
        var userId = state.userId || getOrCreateUserId();
        return fetch(ANALYTICS_BASE + '/api/v1/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: 'prompt_fetch_error',
                user_id: userId,
                session_id: null,
                data: { error: (err && err.message) || 'unknown', status: status || null }
            })
        }).catch(function() {});
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
        fetchPrompt().catch(function() {});
        copyPromptBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                await fetchPrompt();
                if (state.content == null) {
                    sendPromptFetchError(new Error('fetch_failed'), null);
                    showFeedback(copyPromptBtn, 'Failed to load prompt');
                    alert('Could not load prompt. Please try again or check your connection.');
                    return;
                }
                var fullPrompt = applyPlaceholders(state.content, state.sessionId, state.userId);
                var success = await copyToClipboard(fullPrompt);
                if (success) {
                    showFeedback(copyPromptBtn, 'Copied!');
                    sendCopyEvent();
                } else {
                    alert('Could not copy to clipboard.');
                }
            } catch (error) {
                sendPromptFetchError(error, error.status != null ? error.status : null);
                showFeedback(copyPromptBtn, 'Error');
                alert('Could not load prompt. Please try again.');
            }
        });
    }
})();
</script>
