import type { ComponentChildren } from 'preact';

export interface BadgeProps {
  color?: 'sky' | 'emerald' | 'amber' | 'red' | string;
  children: ComponentChildren;
  class?: string;
  className?: string;
}

const colorStyles: Record<string, string> = {
  sky: 'bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30',
  emerald: 'bg-[#10b981]/10 text-[#34d399] border-[#10b981]/30',
  amber: 'bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/30',
  red: 'bg-[#f43f5e]/10 text-[#f87171] border-[#f43f5e]/30',
};

export function Badge({ color = 'sky', children, class: cls, className }: BadgeProps) {
  const variant = colorStyles[color] || 'bg-white/[0.05] text-[#94a3b8] border-white/10';
  const extra = className || cls || '';

  return (
    <span
      class={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold font-mono uppercase tracking-wider border ${variant} ${extra}`}
    >
      {children}
    </span>
  );
}

export default Badge;
