import { useConcept, CLink } from './concept';
import { CURATION, PRODUCTS, SETS, STORIES, filterProducts, hitCards, productById, setById, shortDate, printingsBySet, productsForSet, printingById } from '@/data/repo';
import { GAME_LABEL, LANGUAGE_LABEL } from '@/data/types';
import { ProductTile } from '@/ui/ProductTile';
import { CardTile } from '@/ui/CardTile';
import { CardImage, OddlyMark, ProductImage } from '@/ui/Placeholder';
import { SearchBox } from '@/ui/Header';
import { Section } from '@/ui/Section';
import { cardById } from '@/data/repo';
import { PriceSummary } from '@/ui/PriceSummary';

const QUICK = [
  { to: '/shop?game=pokemon', label: '포켓몬' },
  { to: '/shop?game=onepiece', label: '원피스' },
  { to: '/shop?game=riftbound', label: '리프트바운드' },
  { to: '/shop?category=supply', label: '카드 용품' },
];

function CurationItem({ id, big }: { id: string; big?: boolean }) {
  const f = CURATION.find((c) => c.id === id)!;
  if (f.ref.kind === 'set') {
    const s = setById(f.ref.id)!;
    return (
      <CLink to={`/sets/${s.id}`} className={`curation-item ${big ? 'is-big' : ''}`}>
        <div className="curation-media">
          {printingsBySet(s.id).filter((p) => p.editorialReason).slice(0, big ? 3 : 1).map((p) => <CardImage key={p.id} tone={p.tone} number={p.number} name={cardById(p.cardId)!.name} hasImage={p.hasImage} />)}
        </div>
        <div className="curation-body">
          <p className="kicker">세트 · {s.code} · {LANGUAGE_LABEL[s.language]}</p>
          <h3>{f.title}</h3>
          <p className="curation-reason">{f.reason}</p>
          <span className="curation-more">{s.name} 도감 보기 →</span>
        </div>
      </CLink>
    );
  }
  const p = productById(f.ref.id)!;
  return (
    <CLink to={`/products/${p.slug}`} className={`curation-item ${big ? 'is-big' : ''}`}>
      <div className="curation-media"><ProductImage tone={p.imageTone} category={p.category} /></div>
      <div className="curation-body">
        <p className="kicker">상품 · {GAME_LABEL[p.game!] ?? '카드 용품'}</p>
        <h3>{f.title}</h3>
        <p className="curation-reason">{f.reason}</p>
        <span className="curation-more">{p.name} →</span>
      </div>
    </CLink>
  );
}

