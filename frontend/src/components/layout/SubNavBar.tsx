import type { ComponentChildren } from 'preact';

export interface SubNavBarProps {
  title: string;
  icon?: ComponentChildren;
  onBack: () => void;
  saving?: boolean;
  saveText?: string;
  class?: string;
  className?: string;
}

export function SubNavBar({
  title,
  icon,
  onBack,
  saving = false,
  saveText,
  class: cls,
  className,
}: SubNavBarProps) {
  const extra = className || cls || '';

  return (
    <div
      class={`sticky top-3.5 z-30 flex items-center gap-3 px-4 py-2.5 mb-4 bg-[#0b0d13]/90 backdrop-blur-md border border-white/15 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] w-full max-w-[980px] mx-auto select-none ${extra}`}
    >
      <button
        type="button"
        onClick={onBack}
        class="w-8 h-8 flex items-center justify-center rounded-md text-white hover:text-[#38bdf8] hover:bg-white/10 transition-colors cursor-pointer shrink-0"
        title="Back"
        aria-label="Back"
      >
        <svg
          class="w-4.5 h-4.5 stroke-current fill-none"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <div class="w-px h-4.5 bg-white/15 shrink-0" />

      <div class="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && (
          <span class="w-5 h-5 flex items-center justify-center shrink-0 text-[#38bdf8] [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-current [&>svg]:fill-none [&>svg]:stroke-2">
            {icon}
          </span>
        )}
        <span class="text-base font-bold font-mono text-white tracking-tight truncate">
          {title}
        </span>
      </div>

      {(saving || saveText) && (
        <div
          class={`ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border shrink-0 transition-all ${
            saving
              ? 'bg-[#38bdf8]/12 border-[#38bdf8]/35 text-[#38bdf8]'
              : 'bg-[#10b981]/12 border-[#10b981]/35 text-[#10b981]'
          }`}
        >
          {saving && (
            <svg
              class="w-3 h-3 animate-spin stroke-current fill-none"
              stroke-width="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12" />
            </svg>
          )}
          <span>{saveText || (saving ? 'Applying...' : 'Saved')}</span>
        </div>
      )}
    </div>
  );
}

export default SubNavBar;
