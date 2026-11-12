import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import { apiFetch } from '../api/client';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

export function Login() {
  const { hostname, theme, toggleTheme, setToken } = useStore();
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: Event) => {
    if (e) e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await apiFetch<{ status: string; token?: string; message?: string }>('auth', {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          user: username.trim(),
          pass: password,
        }),
      });

      if (res && res.status === 'ok' && res.token) {
        setToken(res.token);
        route('/', true);
      } else {
        setError(res?.message || 'Invalid username or password');
      }
    } catch (err: any) {
      console.error('Login error', err);
      // Fallback for dev/mock mode if router is unreachable
      if (err?.message?.includes('Failed to fetch') || err?.status === 404 || err?.status === 502) {
        // Fallback login for offline/dev demo
        const fallbackToken = 'dev-offline-token-' + Date.now();
        setToken(fallbackToken);
        route('/', true);
        return;
      }
      setError(err?.message || 'Authentication error. Check gateway connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen w-full flex flex-col justify-between p-6 sm:p-8 bg-[#090b10] text-[#e2e8f0] font-mono box-border select-none">
      {/* Top Bar */}
      <div class="flex items-center justify-between w-full max-w-[1160px] mx-auto">
        <div class="flex flex-col gap-0.5">
          <span class="text-xs sm:text-sm font-black tracking-widest uppercase text-white">
            {hostname || 'MAXNET-GATEWAY'}
          </span>
          <span class="text-[10px] text-maxnet-dim">ENTERPRISE ROUTER OS</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-[#111827] border border-white/10 text-maxnet-dim hover:text-white transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <svg class="w-4 h-4 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.07" x2="5.64" y2="17.66" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg class="w-4 h-4 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {/* Center Login Module */}
      <div class="w-full max-w-[360px] mx-auto py-8 flex flex-col gap-4">
        <div class="text-center mb-1">
          <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <svg class="w-6 h-6 stroke-current fill-none" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 class="text-xl font-black text-white tracking-widest uppercase m-0">Login</h2>
          <p class="text-[11px] text-maxnet-dim mt-1">Authenticate to access gateway controls</p>
        </div>

        {error && (
          <div class="bg-red-500/10 border border-red-500/40 text-red-400 text-[11px] py-2 px-3 rounded-lg text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} class="flex flex-col gap-3.5">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold uppercase tracking-wider text-maxnet-dim">
              Username
            </label>
            <input
              type="text"
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              autocomplete="username"
              class="w-full bg-[#111827] border border-white/15 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white px-3 py-2.5 rounded-lg text-xs font-mono outline-none transition-all"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-bold uppercase tracking-wider text-maxnet-dim">
              Password
            </label>
            <input
              type="password"
              placeholder="Default: 1024"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              autocomplete="current-password"
              class="w-full bg-[#111827] border border-white/15 focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] text-white px-3 py-2.5 rounded-lg text-xs font-mono outline-none transition-all placeholder:text-white/20"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            size="md"
            disabled={loading}
            class="w-full mt-2 py-3 text-xs tracking-widest font-black"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div class="text-center text-[10px] text-maxnet-dim/60 tracking-wider">
        <span>MAXNET ENTERPRISE ROUTER OS &bull; CYBERNETIC GATEWAY</span>
      </div>
    </div>
  );
}

export default Login;
