import { OddlyMark } from './Placeholder';
import { useConcept } from '@/concepts/concept';

/** 검색 결과 없음·품절 등. 해결 행동이 먼저 보인다. 캐릭터는 방향 A/C에서만 작게 등장. */
export function EmptyState({ title, hint, actions }: { title: string; hint?: string; actions?: React.ReactNode }) {
  const c = useConcept();
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-body">
        <p className="empty-state-title">{title}</p>
        {hint && <p className="empty-state-hint">{hint}</p>}
        {actions && <div className="empty-state-actions">{actions}</div>}
      </div>
      {c !== 'b' && <OddlyMark size={c === 'c' ? 120 : 84} mood="listen" gaze="left" className="empty-state-mark" />}
    </div>
  );
}
export function ErrorState({ title = '불러오지 못했어요', hint, onRetry }: { title?: string; hint?: string; onRetry?: () => void }) {
  return (
    <div className="empty-state error-state" role="alert">
      <div className="empty-state-body">
        <p className="empty-state-title">{title}</p>
        {hint && <p className="empty-state-hint">{hint}</p>}
        {onRetry && (
          <div className="empty-state-actions">
            <button className="btn btn-secondary" onClick={onRetry}>다시 시도</button>
          </div>
        )}
      </div>
    </div>
  );
}