/* ================= A. 취향 편집숍 ================= */
function HomeA() {
  const hero = printingById('smp-pk1-ko-084')!;
  const heroCard = cardById(hero.cardId)!;
  const hits = hitCards('smp-pk1-ko', 'editorial').slice(0, 4);
  const products = filterProducts({ sort: 'editorial' }).slice(0, 8);
  return (
    <main className="home home-a">
      <section className="hero-a" aria-label="소개">
        <div className="hero-a-text">
          <p className="hero-kicker">카드 팩·박스 · 카드 용품 · 카드 도감</p>
          <h1 className="hero-title">좋아하는 거,<br />같이 보자.</h1>
          <p className="hero-lead">구경하고, 알아보고, 소장하는 곳. 세트 안에 어떤 카드가 있는지부터 함께 들여다봐요.</p>
          <div className="hero-ctas">
            <CLink to="/sets/smp-pk1-ko" className="btn btn-primary btn-lg">카드부터 구경하기</CLink>
            <CLink to="/shop?category=box" className="btn btn-secondary btn-lg">팩·박스 보기</CLink>
          </div>
        </div>
        <CLink to={`/cards/${hero.id}`} className="hero-a-frame" aria-label={`${heroCard.name} ${hero.number} 카드 상세`}>
          <CardImage tone={hero.tone} number={hero.number} name={heroCard.name} hasImage className="hero-a-card" big />
          <OddlyMark size={120} gaze="right" mood="curious" className="hero-a-mark" />
          <span className="hero-a-caption"><span className="kicker">이 한 장을 눈여겨본 이유</span>{hero.editorialReason}</span>
        </CLink>
      </section>
      <nav className="quick-a" aria-label="빠른 진입">
        {QUICK.map((q) => <CLink key={q.to} to={q.to}>{q.label}</CLink>)}
      </nav>
      <Section id="curation" kicker="현재 큐레이션" title="이번 주에 들여다보는 것들" more={{ to: '/sets', label: '카드 도감' }}>
        <div className="curation-grid-a">
          <CurationItem id="c1" big />
          <CurationItem id="c3" />
          <CurationItem id="c2" />
        </div>
      </Section>
      <Section id="hits" kicker="이번에 눈여겨볼 카드" title="같은 세트의 서로 다른 매력" lead="고가 카드만 크게 띄우지 않고 아트·인기 캐릭터·특수 가공·입문 추천을 구분해 골랐어요." more={{ to: '/sets/smp-pk1-ko#hits', label: '숲의 빛 힛카드 전체' }}>
        <div className="card-grid card-grid-md">{hits.map((p) => <CardTile key={p.id} printing={p} showReason />)}</div>
      </Section>
      <Section id="products" kicker="판매 상품" title="지금 살 수 있는 것" more={{ to: '/shop', label: '샵 전체' }}>
        <div className="product-grid">{products.map((p) => <ProductTile key={p.id} product={p} />)}</div>
      </Section>
      <Section id="stories" kicker="이야기" title="한 장을 오래 좋아하는 방법" more={{ to: '/stories', label: '이야기 전체' }}>
        <ul className="story-cards story-cards-a">
          {STORIES.map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`} className="story-card"><span className="kicker">{s.kicker}</span><strong>{s.title}</strong><p>{s.excerpt}</p></CLink></li>)}
        </ul>
      </Section>
    </main>
  );
}

/* ================= B. 컬렉터 아카이브 ================= */
function HomeB() {
  const hits = hitCards('smp-pk1-ko', 'editorial');
  const newest = filterProducts({ sort: 'newest' }).slice(0, 4);
  return (
    <main className="home home-b">
      <section className="hero-b" aria-label="검색">
        <div className="hero-b-text">
          <h1 className="hero-title">찾는 카드가 어느 세트에, 어떤 판본으로 있는지.</h1>
          <p className="hero-lead">세트 코드·카드 번호·이름으로 바로 찾기. 판매가 끝난 세트도 도감으로 남아요.</p>
        </div>
        <div className="hero-b-search">
          <SearchBox size="lg" placeholder="세트 코드(SMP-PK1) · 카드 번호(084) · 카드 이름" />
          <div className="hero-b-hints">
            <span className="muted">빠른 진입</span>
            {QUICK.map((q) => <CLink key={q.to} to={q.to} className="chip">{q.label}</CLink>)}
          </div>
        </div>
        <OddlyMark size={64} mood="listen" gaze="left" className="hero-b-mark" />
      </section>
      <Section id="sets" kicker="세트 색인" title="세트별 수록 카드" more={{ to: '/sets', label: '전체 색인' }}>
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
                <td>{s.totalCards ?? <span className="muted">미확인</span>}</td>
                <td>{productsForSet(s.id).length > 0 ? `${productsForSet(s.id).length}개` : <span className="muted">없음</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <div className="two-col-b">
        <Section id="hits" kicker="카드 탐색" title="숲의 빛 · 편집 추천 카드" lead="기준: 편집 추천. 공식 레어도·가격 상위 기준은 세트 상세에서 전환할 수 있어요." more={{ to: '/sets/smp-pk1-ko#hits', label: '세트에서 보기' }}>
          <table className="data-table cards-table">
            <thead><tr><th>번호</th><th>카드</th><th>레어도</th><th>아트</th><th>참고 시세(샘플)</th></tr></thead>
            <tbody>
              {hits.map((p) => (
                <tr key={p.id}>
                  <td className="mono">{p.number}</td>
                  <td><CLink to={`/cards/${p.id}`} className="cards-table-name"><CardImage tone={p.tone} number={p.number} name={cardById(p.cardId)!.name} hasImage={p.hasImage} className="thumb" /><strong>{cardById(p.cardId)!.name}</strong></CLink></td>
                  <td><span className={`rarity rarity-${p.rarity}`}>{p.rarity}</span></td>
                  <td>{p.artVersion === 'regular' ? '일반' : p.artVersion === 'alt' ? '얼터' : p.artVersion === 'full' ? '풀아트' : '패러렐'}</td>
                  <td><PriceSummary printingId={p.id} compact /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section id="new" kicker="신규 등록" title="최근 등록된 상품">
          <ul className="compact-list">
            {newest.map((p) => (
              <li key={p.id}><ProductTile product={p} dense showSet /></li>
            ))}
          </ul>
        </Section>
      </div>
      <Section id="products" kicker="판매 상품" title={`전체 상품 ${PRODUCTS.length}개`} more={{ to: '/shop', label: '필터로 좁히기' }}>
        <div className="product-grid is-dense">{filterProducts({}).map((p) => <ProductTile key={p.id} product={p} dense showSet />)}</div>
      </Section>
      <Section id="stories" kicker="이야기" title="입문 가이드와 카드 이야기" more={{ to: '/stories', label: '전체' }}>
        <ul className="story-list">{STORIES.map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`}><span className="kicker">{s.kicker}</span><strong>{s.title}</strong><span className="muted small">{shortDate(s.publishedAt)}</span></CLink></li>)}</ul>
      </Section>
    </main>
  );
}

