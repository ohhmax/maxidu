/* ==============================================================================
   MAXNET CORE: SECURE API CLIENT (HARDENED anti-replay & anti-cache)
   ============================================================================== */
function apiFetch(url, options = {}) {
  const sep = url.includes('?') ? '&' : '?';
  const noCacheUrl = `${url}${sep}_t=${Date.now()}`;
  const token = localStorage.getItem('maxnet_token');
  return fetch(noCacheUrl, {
    ...options,
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...(token ? { 'X-Session-Token': token } : {}),
      ...(options.headers || {})
    }
  });
}
