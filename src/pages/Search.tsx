import { useSearchParams } from 'react-router';
import { searchAll } from '@/data/repo';
import { SearchBox } from '@/ui/Header';
import { ProductTile } from '@/ui/ProductTile';
import { CardTile } from '@/ui/CardTile';
import { EmptyState } from '@/ui/States';
import { CLink } from '@/concepts/concept';
import { LANGUAGE_LABEL, GAME_LABEL } from '@/data/types';

export function SearchPage() {
  const [sp] = useSearchParams();
  const q = sp.get('q') ?? '';
  const r = searchAll(q);
  const total = r.products.length + r.sets.length + r.printings.length + r.stories.length;
  return (
    <main className="page search-page">
      <header className="page-head">
        <h1 className="page-title">검색</h1>
        <SearchBox size="lg" autoFocus={!q} />
      </header>
      {!q && <p className="page-lead">상품 이름, 세트 코드(예: SMP-PK1), 카드 이름이나 번호(예: 084)로 찾을 수 있어요.</p>}
      {q && total === 0 && (
        <EmptyState title={`‘${q}’에 맞는 결과가 없어요.`} hint="세트 코드나 카드 번호로 다시 찾아보세요." actions={<><CLink to="/shop" className="btn btn-primary">샵 전체 보기</CLink><CLink to="/sets" className="btn btn-secondary">카드 도감</CLink></>} />
      )}
      {q && total > 0 && (
        <div className="search-results">
          <p className="search-summary" aria-live="polite">‘{q}’ 결과 {total}개 — 상품 {r.products.length} · 세트 {r.sets.length} · 카드 {r.printings.length} · 이야기 {r.stories.length}</p>
          {r.products.length > 0 && (
            <section className="search-group"><h2>상품</h2><div className="product-grid">{r.products.map((p) => <ProductTile key={p.id} product={p} />)}</div></section>
          )}
          {r.sets.length > 0 && (
            <section className="search-group"><h2>세트</h2>
              <ul className="set-list">{r.sets.map((s) => (
                <li key={s.id}><CLink to={`/sets/${s.id}`} className="set-list-item"><span className="mono">{s.code}</span><strong>{s.name}</strong><span>{GAME_LABEL[s.game]} · {LANGUAGE_LABEL[s.language]}</span></CLink></li>
              ))}</ul>
            </section>
          )}
          {r.printings.length > 0 && (
            <section className="search-group"><h2>카드 <small className="muted">판본별로 구분</small></h2><div className="card-grid card-grid-sm">{r.printings.map((p) => <CardTile key={p.id} printing={p} size="sm" />)}</div></section>
          )}
          {r.stories.length > 0 && (
            <section className="search-group"><h2>이야기</h2><ul className="story-list">{r.stories.map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`}><span className="kicker">{s.kicker}</span><strong>{s.title}</strong></CLink></li>)}</ul></section>
          )}
        </div>
      )}
    </main>
  );
}
