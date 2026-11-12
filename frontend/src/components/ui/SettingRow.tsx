import type { ComponentChildren } from 'preact';

export interface SettingRowProps {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  children?: ComponentChildren;
  arrow?: boolean;
  class?: string;
  className?: string;
}

export function SettingRow({
  label,
  sublabel,
  onClick,
  children,
  arrow,
  class: cls,
  className,
}: SettingRowProps) {
  const isClickable = typeof onClick === 'function';
  const showArrow = arrow ?? isClickable;
  const extra = className || cls || '';

  return (
    <div
      onClick={onClick}
      class={`group flex items-center justify-between px-4 py-3 border-b border-maxnet-border/50 last:border-b-0 min-h-[48px] gap-3.5 transition-colors duration-150 select-none ${
        isClickable ? 'cursor-pointer hover:bg-white/[0.035]' : 'bg-transparent'
      } ${extra}`}
    >
      <div class="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
        <span class="text-[13.5px] font-bold font-mono text-white tracking-tight leading-snug">
          {label}
        </span>
        {sublabel && (
          <span class="text-[11px] text-maxnet-dim font-mono leading-relaxed break-words">
            {sublabel}
          </span>
        )}
      </div>

      <div class="flex items-center justify-end gap-2 shrink-0 min-w-[44px]">
        {children}
        {showArrow && (
          <svg
            class="w-4 h-4 text-maxnet-dim group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all opacity-60 group-hover:opacity-100 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default SettingRow;
