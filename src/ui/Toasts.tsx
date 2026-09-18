import { useToast } from '@/state/toast';

export function Toasts() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className="toast" role="status">
          <span>{t.message}</span>
          {t.action && <button type="button" className="toast-action" onClick={() => { t.action!.onClick(); dismiss(t.id); }}>{t.action.label}</button>}
          <button type="button" className="toast-close" aria-label="닫기" onClick={() => dismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
