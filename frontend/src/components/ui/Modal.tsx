import type { ComponentChildren } from 'preact';
import { useEffect } from 'preact/hooks';
import { Badge } from './Badge';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  badge?: string;
  children: ComponentChildren;
  footer?: ComponentChildren;
  class?: string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  badge,
  children,
  footer,
  class: cls,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const extra = className || cls || '';

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-200"
    >
      <div
        class={`w-full max-w-[500px] bg-maxnet-card/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col transition-transform duration-200 ${extra}`}
      >
        <div class="flex items-start justify-between px-5 pt-5 pb-3 border-b border-white/[0.08]">
          <div class="flex flex-col gap-1 min-w-0 pr-3">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold font-mono text-white tracking-tight m-0">
                {title}
              </h3>
              {badge && <Badge color="sky">{badge}</Badge>}
            </div>
            {description && (
              <p class="text-xs text-maxnet-dim font-mono leading-relaxed m-0">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            class="text-[#71717a] hover:text-white hover:bg-white/10 p-1 rounded-md transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="p-5 flex flex-col gap-3 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {footer && (
          <div class="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-white/[0.02] border-t border-white/[0.06]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
