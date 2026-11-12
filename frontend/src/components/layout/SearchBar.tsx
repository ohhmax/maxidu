export interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onBack?: () => void;
  placeholder?: string;
  class?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onBack,
  placeholder = 'Search settings...',
  class: cls,
  className,
}: SearchBarProps) {
  const extra = className || cls || '';

  const handleInput = (e: Event) => {
    onChange((e.target as HTMLInputElement).value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div class={`sticky top-3.5 z-30 mb-4 w-full max-w-[980px] mx-auto ${extra}`}>
      <div class="flex items-center gap-3 px-4 py-2.5 bg-[#0b0d13]/90 backdrop-blur-md border border-white/15 focus-within:border-[#38bdf8]/50 focus-within:ring-2 focus-within:ring-[#38bdf8]/10 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] w-full transition-all duration-150">
        {onBack && (
          <>
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
          </>
        )}

        <svg
          class="w-4 h-4 text-maxnet-dim shrink-0 stroke-current fill-none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          value={value}
          onInput={handleInput}
          placeholder={placeholder}
          class="w-full bg-transparent border-0 outline-none text-white text-[13.5px] font-mono placeholder:text-maxnet-dim"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            class="text-maxnet-dim hover:text-white hover:bg-white/10 px-2 py-0.5 rounded text-xs transition-colors shrink-0 cursor-pointer"
            title="Clear search"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
