import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { setById, productsForSet, hitCards, filterPrintings, printingsBySet, cardById, shortDate, STORIES, productById, priceSummary, money, type HitCriteria } from '@/data/repo';
import { GAME_LABEL, LANGUAGE_LABEL, RARITY_LABEL, type Rarity, type ArtVersion, type Product } from '@/data/types';
import { ProductTile } from '@/ui/ProductTile';
import { CardTile, ART_LABEL, FINISH_LABEL } from '@/ui/CardTile';
import { CardImage, OddlyMark } from '@/ui/Placeholder';
import { PriceSummary } from '@/ui/PriceSummary';
import { SaveButton } from '@/ui/SaveButton';
import { EmptyState } from '@/ui/States';
import { Badge } from '@/ui/Badge';
import { CLink, useConcept } from './concept';

const CRITERIA: { id: HitCriteria; label: string; hint: string }[] = [
  { id: 'editorial', label: '편집 추천', hint: '그림·캐릭터·가공·이야기 등 선정 이유가 있는 카드' },
  { id: 'rarity', label: '공식 레어도', hint: '제조사의 해당 판본 레어도 분류 기준(샘플)' },
  { id: 'price', label: '가격 상위', hint: '검증된 매칭·표본 충족·최신 데이터가 있는 카드만, 실거래 중앙값 기준(샘플)' },
];

const SUBNAV = [
  { id: 'intro', label: '소개' },
  { id: 'products', label: '판매 상품' },
  { id: 'hits', label: '눈여겨볼 카드' },
  { id: 'cards', label: '전체 카드' },
  { id: 'more', label: '더 알아보기' },
];

