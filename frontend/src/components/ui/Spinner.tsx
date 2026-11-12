export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  className?: string;
}

const sizeStyles = {
  sm: 'w-3.5 h-3.5',
  md: 'w-5 h-5',
  lg: 'w-8 h-8',
};

export function Spinner({ size = 'md', class: cls, className }: SpinnerProps) {
  const extra = className || cls || '';

  return (
    <svg
      class={`animate-spin text-[#38bdf8] shrink-0 ${sizeStyles[size]} ${extra}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        class="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
      />
      <circle
        class="opacity-90"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="32"
        stroke-dashoffset="12"
      />
    </svg>
  );
}

export default Spinner;
