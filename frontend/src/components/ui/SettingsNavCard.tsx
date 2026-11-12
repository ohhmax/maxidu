import type { ComponentChildren } from 'preact';
import { Badge } from './Badge';

export interface SettingsNavCardProps {
  icon: ComponentChildren;
  iconColor?: string;
  title: string;
  description: string;
  onClick: () => void;
  badge?: string;
  class?: string;
  className?: string;
}

export function SettingsNavCard({
  icon,
  iconColor = '#38bdf8',
  title,
  description,
  onClick,
  badge,
  class: cls,
  className,
}: SettingsNavCardProps) {
  const extra = className || cls || '';

  return (
    <div
      onClick={onClick}
      class={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200 bg-transparent hover:bg-white/[0.04] hover:translate-x-1 active:scale-[0.995] gap-4 box-border border border-transparent hover:border-white/5 select-none ${extra}`}
    >
      <div class="flex items-center gap-3.5 min-w-0 flex-1">
        <div
          class="w-6 h-6 min-w-6 flex items-center justify-center shrink-0 [&>svg]:w-5.5 [&>svg]:h-5.5 [&>svg]:stroke-current [&>svg]:fill-none [&>svg]:stroke-2"
          style={{ color: iconColor }}
        >
          {icon}
        </div>
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-[14.5px] font-bold font-mono text-white tracking-tight truncate leading-tight">
            {title}
          </span>
          <span class="text-[11.5px] font-mono text-maxnet-dim truncate leading-snug">
            {description}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        {badge && <Badge color="sky">{badge}</Badge>}
        <svg
          class="w-4 h-4 text-[#71717a] group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all opacity-60 group-hover:opacity-100 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  );
}

export default SettingsNavCard;
