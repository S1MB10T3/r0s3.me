import { useCallback, useSyncExternalStore } from 'react'

/**
 * Hash-based overlay routing (ADR-001).
 * `r0s3.me/#caldera` -> slug "caldera" opens that overlay above Home.
 * Empty hash -> no overlay. Back/forward naturally open/close overlays.
 */

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getSlug(): string {
  return decodeURIComponent(window.location.hash.replace(/^#\/?/, ''))
}

export function useHashRoute() {
  const slug = useSyncExternalStore(subscribe, getSlug, () => '')

  const open = useCallback((next: string) => {
    window.location.hash = next
  }, [])

  const close = useCallback(() => {
    // Prefer history.back() so Back/close behave identically when the
    // overlay was opened in-app; fall back to clearing the hash on deep links.
    if (window.history.state !== null && window.history.length > 1) {
      window.history.back()
    } else {
      // strips the hash without adding a history entry
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
  }, [])

  return { slug, open, close }
}
