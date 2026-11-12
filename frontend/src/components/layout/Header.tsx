export interface HeaderProps {
  hostname: string;
  version: string;
  onReset?: () => void;
  onNotifications?: () => void;
  onSettings?: () => void;
  notificationCount?: number;
  class?: string;
  className?: string;
}

export function Header({
  hostname,
  version,
  onReset,
  onNotifications,
  onSettings,
  notificationCount = 0,
  class: cls,
  className,
}: HeaderProps) {
  const extra = className || cls || '';

  return (
    <header
      class={`sticky top-0 left-0 right-0 z-40 w-full flex items-center justify-between px-4 py-2.5 bg-[#090b10]/85 backdrop-blur-md border-b border-white/[0.08] transition-all duration-200 ${extra}`}
    >
      <div class="flex flex-col gap-0.5 select-none pointer-events-auto">
        <span class="text-xs md:text-sm font-black font-mono tracking-wider text-white uppercase truncate">
          {hostname || 'MAXNET GATEWAY'}
        </span>
        <span class="text-[10px] font-mono text-maxnet-dim">
          {version || 'v2.2.20'}
        </span>
      </div>

      <div
        class="flex items-center gap-1.5 p-1 bg-[#12141d]/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg pointer-events-auto"
        role="toolbar"
        aria-label="Topology Controls"
      >
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            class="w-7 h-7 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Reset Topology View"
            aria-label="Reset Topology View"
          >
            <svg
              class="w-3.5 h-3.5 stroke-current fill-none"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}

        {onNotifications && (
          <button
            type="button"
            onClick={onNotifications}
            class="relative w-7 h-7 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <svg
              class="w-3.5 h-3.5 stroke-current fill-none"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notificationCount > 0 && (
              <span class="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full shadow-[0_0_6px_#ef4444]" />
            )}
          </button>
        )}

        {onSettings && (
          <button
            type="button"
            onClick={onSettings}
            class="w-7 h-7 flex items-center justify-center rounded-md text-[#94a3b8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Settings"
            aria-label="Settings"
          >
            <svg
              class="w-3.5 h-3.5 stroke-current fill-none"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
