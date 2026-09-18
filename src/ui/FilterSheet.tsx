import { useEffect, useRef, useState } from 'react';
import type { ShopFilters } from '@/data/repo';
import { activeFilterCount } from '@/data/repo';
import { CATEGORY_LABEL, GAME_LABEL, LANGUAGE_LABEL } from '@/data/types';

/**
 * 상품 필터. 데스크톱은 인라인 패널, 모바일은 닫기/적용/초기화가 분명한 시트.
 * 선택은 URL에 보존된다(뒤로 가기·공유 가능).
 */
export function FilterControls({ value, onChange }: { value: ShopFilters; onChange: (v: ShopFilters) => void }) {
  const showLanguage = value.category !== 'supply';
  return (
    <div className="filter-groups">
      <fieldset className="filter-group">
        <legend>카테고리</legend>
        {(['all', 'pack', 'box', 'supply'] as const).map((k) => (
          <label key={k} className={`chip ${(value.category ?? 'all') === k ? 'is-on' : ''}`}>
            <input type="radio" name="category" checked={(value.category ?? 'all') === k} onChange={() => onChange({ ...value, category: k, language: k === 'supply' ? 'all' : value.language })} />
            {k === 'all' ? '전체' : CATEGORY_LABEL[k]}
          </label>
        ))}
      </fieldset>
      <fieldset className="filter-group">
        <legend>게임 / IP</legend>
        {(['all', 'pokemon', 'onepiece', 'riftbound'] as const).map((k) => (
          <label key={k} className={`chip ${(value.game ?? 'all') === k ? 'is-on' : ''}`}>
            <input type="radio" name="game" checked={(value.game ?? 'all') === k} onChange={() => onChange({ ...value, game: k })} />
            {k === 'all' ? '전체' : GAME_LABEL[k]}
          </label>
        ))}
      </fieldset>
      {showLanguage && (
        <fieldset className="filter-group">
          <legend>언어 · 지역판 <small className="muted">(카드 상품)</small></legend>
          {(['all', 'ko', 'ja', 'en'] as const).map((k) => (
            <label key={k} className={`chip ${(value.language ?? 'all') === k ? 'is-on' : ''}`}>
              <input type="radio" name="language" checked={(value.language ?? 'all') === k} onChange={() => onChange({ ...value, language: k })} />
              {k === 'all' ? '전체' : LANGUAGE_LABEL[k]}
            </label>
          ))}
        </fieldset>
      )}
      <fieldset className="filter-group">
        <legend>재고</legend>
        <label className={`chip ${value.inStockOnly ? 'is-on' : ''}`}>
          <input type="checkbox" checked={!!value.inStockOnly} onChange={(e) => onChange({ ...value, inStockOnly: e.target.checked })} />
          구매 가능만
        </label>
      </fieldset>
    </div>
  );
}

export function SortSelect({ value, onChange }: { value: ShopFilters['sort']; onChange: (v: ShopFilters['sort']) => void }) {
  return (
    <label className="sort-select">
      <span className="sr-only">정렬</span>
      <select value={value ?? 'editorial'} onChange={(e) => onChange(e.target.value as ShopFilters['sort'])}>
        <option value="editorial">추천순 (편집 기준)</option>
        <option value="newest">세트 발매 최신순</option>
        <option value="price_asc">가격 낮은순</option>
        <option value="price_desc">가격 높은순</option>
      </select>
    </label>
  );
}

export function FilterSheet({ value, onApply, resultCount }: { value: ShopFilters; onApply: (v: ShopFilters) => void; resultCount: number }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const openerRef = useRef<HTMLButtonElement>(null);
  const firstRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setDraft(value), [value]);
  useEffect(() => {
    if (!open) return;
    firstRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); openerRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  const n = activeFilterCount(value);
  return (
    <>
      <button ref={openerRef} type="button" className="btn btn-secondary filter-open" onClick={() => setOpen(true)} aria-haspopup="dialog">
        필터{n > 0 && <span className="filter-count" aria-label={`${n}개 적용`}>{n}</span>}
      </button>
      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <h2 id="sheet-title">필터</h2>
              <button ref={firstRef} type="button" className="icon-btn" aria-label="닫기" onClick={() => { setOpen(false); openerRef.current?.focus(); }}>✕</button>
            </div>
            <div className="sheet-body"><FilterControls value={draft} onChange={setDraft} /></div>
            <div className="sheet-foot">
              <button type="button" className="btn btn-quiet" onClick={() => setDraft({ sort: draft.sort, q: draft.q })}>초기화</button>
              <button type="button" className="btn btn-primary" onClick={() => { onApply(draft); setOpen(false); openerRef.current?.focus(); }}>적용{resultCount >= 0 ? '' : ''}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
