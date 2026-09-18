import { useSearchParams } from 'react-router';
import { filterProducts, activeFilterCount, type ShopFilters } from '@/data/repo';
import { ProductTile } from '@/ui/ProductTile';
import { FilterControls, FilterSheet, SortSelect } from '@/ui/FilterSheet';
import { EmptyState } from '@/ui/States';
import { CLink, useConcept } from '@/concepts/concept';
import { CATEGORY_LABEL, GAME_LABEL, LANGUAGE_LABEL } from '@/data/types';

export function useShopFilters(): [ShopFilters, (f: ShopFilters) => void] {
  const [sp, setSp] = useSearchParams();
  const f: ShopFilters = {
    q: sp.get('q') ?? undefined,
    category: (sp.get('category') as ShopFilters['category']) ?? 'all',
    game: (sp.get('game') as ShopFilters['game']) ?? 'all',
    language: (sp.get('language') as ShopFilters['language']) ?? 'all',
    inStockOnly: sp.get('stock') === '1',
    sort: (sp.get('sort') as ShopFilters['sort']) ?? 'editorial',
  };
  const set = (n: ShopFilters) => {
    const next = new URLSearchParams();
    if (n.q) next.set('q', n.q);
    if (n.category && n.category !== 'all') next.set('category', n.category);
    if (n.game && n.game !== 'all') next.set('game', n.game);
    if (n.language && n.language !== 'all') next.set('language', n.language);
    if (n.inStockOnly) next.set('stock', '1');
    if (n.sort && n.sort !== 'editorial') next.set('sort', n.sort);
    setSp(next);
  };
  return [f, set];
}

export function ShopPage() {
  const [f, setF] = useShopFilters();
  const c = useConcept();
  const list = filterProducts(f);
  const n = activeFilterCount(f);
  const chips: { label: string; clear: () => void }[] = [];
  if (f.category && f.category !== 'all') chips.push({ label: CATEGORY_LABEL[f.category], clear: () => setF({ ...f, category: 'all' }) });
  if (f.game && f.game !== 'all') chips.push({ label: GAME_LABEL[f.game], clear: () => setF({ ...f, game: 'all' }) });
  if (f.language && f.language !== 'all') chips.push({ label: LANGUAGE_LABEL[f.language], clear: () => setF({ ...f, language: 'all' }) });
  if (f.inStockOnly) chips.push({ label: '구매 가능만', clear: () => setF({ ...f, inStockOnly: false }) });
  return (
    <main className="page shop-page">
      <header className="page-head">
        <h1 className="page-title">샵</h1>
        <p className="page-lead">팩·박스와 카드 용품. 가격과 판매 단위, 재고 상태를 목록에서 바로 확인할 수 있어요.</p>
      </header>
      <div className="shop-layout">
        <aside className="shop-filters-desktop" aria-label="필터">
          <FilterControls value={f} onChange={setF} />
        </aside>
        <div className="shop-main">
          <div className="shop-toolbar">
            <div className="shop-toolbar-left">
              <span className="shop-count" aria-live="polite">{list.length}개 상품</span>
              <FilterSheet value={f} onApply={setF} resultCount={list.length} />
              {chips.map((ch) => (
                <button key={ch.label} type="button" className="chip chip-active" onClick={ch.clear} aria-label={`${ch.label} 필터 해제`}>{ch.label} ✕</button>
              ))}
              {n > 0 && <button type="button" className="link-btn" onClick={() => setF({ sort: f.sort, q: f.q })}>전체 해제</button>}
            </div>
            <SortSelect value={f.sort} onChange={(s) => setF({ ...f, sort: s })} />
          </div>
          {list.length === 0 ? (
            <EmptyState title="조건에 맞는 상품이 없어요." hint="필터를 일부 해제하거나 세트 코드·카드 이름으로 검색해 보세요." actions={<><button className="btn btn-primary" onClick={() => setF({ sort: f.sort })}>필터 전체 해제</button><CLink to="/sets" className="btn btn-secondary">카드 도감에서 찾기</CLink></>} />
          ) : (
            <div className={`product-grid ${c === 'b' ? 'is-dense' : ''}`}>
              {list.map((p) => <ProductTile key={p.id} product={p} dense={c === 'b'} showSet={c === 'b'} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