export function SetDetailPage() {
  const { setId } = useParams();
  const set = setId ? setById(setId) : undefined;
  const c = useConcept();
  const [sp, setSp] = useSearchParams();
  const [criteria, setCriteria] = useState<HitCriteria>('editorial');
  const view = (sp.get('view') as 'grid' | 'table' | null) ?? (c === 'b' ? 'grid' : 'grid');
  const cardFilters = { q: sp.get('cq') ?? '', rarity: (sp.get('rarity') as Rarity | 'all') ?? 'all', art: (sp.get('art') as ArtVersion | 'all') ?? 'all', type: sp.get('type') ?? 'all' };
  const setParam = (k: string, v: string) => { const n = new URLSearchParams(sp); if (v && v !== 'all') n.set(k, v); else n.delete(k); setSp(n, { replace: true }); };

  if (!set) return <main className="page"><EmptyState title="세트를 찾을 수 없어요." actions={<CLink to="/sets" className="btn btn-primary">카드 도감</CLink>} /></main>;
  const all = printingsBySet(set.id);
  const list = filterPrintings(set.id, cardFilters);
  const products = productsForSet(set.id);
  const hits = hitCards(set.id, criteria);
  const hero = hitCards(set.id, 'editorial')[0] ?? all[0];
  const types = [...new Set(all.map((p) => cardById(p.cardId)!.type))];
  const rarities = [...new Set(all.map((p) => p.rarity))];
  const stories = STORIES.filter((s) => s.relatedSetIds.includes(set.id));
  const supplies = ['p-sleeve-std', 'p-binder-9'].map((id) => productById(id)).filter((p): p is Product => !!p);
  const cardFilterCount = [cardFilters.rarity !== 'all', cardFilters.art !== 'all', cardFilters.type !== 'all', !!cardFilters.q].filter(Boolean).length;

  return (
    <main className={`page set-page set-page-${c}`}>
      <nav className="breadcrumb" aria-label="경로"><CLink to="/sets">카드 도감</CLink> / <span>{GAME_LABEL[set.game]}</span> / <span>{set.name}</span></nav>

      {/* ---------- 세트 헤더 ---------- */}
      <header className="set-header" id="intro">
        <div className="set-header-text">
          <p className="kicker">{GAME_LABEL[set.game]} · <span className="mono">{set.code}</span> · {LANGUAGE_LABEL[set.language]} ({set.region}) <Badge tone="demo">샘플 세트</Badge></p>
          <h1 className="set-title">{set.name}</h1>
          <dl className="set-facts">
            <div><dt>발매</dt><dd>{shortDate(set.releaseDate)}</dd></div>
            <div><dt>수록</dt><dd>{set.totalCards ?? <span className="muted">미확인</span>}종</dd></div>
            <div><dt>팩당 카드</dt><dd>{set.cardsPerPack ?? <span className="muted">미확인</span>}{set.cardsPerPack && '장'}</dd></div>
            <div><dt>박스당 팩</dt><dd>{set.packsPerBox ?? <span className="muted">미확인</span>}{set.packsPerBox && '개'}</dd></div>
          </dl>
          <div className="set-header-actions">
            <SaveButton kind="set" id={set.id} label="세트 저장" />
            {products.length > 0 && <a href="#products" className="btn btn-secondary">판매 상품 {products.length}</a>}
          </div>
        </div>
        {c !== 'b' && hero && (
          <CLink to={`/cards/${hero.id}`} className={`set-hero-frame set-hero-frame-${c}`} aria-label={`${cardById(hero.cardId)!.name} ${hero.number} 카드 상세`}>
            <CardImage tone={hero.tone} number={hero.number} name={cardById(hero.cardId)!.name} hasImage={hero.hasImage} big className="set-hero-card" />
            <OddlyMark size={c === 'c' ? 200 : 96} gaze="left" mood="curious" className="set-hero-mark" />
            {c === 'a' && hero.editorialReason && <span className="set-hero-caption"><span className="kicker">이 한 장을 눈여겨본 이유</span>{hero.editorialReason}</span>}
          </CLink>
        )}
        {c === 'b' && (
          <div className="set-header-side-b">
            <ul className="feature-list">{set.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <p className="muted small">{set.artNotes}</p>
          </div>
        )}
      </header>

      <nav className={`set-subnav ${c === 'b' ? 'is-sticky' : ''}`} aria-label="페이지 안 이동">
        <div className="set-subnav-scroll">{SUBNAV.filter((s) => s.id !== 'products' || products.length > 0).map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}</div>
      </nav>

      {c !== 'b' && (
        <section className="set-intro">
          <ul className="feature-list">{set.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
          <p className="set-artnotes"><strong>아트·가공</strong> {set.artNotes}</p>
        </section>
      )}

      {/* ---------- 판매 상품 ---------- */}
      <section id="products" className="section" aria-labelledby="products-title">
        <header className="section-head"><div><p className="section-kicker">어떤 단위로 살 수 있을까</p><h2 id="products-title" className="section-title">이 세트의 판매 상품</h2></div></header>
        {products.length === 0 ? (
          <EmptyState title="현재 판매 중인 상품이 없어요." hint="세트와 카드 정보는 계속 볼 수 있어요. 상품이 등록되면 여기에 표시됩니다." actions={<CLink to="/shop" className="btn btn-secondary">다른 상품 보기</CLink>} />
        ) : (
          <div className={`product-grid ${c === 'b' ? 'is-dense' : ''}`}>{products.map((p) => <ProductTile key={p.id} product={p} dense={c === 'b'} />)}</div>
        )}
      </section>

      {/* ---------- 힛카드 ---------- */}
      <section id="hits" className="section set-hits" aria-labelledby="hits-title">
        <header className="section-head">
          <div><p className="section-kicker">어떤 카드들이 관심을 받을까</p><h2 id="hits-title" className="section-title">눈여겨볼 카드</h2></div>
          <div className="criteria-tabs" role="tablist" aria-label="선정 기준">
            {CRITERIA.map((cr) => <button key={cr.id} role="tab" aria-selected={criteria === cr.id} className={`tab ${criteria === cr.id ? 'is-on' : ''}`} onClick={() => setCriteria(cr.id)}>{cr.label}</button>)}
          </div>
        </header>
        <p className="criteria-hint muted">{CRITERIA.find((x) => x.id === criteria)!.hint}. 봉입 확률·박스당 확정 힛 수·기대수익은 제공하지 않아요.</p>
        {hits.length === 0 ? (
          <EmptyState title="이 기준으로 보여줄 카드가 아직 없어요." hint={criteria === 'price' ? '표본이 충족되고 매칭이 확인된 가격 데이터가 있는 카드만 순위에 넣어요.' : undefined} />
        ) : c === 'b' ? (
          <table className="data-table cards-table">
            <thead><tr><th>번호</th><th>카드</th><th>레어도</th><th>아트 · 가공</th><th>참고 시세(샘플)</th>{criteria === 'editorial' && <th>선정 이유</th>}</tr></thead>
            <tbody>{hits.map((p) => (
              <tr key={p.id}>
                <td className="mono">{p.number}</td>
                <td><CLink to={`/cards/${p.id}`} className="cards-table-name"><CardImage tone={p.tone} number={p.number} name={cardById(p.cardId)!.name} hasImage={p.hasImage} className="thumb" /><strong>{cardById(p.cardId)!.name}</strong></CLink></td>
                <td><span className={`rarity rarity-${p.rarity}`}>{p.rarity}</span> {RARITY_LABEL[p.rarity]}</td>
                <td>{ART_LABEL[p.artVersion]} · {FINISH_LABEL[p.finish]}</td>
                <td><PriceSummary printingId={p.id} compact /></td>
                {criteria === 'editorial' && <td className="reason-cell">{p.editorialTag && <span className="tag">{p.editorialTag}</span>}{p.editorialReason}</td>}
              </tr>
            ))}</tbody>
          </table>
        ) : c === 'c' ? (
          <div className="strip-c" role="list" aria-label="눈여겨볼 카드 (가로 스크롤)">
            {hits.map((p) => <div key={p.id} role="listitem" className="strip-c-item"><CardTile printing={p} size="lg" showReason={criteria === 'editorial'} />{criteria === 'price' && <PriceSummary printingId={p.id} compact />}</div>)}
          </div>
        ) : (
          <div className="hits-a">
            {hits.map((p) => (
              <article key={p.id} className="hit-a">
                <CardTile printing={p} size="md" showReason={criteria === 'editorial'} />
                <PriceSummary printingId={p.id} compact />
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ---------- 전체 카드 ---------- */}
      <section id="cards" className="section set-cards-section" aria-labelledby="cards-title">
        <header className="section-head">
          <div><p className="section-kicker">원하는 카드가 실제로 이 판본에 수록되는가</p><h2 id="cards-title" className="section-title">전체 카드 <small className="muted">{list.length} / {all.length}{set.totalCards && all.length < set.totalCards ? ` (전체 ${set.totalCards}종 중 일부 등록)` : ''}</small></h2></div>
          <div className="view-toggle" role="group" aria-label="보기 방식">
            <button type="button" className={`tab ${view === 'grid' ? 'is-on' : ''}`} aria-pressed={view === 'grid'} onClick={() => setParam('view', 'grid')}>이미지</button>
            <button type="button" className={`tab ${view === 'table' ? 'is-on' : ''}`} aria-pressed={view === 'table'} onClick={() => setParam('view', 'table')}>표 (가격 포함)</button>
          </div>
        </header>
        <div className="card-filters">
          <label className="card-filter-search"><span className="sr-only">번호 또는 이름</span><input type="search" placeholder="번호 · 이름" value={cardFilters.q} onChange={(e) => setParam('cq', e.target.value)} /></label>
          <label><span className="sr-only">레어도</span><select value={cardFilters.rarity} onChange={(e) => setParam('rarity', e.target.value)}><option value="all">레어도 전체</option>{rarities.map((r) => <option key={r} value={r}>{r} · {RARITY_LABEL[r]}</option>)}</select></label>
          <label><span className="sr-only">아트 버전</span><select value={cardFilters.art} onChange={(e) => setParam('art', e.target.value)}><option value="all">아트 전체</option>{(['regular', 'alt', 'full', 'parallel'] as const).filter((a) => all.some((p) => p.artVersion === a)).map((a) => <option key={a} value={a}>{ART_LABEL[a]}</option>)}</select></label>
          <label><span className="sr-only">유형</span><select value={cardFilters.type} onChange={(e) => setParam('type', e.target.value)}><option value="all">유형 전체</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
          {cardFilterCount > 0 && <button type="button" className="link-btn" onClick={() => { const n = new URLSearchParams(sp); ['cq', 'rarity', 'art', 'type'].forEach((k) => n.delete(k)); setSp(n, { replace: true }); }}>필터 해제 ({cardFilterCount})</button>}
        </div>
        {list.length === 0 ? (
          <EmptyState title="조건에 맞는 카드가 없어요." hint="번호는 084처럼 세 자리로, 이름은 일부만 입력해도 찾을 수 있어요." actions={<button className="btn btn-primary" onClick={() => { const n = new URLSearchParams(sp); ['cq', 'rarity', 'art', 'type'].forEach((k) => n.delete(k)); setSp(n, { replace: true }); }}>필터 해제</button>} />
        ) : view === 'table' ? (
          <CardTable list={list} />
        ) : (
          <div className={`card-grid ${c === 'b' ? 'card-grid-xs' : c === 'c' ? 'card-grid-md' : 'card-grid-sm'}`}>{list.map((p) => <CardTile key={p.id} printing={p} size={c === 'c' ? 'md' : 'sm'} />)}</div>
        )}
      </section>

      {/* ---------- 더 알아보기 ---------- */}
      <section id="more" className="section" aria-labelledby="more-title">
        <header className="section-head"><div><p className="section-kicker">다음으로 무엇을 알아보면 좋을까</p><h2 id="more-title" className="section-title">입문 설명 · 관련 콘텐츠 · 용품</h2></div></header>
        <div className="more-grid">
          <div className="intro-box"><h3>처음이라면</h3><p>{set.intro}</p></div>
          <div>
            <h3>관련 이야기</h3>
            {stories.length === 0 ? <p className="muted">아직 이 세트를 다룬 이야기가 없어요.</p> : <ul className="story-list">{stories.map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`}><span className="kicker">{s.kicker}</span><strong>{s.title}</strong></CLink></li>)}</ul>}
          </div>
          <div>
            <h3>규격이 맞는 보호용품</h3>
            <div className="product-grid is-dense">{supplies.map((p) => <ProductTile key={p.id} product={p} dense />)}</div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CardTable({ list }: { list: ReturnType<typeof printingsBySet> }) {
  const rows = useMemo(() => list.map((p) => ({ p, card: cardById(p.cardId)!, s: priceSummary(p.id) })), [list]);
  return (
    <div className="table-scroll" role="region" aria-label="전체 카드 표 (가로 스크롤 가능)" tabIndex={0}>
      <table className="data-table cards-table cards-table-full">
        <thead><tr><th>번호</th><th>카드</th><th>레어도</th><th>유형</th><th>아트</th><th>가공</th><th>참고 시세(샘플)</th><th>상태</th></tr></thead>
        <tbody>
          {rows.map(({ p, card, s }) => (
            <tr key={p.id}>
              <td className="mono">{p.number}</td>
              <td><CLink to={`/cards/${p.id}`} className="cards-table-name"><CardImage tone={p.tone} number={p.number} name={card.name} hasImage={p.hasImage} className="thumb" /><strong>{card.name}</strong></CLink></td>
              <td><span className={`rarity rarity-${p.rarity}`}>{p.rarity}</span></td>
              <td>{card.type}</td>
              <td>{ART_LABEL[p.artVersion]}</td>
              <td>{FINISH_LABEL[p.finish]}</td>
              <td className="num">{s.headline ? <>{money(s.headline.amount, s.headline.currency)}{s.headline.convertedAmount != null && <small> ≈ {money(s.headline.convertedAmount, 'KRW')}</small>}</> : <span className="muted">—</span>}</td>
              <td>{s.reason ? <Badge tone={s.state === 'stale' ? 'warn' : 'neutral'}>{s.reason}</Badge> : s.headline ? <Badge tone="neutral">{s.headline.kind === 'sold' ? '실거래' : '호가'}</Badge> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
