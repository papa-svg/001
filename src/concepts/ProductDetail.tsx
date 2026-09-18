import { useParams } from 'react-router';
import { productBySlug, setById, hitCards, printingsBySet, productById, STORIES, shortDate, cardById } from '@/data/repo';
import { GAME_LABEL, LANGUAGE_LABEL } from '@/data/types';
import { BuyPanel, MobileBuyBar, useBuyState } from '@/ui/BuyPanel';
import { ProductImage, OddlyMark, CardImage } from '@/ui/Placeholder';
import { CardTile } from '@/ui/CardTile';
import { ProductTile } from '@/ui/ProductTile';
import { EmptyState } from '@/ui/States';
import { CLink, useConcept } from './concept';
import { Section } from '@/ui/Section';
import { PriceSummary } from '@/ui/PriceSummary';
import type { Product, CardSet } from '@/data/types';

function SetSummary({ set, product }: { set: CardSet; product: Product }) {
  const c = useConcept();
  const hits = hitCards(set.id, 'editorial').slice(0, c === 'b' ? 6 : 4);
  const total = printingsBySet(set.id).length;
  return (
    <Section id="set" kicker={`세트 · ${set.code}`} title={<>이 상품의 세트, <CLink to={`/sets/${set.id}`}>{set.name}</CLink></>} more={{ to: `/sets/${set.id}`, label: `전체 ${set.totalCards ?? total}종 보기` }}>
      {c === 'b' ? (
        <div className="set-summary-b">
          <table className="data-table facts-table">
            <tbody>
              <tr><th>세트 코드</th><td className="mono">{set.code}</td><th>언어 · 지역</th><td>{LANGUAGE_LABEL[set.language]} · {set.region}</td></tr>
              <tr><th>발매</th><td>{shortDate(set.releaseDate)}</td><th>수록</th><td>{set.totalCards ?? '미확인'}종 (등록 {total})</td></tr>
              <tr><th>팩당 카드</th><td>{set.cardsPerPack ?? <span className="muted">미확인</span>}장</td><th>박스당 팩</th><td>{set.packsPerBox ?? <span className="muted">미확인</span>}</td></tr>
            </tbody>
          </table>
          <table className="data-table cards-table">
            <thead><tr><th>번호</th><th>편집 추천 카드</th><th>레어도</th><th>참고 시세(샘플)</th></tr></thead>
            <tbody>{hits.map((p) => (
              <tr key={p.id}><td className="mono">{p.number}</td><td><CLink to={`/cards/${p.id}`} className="cards-table-name"><CardImage tone={p.tone} number={p.number} name={cardById(p.cardId)!.name} hasImage={p.hasImage} className="thumb" /><strong>{cardById(p.cardId)!.name}</strong></CLink></td><td><span className={`rarity rarity-${p.rarity}`}>{p.rarity}</span></td><td><PriceSummary printingId={p.id} compact /></td></tr>
            ))}</tbody>
          </table>
          <p className="muted small">이 상품({product.category === 'box' ? '박스' : '팩'})은 랜덤 구성이라 위 카드가 확정으로 들어 있지 않아요. 참고 시세는 단품 거래 기준 샘플입니다.</p>
        </div>
      ) : (
        <div className="set-summary">
          <div className="set-summary-text">
            <ul className="feature-list">{set.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
            <p className="muted small">랜덤 구성이라 아래 카드가 이 상품에 확정으로 들어 있지 않아요. 카드를 정확히 찾는다면 카드 상세에서 판본을 확인해 주세요.</p>
          </div>
          <div className={`card-grid ${c === 'c' ? 'card-grid-md' : 'card-grid-sm'}`}>{hits.map((p) => <CardTile key={p.id} printing={p} size={c === 'c' ? 'md' : 'sm'} showReason={c === 'a'} />)}</div>
        </div>
      )}
    </Section>
  );
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = slug ? productBySlug(slug) : undefined;
  const c = useConcept();
  if (!product) return <main className="page"><EmptyState title="상품을 찾을 수 없어요." actions={<CLink to="/shop" className="btn btn-primary">샵으로</CLink>} /></main>;
  return <ProductDetail product={product} concept={c} />;
}

function ProductDetail({ product, concept: c }: { product: Product; concept: 'a' | 'b' | 'c' }) {
  const state = useBuyState(product);
  const set = product.setIds[0] ? setById(product.setIds[0]) : undefined;
  const related = (product.relatedSupplyIds ?? []).map((id) => productById(id)).filter((p): p is Product => !!p);
  const stories = STORIES.filter((s) => s.relatedProductIds.includes(product.id) || (set && s.relatedSetIds.includes(set.id)));
  return (
    <main className={`page product-page product-page-${c}`}>
      <nav className="breadcrumb" aria-label="경로">
        <CLink to="/shop">샵</CLink> / <CLink to={`/shop?${product.game ? `game=${product.game}` : 'category=supply'}`}>{GAME_LABEL[product.game!] ?? '카드 용품'}</CLink> / <span>{product.name}</span>
      </nav>
      {c === 'c' && (
        <div className="product-hero-c">
          <ProductImage tone={product.imageTone} category={product.category} className="product-hero-c-img" />
          <OddlyMark size={180} gaze="left" mood="curious" className="product-hero-c-mark" />
          <p className="product-hero-c-kicker">{GAME_LABEL[product.game!] ?? '카드 용품'}{set && <> · {set.name}</>}</p>
        </div>
      )}
      <div className="product-layout">
        <div className="product-media">
          {c !== 'c' && <ProductImage tone={product.imageTone} category={product.category} className="product-media-img" />}
          <p className="muted small product-media-note">상품 이미지 자리표시자 · 실제 제품 사진으로 교체 예정. 카드 이미지와 팩/박스 이미지를 혼동하지 않도록 구분합니다.</p>
          {c === 'b' && (
            <table className="data-table facts-table product-facts-b">
              <tbody>
                <tr><th>카테고리</th><td>{product.category === 'pack' ? '팩' : product.category === 'box' ? '박스' : '카드 용품'}</td></tr>
                {set && <><tr><th>세트</th><td><CLink to={`/sets/${set.id}`}>{set.name} <span className="mono">{set.code}</span></CLink></td></tr><tr><th>발매</th><td>{shortDate(set.releaseDate)}</td></tr></>}
                {product.skus.map((s) => <tr key={s.id}><th>{product.skus.length > 1 ? s.label : '구성'}</th><td>{s.unit} · {s.contents ?? <span className="muted">미확인</span>}</td></tr>)}
                {product.specs?.map((s) => <tr key={s.label}><th>{s.label}</th><td>{s.value}</td></tr>)}
              </tbody>
            </table>
          )}
          {c !== 'b' && (
            <div className="product-desc">
              <h2>상품 설명</h2>
              {product.description.map((d, i) => <p key={i}>{d}</p>)}
              {product.specs && (
                <dl className="facts">{product.specs.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>
              )}
            </div>
          )}
        </div>
        <div className="product-buy">
          <BuyPanel product={product} state={state} variant={c === 'b' ? 'compact' : 'default'} />
        </div>
      </div>
      {c === 'b' && (
        <div className="product-desc product-desc-b">
          <h2>상품 설명</h2>
          {product.description.map((d, i) => <p key={i}>{d}</p>)}
        </div>
      )}
      {set && <SetSummary set={set} product={product} />}
      {stories.length > 0 && (
        <Section id="stories" kicker="관련 이야기" title={c === 'a' ? '이 상품을 둘러싼 이야기' : '관련 이야기'}>
          <ul className="story-cards">{stories.map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`} className="story-card"><span className="kicker">{s.kicker}</span><strong>{s.title}</strong><p>{s.excerpt}</p></CLink></li>)}</ul>
        </Section>
      )}
      {related.length > 0 && (
        <Section id="supplies" kicker="보관" title="한 장을 오래 좋아하는 방법" lead="이 상품의 카드(스탠다드 사이즈)에 맞는 보호용품.">
          <div className="product-grid">{related.map((p) => <ProductTile key={p.id} product={p} dense={c === 'b'} />)}</div>
        </Section>
      )}
      <MobileBuyBar product={product} state={state} />
    </main>
  );
}
