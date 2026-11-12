import type { ComponentChildren } from 'preact';

export interface ButtonProps {
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ComponentChildren;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  className?: string;
}

const variantStyles = {
  default:
    'bg-[#38bdf8] text-[#0b1120] hover:bg-[#0ea5e9] border border-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.25)] hover:shadow-[0_0_16px_rgba(56,189,248,0.4)]',
  ghost:
    'bg-[#121214] text-[#e4e4e7] hover:bg-[#27272a] hover:text-white border border-white/10 hover:border-white/30',
  danger:
    'bg-[#ef4444]/15 text-[#f87171] hover:bg-[#ef4444] hover:text-white border border-[#ef4444]/40 hover:shadow-[0_0_14px_rgba(239,68,68,0.4)]',
};

const sizeStyles = {
  sm: 'px-2.5 py-1 text-[10px]',
  md: 'px-4 py-2 text-[11.5px]',
};

export function Button({
  variant = 'default',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  class: cls,
  className,
}: ButtonProps) {
  const extra = className || cls || '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      class={`inline-flex items-center justify-center gap-1.5 font-bold font-mono uppercase tracking-wider rounded-lg transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${extra}`}
    >
      {children}
    </button>
  );
}

export default Button;