/* ================= C. 플레이풀 쇼룸 ================= */
function HomeC() {
  const showcase = ['p-pk1-box-ko', 'p-op1-box-ko', 'p-rb1-pack-en'].map((id) => productById(id)!);
  const hits = hitCards('smp-pk1-ko', 'editorial');
  const rest = filterProducts({ sort: 'editorial' }).filter((p) => !showcase.includes(p)).slice(0, 8);
  return (
    <main className="home home-c">
      <section className="hero-c" aria-label="소개">
        <div className="hero-c-scene">
          <h1 className="hero-c-title"><span>좋아하는 거,</span><span>같이 보자.</span></h1>
          <div className="hero-c-stage">
            <CLink to="/products/pokemon-forest-light-booster-box-ko" className="hero-c-product" aria-label="숲의 빛 부스터 박스 상품 보기"><ProductImage tone="green" category="box" /></CLink>
            <OddlyMark size={300} gaze="left" mood="happy" className="hero-c-mark" />
          </div>
        </div>
        <div className="hero-c-bar">
          <p className="hero-lead">카드 팩·박스, 카드 용품, 그리고 세트 안의 모든 카드. 구경만 해도 괜찮아요.</p>
          <div className="hero-ctas">
            <CLink to="/shop" className="btn btn-primary btn-lg">팩·박스 보기</CLink>
            <CLink to="/sets" className="btn btn-secondary btn-lg">카드 도감</CLink>
          </div>
        </div>
      </section>
      <nav className="quick-c" aria-label="빠른 진입">
        {QUICK.map((q, i) => <CLink key={q.to} to={q.to} className={`quick-c-tile tile-${i}`}><span>{q.label}</span><small>{i < 3 ? '팩 · 박스' : '슬리브 · 탑로더 · 바인더'}</small></CLink>)}
      </nav>
      <Section id="showcase" kicker="지금의 진열" title="처음 고르는 박스라면" more={{ to: '/shop?category=box', label: '박스 전체' }}>
        <div className="showcase-c">
          {showcase.map((p, i) => (
            <div key={p.id} className={`showcase-c-item item-${i}`}>
              <ProductTile product={p} />
            </div>
          ))}
        </div>
      </Section>
      <Section id="hits" kicker="눈여겨볼 카드" title="이 세트에는 어떤 카드가 있을까?" lead="숲의 빛 SMP-PK1 · 편집 추천" more={{ to: '/sets/smp-pk1-ko', label: '도감 전체' }}>
        <div className="strip-c" role="list" aria-label="눈여겨볼 카드 목록 (가로 스크롤)">
          {hits.map((p) => <div role="listitem" key={p.id} className="strip-c-item"><CardTile printing={p} size="lg" showReason /></div>)}
        </div>
      </Section>
      <Section id="products" kicker="판매 상품" title="그 밖의 상품" more={{ to: '/shop', label: '샵 전체' }}>
        <div className="product-grid">{rest.map((p) => <ProductTile key={p.id} product={p} />)}</div>
      </Section>
      <Section id="stories" kicker="이야기" title="같이 알아가기" more={{ to: '/stories', label: '전체' }}>
        <ul className="story-cards">{STORIES.slice(0, 2).map((s) => <li key={s.slug}><CLink to={`/stories/${s.slug}`} className="story-card"><span className="kicker">{s.kicker}</span><strong>{s.title}</strong><p>{s.excerpt}</p></CLink></li>)}</ul>
      </Section>
    </main>
  );
}

export function HomePage() {
  const c = useConcept();
  return c === 'a' ? <HomeA /> : c === 'b' ? <HomeB /> : <HomeC />;
}
