/* ==============================================================================
   MAXNET CORE: THEME CONTROLLER & SEAMLESS SYNC
   ============================================================================== */
let currentThemeMode = localStorage.getItem('maxnet_theme_mode') || 'night';
if (!localStorage.getItem('maxnet_theme_mode') && localStorage.getItem('maxnet_theme')) {
  currentThemeMode = (localStorage.getItem('maxnet_theme') === 'light') ? 'day' : 'night';
}
let currentTheme = (currentThemeMode === 'day') ? 'light' : 'dark';

function applyThemeMode() {
  let resolvedTheme = 'dark';
  if (currentThemeMode === 'auto') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolvedTheme = prefersDark ? 'dark' : 'light';
  } else if (currentThemeMode === 'day') {
    resolvedTheme = 'light';
  } else {
    resolvedTheme = 'dark';
  }
  currentTheme = resolvedTheme;
  document.documentElement.setAttribute('data-theme', resolvedTheme);
  if (document.body) document.body.setAttribute('data-theme', resolvedTheme);

  // Synchronize browser header theme color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', resolvedTheme === 'light' ? '#f4f4f5' : '#080808');
  }

  updateThemeTriButtons();
  if (typeof updateTerminalTheme === 'function') {
    try { updateTerminalTheme(); } catch (e) {}
  }
  if (typeof buildUsbBwSvg === 'function') {
    try { buildUsbBwSvg(); } catch (e) {}
  }
}

function setThemeMode(mode) {
  currentThemeMode = mode;
  localStorage.setItem('maxnet_theme_mode', mode);
  localStorage.setItem('maxnet_theme', (mode === 'day') ? 'light' : 'dark');
  applyThemeMode();
  if (typeof showToast === 'function') {
    showToast(`Theme mode switched to ${mode.toUpperCase()}`, 'info');
  }
}

function updateThemeTriButtons() {
  const modes = ['day', 'night', 'auto'];
  modes.forEach(m => {
    const btn = document.getElementById(`btnThemeMode_${m}`);
    if (btn) {
      if (m === currentThemeMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });
}

function toggleTheme() {
  const nextMode = (currentTheme === 'dark') ? 'day' : 'night';
  setThemeMode(nextMode);
}

// Initial immediate sync
applyThemeMode();
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentThemeMode === 'auto') applyThemeMode();
  });
}
