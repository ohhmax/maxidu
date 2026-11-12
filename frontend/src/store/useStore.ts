import { create } from 'zustand';

export interface AppState {
  theme: 'dark' | 'light';
  token: string | null;
  hostname: string;
  version: string;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setToken: (token: string | null) => void;
  setHostname: (hostname: string) => void;
  setVersion: (version: string) => void;
}

export const useStore = create<AppState>((set) => ({
  theme: (typeof localStorage !== 'undefined' && (localStorage.getItem('maxnet_theme') as 'dark' | 'light')) || 'dark',
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('maxnet_token') : null,
  hostname: 'MAXNET-GATEWAY',
  version: 'v2.2.20',
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('maxnet_theme', nextTheme);
      }
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(nextTheme);
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('maxnet_theme', theme);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }
    set({ theme });
  },
  setToken: (token) => {
    if (typeof localStorage !== 'undefined') {
      if (token) {
        localStorage.setItem('maxnet_token', token);
      } else {
        localStorage.removeItem('maxnet_token');
      }
    }
    set({ token });
  },
  setHostname: (hostname) => set({ hostname }),
  setVersion: (version) => set({ version }),
}));
