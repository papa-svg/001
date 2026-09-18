import { useParams } from 'react-router';
import { printingById, cardById, setById, productsForSet, printingsBySet } from '@/data/repo';
import { RARITY_LABEL, LANGUAGE_LABEL, GAME_LABEL } from '@/data/types';
import { CardImage } from '@/ui/Placeholder';
import { PriceSummary } from '@/ui/PriceSummary';
import { ProductTile } from '@/ui/ProductTile';
import { SaveButton } from '@/ui/SaveButton';
import { ART_LABEL, FINISH_LABEL } from '@/ui/CardTile';
import { EmptyState } from '@/ui/States';
import { CLink } from '@/concepts/concept';
import { Badge } from '@/ui/Badge';

/**
 * 개별 카드(판본) 상세 — 기본 정보 수준. 차트·플랫폼 비교는 시세 DB 연결 이후.
 * 싱글카드를 직접 판매하지 않으므로 '이 카드 구매' 버튼을 장바구니에 연결하지 않는다.
 */
export function CardDetailPage() {
  const { printingId } = useParams();
  const p = printingId ? printingById(printingId) : undefined;
  if (!p) return <main className="page"><EmptyState title="카드를 찾을 수 없어요." actions={<CLink to="/sets" className="btn btn-primary">카드 도감</CLink>} /></main>;
  const card = cardById(p.cardId)!;
  const set = setById(p.setId)!;
  const siblings = printingsBySet(p.setId).filter((x) => x.cardId === p.cardId && x.id !== p.id);
  const products = productsForSet(p.setId);
  return (
    <main className="page card-detail">
      <nav className="breadcrumb" aria-label="경로"><CLink to="/sets">카드 도감</CLink> / <CLink to={`/sets/${set.id}`}>{set.name}</CLink> / <span>{p.number}</span></nav>
      <div className="card-detail-layout">
        <div className="card-detail-media">
          <CardImage tone={p.tone} number={p.number} name={card.name} hasImage={p.hasImage} big />
          <p className="muted small">이미지 자리표시자 · 실제 카드 이미지는 사용 권한 확인 후 교체</p>
        </div>
        <div className="card-detail-info">
          <p className="kicker">{GAME_LABEL[card.game]} · {set.name} <span className="mono">{set.code}</span></p>
          <h1 className="card-detail-title">{card.name} <span className="mono card-detail-number">{p.number}</span></h1>
          <dl className="facts">
            <dt>세트</dt><dd><CLink to={`/sets/${set.id}`}>{set.name} ({set.code})</CLink></dd>
            <dt>언어</dt><dd>{LANGUAGE_LABEL[p.language]} · {set.region}</dd>
            <dt>레어도</dt><dd>{p.rarity} · {RARITY_LABEL[p.rarity]} <small className="muted">(제조사 분류 기준·샘플)</small></dd>
            <dt>아트 / 가공</dt><dd>{ART_LABEL[p.artVersion]} · {FINISH_LABEL[p.finish]}</dd>
            <dt>유형</dt><dd>{card.type}</dd>
          </dl>
          <SaveButton kind="printing" id={p.id} label="관심 카드 저장" />
          {p.editorialReason && (
            <div className="editorial-box">
              <p className="kicker">편집 추천 {p.editorialTag && <Badge tone="brand">{p.editorialTag}</Badge>}</p>
              <p>{p.editorialReason}</p>
            </div>
          )}
          <PriceSummary printingId={p.id} />
          <div className="card-detail-buy-note">
            <h2>이 카드를 갖고 싶다면</h2>
            <p><strong>단품 판매:</strong> ODDLYS는 아직 싱글카드를 판매하지 않아요. 참고 시세의 플랫폼에서 확인할 수 있어요.</p>
            <p><strong>이 카드가 수록된 세트 상품:</strong> 아래 팩·박스는 랜덤 구성이라 이 카드가 확정으로 들어 있지 않아요.</p>
          </div>
          {siblings.length > 0 && (
            <div className="siblings">
              <h2>같은 카드의 다른 판본</h2>
              <ul>{siblings.map((s) => <li key={s.id}><CLink to={`/cards/${s.id}`}><span className="mono">{s.number}</span> {ART_LABEL[s.artVersion]} · {s.rarity}</CLink></li>)}</ul>
            </div>
          )}
        </div>
      </div>
      {products.length > 0 && (
        <section className="section">
          <h2 className="section-title">이 카드가 수록될 수 있는 세트 상품 <small className="muted">확정 구성 아님</small></h2>
          <div className="product-grid">{products.map((pr) => <ProductTile key={pr.id} product={pr} />)}</div>
        </section>
      )}
    </main>
  );
}
