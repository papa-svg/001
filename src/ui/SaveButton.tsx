import { useSaved, type SavedKind } from '@/state/saved';
import { useToast } from '@/state/toast';

export function SaveButton({ kind, id, label, className, compact }: { kind: SavedKind; id: string; label?: string; className?: string; compact?: boolean }) {
  const { has, toggle } = useSaved();
  const { show } = useToast();
  const on = has(kind, id);
  return (
    <button
      type="button"
      className={`save-btn ${on ? 'is-on' : ''} ${compact ? 'is-compact' : ''} ${className ?? ''}`}
      aria-pressed={on}
      aria-label={on ? `${label ?? '저장'} 취소` : `${label ?? '저장'}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const next = toggle(kind, id);
        show(next ? '저장 목록에 담았어요. (이 브라우저에만 저장)' : '저장을 취소했어요.');
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {!compact && <span>{on ? '저장됨' : label ?? '저장'}</span>}
    </button>
  );
}
