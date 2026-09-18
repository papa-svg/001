import { useParams } from 'react-router';
import { SETS, STORIES, storyBySlug, setById, productById, printingsBySet, shortDate, productsForSet } from '@/data/repo';
import { GAME_LABEL, LANGUAGE_LABEL } from '@/data/types';
import { CLink, useConcept } from '@/concepts/concept';
import { EmptyState } from '@/ui/States';
import { ProductTile } from '@/ui/ProductTile';
import { CardTile } from '@/ui/CardTile';
import { useSaved } from '@/state/saved';
import { printingById } from '@/data/repo';
import { OddlyMark } from '@/ui/Placeholder';
import { Badge } from '@/ui/Badge';

export function SetsPage() {
  const c = useConcept();
  return (
    <main className="page sets-page">
      <header className="page-head"><h1 className="page-title">카드 도감</h1><p className="page-lead">세트별 수록 카드와 눈여겨볼 카드. 판매가 끝난 세트도 도감으로 남아요.</p></header>
      {c === 'b' ? (
        <table className="data-table sets-table">
          <thead><tr><th>코드</th><th>세트</th><th>게임</th><th>언어</th><th>발매</th><th>수록</th><th>판매 상품</th></tr></thead>
          <tbody>
            {SETS.map((s) => (
              <tr key={s.id}>
                <td className="mono">{s.code}</td>
                <td><CLink to={`/sets/${s.id}`}><strong>{s.name}</strong></CLink></td>
                <td>{GAME_LABEL[s.game]}</td>
                <td>{LANGUAGE_LABEL[s.language]}</td>
                <td>{shortDate(s.releaseDate)}</td>
                <td>{s.totalCards ?? <span className="muted">미확인</span>} <span className="muted">/ 등록 {printingsBySet(s.id).length}</span></td>
                <td>{productsForSet(s.id).length}개</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="set-cards">
          {SETS.map((s) => (
            <li key={s.id}>
              <CLink to={`/sets/${s.id}`} className="set-card">
                <span className="set-card-code mono">{s.code} · {LANGUAGE_LABEL[s.language]}</span>
                <strong className="set-card-name">{s.name}</strong>
                <span className="set-card-meta">{GAME_LABEL[s.game]} · 발매 {shortDate(s.releaseDate)} · 수록 {s.totalCards ?? '미확인'}종</span>
                <span className="set-card-more">이 세트에는 어떤 카드가 있을까? →</span>
              </CLink>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export function StoriesPage() {
  return (
    <main className="page stories-page">
      <header className="page-head"><h1 className="page-title">이야기</h1><p className="page-lead">입문 가이드, 카드 이야기, 보관 팁. 라이브 편성은 확정된 회차가 있을 때만 여기에 표시돼요.</p></header>
      <ul className="story-cards">
        {STORIES.map((s) => (
          <li key={s.slug}><CLink to={`/stories/${s.slug}`} className="story-card"><span className="kicker">{s.kicker}</span><strong>{s.title}</strong><p>{s.excerpt}</p><span className="muted small">{shortDate(s.publishedAt)}</span></CLink></li>
        ))}
      </ul>
      <section className="section">
        <h2 className="section-title">라이브</h2>
        <EmptyState title="예정된 방송이 아직 없어요." hint="편성이 확정되면 프로그램·시간·다시보기가 여기에 표시됩니다. 실제 송출은 외부 채널에서 진행합니다." />
      </section>
    </main>
  );
}

export function StoryDetailPage() {
  const { slug } = useParams();
  const s = slug ? storyBySlug(slug) : undefined;
  if (!s) return <main className="page"><EmptyState title="이야기를 찾을 수 없어요." actions={<CLink to="/stories" className="btn btn-primary">이야기 목록</CLink>} /></main>;
  return (
    <main className="page story-detail">
      <article>
        <p className="kicker">{s.kicker} · {shortDate(s.publishedAt)} <Badge tone="demo">샘플 콘텐츠</Badge></p>
        <h1 className="page-title">{s.title}</h1>
        <p className="story-lead">{s.excerpt}</p>
        <p className="muted">본문은 3단계에서 실제 콘텐츠로 채웁니다. 이 페이지는 이야기 → 세트/상품으로 이어지는 연결 구조를 보여주기 위한 자리입니다.</p>
      </article>
      {s.relatedSetIds.length > 0 && (
        <section className="section"><h2 className="section-title">관련 세트</h2><ul className="set-list">{s.relatedSetIds.map((id) => { const set = setById(id)!; return <li key={id}><CLink to={`/sets/${id}`} className="set-list-item"><span className="mono">{set.code}</span><strong>{set.name}</strong><span>{GAME_LABEL[set.game]} · {LANGUAGE_LABEL[set.language]}</span></CLink></li>; })}</ul></section>
      )}
      {s.relatedProductIds.length > 0 && (
        <section className="section"><h2 className="section-title">관련 상품</h2><div className="product-grid">{s.relatedProductIds.map((id) => productById(id)).filter(Boolean).map((p) => <ProductTile key={p!.id} product={p!} />)}</div></section>
      )}
    </main>
  );
}

export function SavedPage() {
  const { items } = useSaved();
  const products = items.filter((i) => i.kind === 'product').map((i) => productById(i.id)).filter(Boolean);
  const sets = items.filter((i) => i.kind === 'set').map((i) => setById(i.id)).filter(Boolean);
  const printings = items.filter((i) => i.kind === 'printing').map((i) => printingById(i.id)).filter(Boolean);
  return (
    <main className="page saved-page">
      <header className="page-head"><h1 className="page-title">저장 목록</h1><p className="page-lead muted">이 브라우저에만 저장돼요. 계정 연결 후 기기 간 동기화를 제공할 예정입니다.</p></header>
      {items.length === 0 && <EmptyState title="아직 저장한 것이 없어요." hint="상품·세트·카드의 저장 버튼을 누르면 여기에 모여요." actions={<><CLink to="/shop" className="btn btn-primary">샵 보기</CLink><CLink to="/sets" className="btn btn-secondary">카드 도감</CLink></>} />}
      {products.length > 0 && <section className="section"><h2 className="section-title">상품 {products.length}</h2><div className="product-grid">{products.map((p) => <ProductTile key={p!.id} product={p!} />)}</div></section>}
      {sets.length > 0 && <section className="section"><h2 className="section-title">세트 {sets.length}</h2><ul className="set-list">{sets.map((s) => <li key={s!.id}><CLink to={`/sets/${s!.id}`} className="set-list-item"><span className="mono">{s!.code}</span><strong>{s!.name}</strong><span>{GAME_LABEL[s!.game]} · {LANGUAGE_LABEL[s!.language]}</span></CLink></li>)}</ul></section>}
      {printings.length > 0 && <section className="section"><h2 className="section-title">카드 {printings.length}</h2><div className="card-grid card-grid-sm">{printings.map((p) => <CardTile key={p!.id} printing={p!} size="sm" />)}</div></section>}
    </main>
  );
}

export function MarketSoonPage() {
  return (
    <main className="page">
      <header className="page-head"><h1 className="page-title">시세</h1></header>
      <EmptyState title="시세 화면은 준비 중이에요." hint="별도로 구축 중인 카드 시세 DB가 연결되면 최근 오른 카드·거래량·플랫폼별 비교를 제공합니다. 지금은 세트 상세와 카드 상세에서 샘플 시세 요약을 볼 수 있어요." actions={<CLink to="/sets/smp-pk1-ko" className="btn btn-primary">샘플 세트에서 시세 요약 보기</CLink>} />
    </main>
  );
}

export function LivePage() {
  return (
    <main className="page">
      <header className="page-head"><h1 className="page-title">라이브 안내</h1></header>
      <EmptyState title="확정된 편성이 아직 없어요." hint="프로그램·시간대·진행자 정보는 편성이 확정되면 표시됩니다. 방송은 외부 채널에서 진행되고, 이 페이지는 일정·이동 링크·다시보기를 안내합니다." />
    </main>
  );
}

export function AboutPage() {
  const c = useConcept();
  return (
    <main className="page about-page">
      <header className="page-head about-head">
        <div>
          <p className="kicker">ODDLYS · 오들리즈</p>
          <h1 className="page-title">좋아하는 것에 푹 빠진 사람들이 모여, 각자의 취향을 이야기하고 함께 즐기는 브랜드.</h1>
        </div>
        {c !== 'b' && <OddlyMark size={c === 'c' ? 220 : 140} mood="happy" gaze="left" />}
      </header>
      <dl className="facts about-facts">
        <dt>Purpose</dt><dd>좋아하는 것을 서로 나누고 함께 알아가며, 취미의 즐거움을 더 크게 만든다.</dd>
        <dt>Vision</dt><dd>좋아하는 것을 함께 즐기고 싶을 때, 가장 먼저 떠오르는 브랜드가 된다.</dd>
        <dt>Mission</dt><dd>좋아하는 이야기를 나눌 자리를 만들고, 함께 알아가고 즐길 콘텐츠·상품·경험을 선보인다.</dd>
      </dl>
    </main>
  );
}

export function HelpPage() {
  return (
    <main className="page">
      <header className="page-head"><h1 className="page-title">배송 · 교환/반품 · 문의</h1></header>
      <p className="page-lead">배송비·무료배송 기준·교환/반품 조건·사업자 정보는 운영 정책이 확정되면 여기에 정확히 표시합니다. 프리뷰에서는 임의로 생성하지 않습니다.</p>
      <p className="muted">현재 장바구니에 표시되는 배송 정책은 ‘샘플 배송 정책’으로 표시된 임시값입니다.</p>
    </main>
  );
}

export function NotFoundPage() {
  return <main className="page"><EmptyState title="페이지를 찾을 수 없어요." actions={<CLink to="/" className="btn btn-primary">홈으로</CLink>} /></main>;
}
