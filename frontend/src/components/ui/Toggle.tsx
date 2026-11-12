export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  class?: string;
  className?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  class: cls,
  className,
}: ToggleProps) {
  const extra = className || cls || '';

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      class={`relative inline-block w-11 h-6 shrink-0 select-none cursor-pointer rounded-full transition-colors duration-200 border ${
        checked
          ? 'bg-[#10b981] border-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.35)]'
          : 'bg-[#27272a] border-white/15'
      } ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${extra}`}
    >
      <span
        class={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.4)] ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </div>
  );
}

export default Toggle;
