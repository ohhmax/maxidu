import type { ComponentChildren } from 'preact';
import { Badge } from './Badge';

export interface CardProps {
  title?: string;
  badge?: string;
  badgeColor?: 'sky' | 'emerald' | 'amber' | 'red' | string;
  children: ComponentChildren;
  class?: string;
  className?: string;
}

export function Card({
  title,
  badge,
  badgeColor = 'sky',
  children,
  class: cls,
  className,
}: CardProps) {
  const extra = className || cls || '';

  return (
    <div
      class={`bg-maxnet-card border border-maxnet-border rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.35)] p-0 transition-all duration-200 ${extra}`}
    >
      {title && (
        <div class="flex items-center justify-between px-4 py-3 bg-[#16171d] border-b border-white/[0.08]">
          <h3 class="text-[13.5px] font-bold font-mono text-white tracking-tight m-0 uppercase">
            {title}
          </h3>
          {badge && <Badge color={badgeColor}>{badge}</Badge>}
        </div>
      )}
      <div class="settings-card-body p-0">{children}</div>
    </div>
  );
}

export default Card;
