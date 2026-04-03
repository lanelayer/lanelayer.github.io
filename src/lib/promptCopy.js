/** Shared LaneLayer analytics prompt fetch, copy, and event helpers (used by BuildFirstLane, Build). */

export const USER_ID_KEY = 'lanelayer_web_user_id'
export const DEFAULT_ANALYTICS_BASE = 'https://lanelayer-analytics.fly.dev'

export function resolveAnalyticsBase(container) {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  return (import.meta.env.DEV || isLocalhost)
    ? ''
    : (container.getAttribute('data-analytics-base') || DEFAULT_ANALYTICS_BASE)
}

export function getOrCreateUserId() {
  try {
    let id = localStorage.getItem(USER_ID_KEY)
    if (id) return id
    id = 'web_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36)
    localStorage.setItem(USER_ID_KEY, id)
    return id
  } catch (e) {
    return 'web_' + Date.now()
  }
}

export function applyPlaceholders(text, sessionId, userId) {
  if (!text) return text
  return text
    .replace(/\{\{SESSION_ID\}\}/g, sessionId || 'none')
    .replace(/\{\{USER_ID\}\}/g, userId || '')
}

/**
 * @param {string} analyticsBase — '' for same-origin /api (Vite proxy), or full origin
 */
export function createPromptCopyClient(analyticsBase) {
  const state = { content: null, sessionId: null, version: null, userId: null }
  let inflightFetchPromise = null

  function fetchPrompt(forceRefresh) {
    if (state.content != null && !forceRefresh) return Promise.resolve(state)
    if (inflightFetchPromise != null) return inflightFetchPromise
    state.userId = getOrCreateUserId()
    const url = analyticsBase + '/api/v1/prompt/latest?t=' + Date.now()
    inflightFetchPromise = fetch(url, { method: 'GET', cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) {
          const e = new Error('fetch_failed')
          e.status = r.status
          throw e
        }
        return r.json()
      })
      .then(function (data) {
        state.content = data.content
        state.sessionId = data.session_id
        state.version = data.version
        inflightFetchPromise = null
        return state
      })
      .catch(function (err) {
        inflightFetchPromise = null
        throw err
      })
    return inflightFetchPromise
  }

  function sendPromptFetchError(err, status) {
    const userId = state.userId || getOrCreateUserId()
    return fetch(analyticsBase + '/api/v1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'prompt_fetch_error',
        user_id: userId,
        session_id: null,
        data: { error: (err && err.message) || 'unknown', status: status || null },
      }),
    }).catch(function () {})
  }

  function sendCopyEvent() {
    if (!state.sessionId || !state.userId) return Promise.resolve()
    return fetch(analyticsBase + '/api/v1/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'copy_prompt',
        user_id: state.userId,
        session_id: state.sessionId,
        data: state.version ? { prompt_version: state.version } : {},
      }),
    }).catch(function () {})
  }

  return { state, fetchPrompt, sendPromptFetchError, sendCopyEvent }
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      const ok = document.execCommand('copy')
      document.body.removeChild(textArea)
      return ok
    } catch (e) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

export function showFeedback(button, message) {
  const originalText = button.innerHTML
  button.innerHTML =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> ' +
    message
  button.classList.add('copied')
  setTimeout(function () {
    button.innerHTML = originalText
    button.classList.remove('copied')
  }, 2000)
}

/**
 * Same click behavior as BuildFirstLane copy button.
 * @returns {() => void} cleanup
 */
export function attachCopyPromptListener(button, client) {
  const { state, fetchPrompt, sendPromptFetchError, sendCopyEvent } = client

  const handleClick = async function (e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await fetchPrompt()
      if (state.content == null) {
        sendPromptFetchError(new Error('fetch_failed'), null)
        showFeedback(button, 'Failed to load prompt')
        alert('Could not load prompt. Please try again or check your connection.')
        return
      }
      const fullPrompt = applyPlaceholders(state.content, state.sessionId, state.userId)
      const success = await copyToClipboard(fullPrompt)
      if (success) {
        showFeedback(button, 'Copied!')
        sendCopyEvent()
      } else {
        alert('Could not copy to clipboard.')
      }
    } catch (error) {
      sendPromptFetchError(error, error.status != null ? error.status : null)
      showFeedback(button, 'Error')
      alert('Could not load prompt. Please try again.')
    }
  }

  button.addEventListener('click', handleClick)
  return function () {
    button.removeEventListener('click', handleClick)
  }
}
