/* ==============================================================================
   MAXNET CORE: SHARED FORMATTERS, SANITIZERS & TOAST COMPONENT
   ============================================================================== */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

function fmtBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '0 B';
  const b = Number(bytes);
  if (b === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getTempColor(c) {
  if (c >= 70) return '#ef4444';
  if (c >= 55) return '#f59e0b';
  return '#10b981';
}

function getUsageColor(pct) {
  if (pct >= 85) return '#ef4444';
  if (pct >= 65) return '#f59e0b';
  return '#10b981';
}

function showToast(message, type = 'info', duration = 3000) {
  let toastEl = document.getElementById('globalAppToast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'globalAppToast';
    toastEl.className = 'global-app-toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.className = `global-app-toast show ${type}`;
  clearTimeout(toastEl._timer);
  toastEl._timer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

function hapticFeedback(pattern = [10]) {
  try {
    if (navigator.vibrate && localStorage.getItem('maxnet_haptic') !== 'off') {
      navigator.vibrate(pattern);
    }
  } catch (e) {}
}
