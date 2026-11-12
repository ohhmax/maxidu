import { useEffect } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import Router, { Route } from 'preact-router';
import { useStore } from './store/useStore';
import { Spinner } from './components/ui/Spinner';

const Login = lazy(() => import('./pages/Login'));
const Overview = lazy(() => import('./pages/Overview'));
const Settings = lazy(() => import('./pages/Settings'));
const SettingsDetail = lazy(() => import('./pages/SettingsDetail'));
const Terminal = lazy(() => import('./pages/Terminal'));
const Diagnostics = lazy(() => import('./pages/Diagnostics'));

function PageLoader() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-[#090b10]">
      <div class="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <span class="text-xs font-mono text-maxnet-dim uppercase tracking-wider">
          Loading Module...
        </span>
      </div>
    </div>
  );
}

export function App() {
  const { theme, token } = useStore();

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Handle initial auth redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (!token && path !== '/login') {
        // Optional auth gate
        // route('/login', true);
      }
    }
  }, [token]);

  return (
    <main class="min-h-screen bg-maxnet-bg text-slate-100 font-mono">
      <Suspense fallback={<PageLoader />}>
        <Router>
          <Route path="/login" component={Login} />
          <Route path="/" component={Overview} />
          <Route path="/settings" component={Settings} />
          <Route path="/settings/:page" component={SettingsDetail} />
          <Route path="/terminal" component={Terminal} />
          <Route path="/diagnostics" component={Diagnostics} />
        </Router>
      </Suspense>
    </main>
  );
}

export default App;
