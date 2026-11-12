export interface BottomNavProps {
  activeTab: 'overview' | 'settings' | string;
  onTabChange: (tab: string) => void;
  class?: string;
  className?: string;
}

export function BottomNav({
  activeTab,
  onTabChange,
  class: cls,
  className,
}: BottomNavProps) {
  const extra = className || cls || '';

  return (
    <nav
      class={`fixed bottom-0 left-0 right-0 z-40 w-full md:hidden bg-maxnet-surface/95 backdrop-blur-md border-t border-maxnet-border flex items-center justify-around py-1.5 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] select-none ${extra}`}
    >
      <button
        type="button"
        onClick={() => onTabChange('overview')}
        class={`flex flex-col items-center justify-center gap-1 py-1 px-5 cursor-pointer text-[10px] font-mono font-bold uppercase tracking-wider transition-colors bg-transparent border-none ${
          activeTab === 'overview'
            ? 'text-[#38bdf8]'
            : 'text-maxnet-dim hover:text-white'
        }`}
      >
        <svg
          class="w-5 h-5 stroke-current fill-none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span>Overview</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('settings')}
        class={`flex flex-col items-center justify-center gap-1 py-1 px-5 cursor-pointer text-[10px] font-mono font-bold uppercase tracking-wider transition-colors bg-transparent border-none ${
          activeTab === 'settings'
            ? 'text-[#38bdf8]'
            : 'text-maxnet-dim hover:text-white'
        }`}
      >
        <svg
          class="w-5 h-5 stroke-current fill-none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span>Settings</span>
      </button>
    </nav>
  );
}

export default BottomNav;
