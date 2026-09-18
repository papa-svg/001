import { Link } from 'react-router';
import { CONCEPTS } from '@/concepts/concept';

const ROWS: { label: string; a: string; b: string; c: string }[] = [
  { label: '중심 인상', a: '구경하다가 더 알고 싶은, 감각 있는 취향 상점', b: '찾기 쉽고 오래 들여다볼 수 있는 도감', c: '오들리와 상품이 하나의 장면을 이루는 브랜드 공간' },
  { label: '홈 편집', a: '큰 한 장면 + 짧은 이야기 + 정돈된 상품 그리드', b: '검색·세트 색인·신규 등록과 카드 탐색이 먼저', c: '장면형 히어로 + 대담한 글자 + 짧은 제품 연출' },
  { label: '화면 질서', a: '여백과 밀도의 리듬, 비대칭 편집', b: '일정한 그리드, 정보 우선순위와 표 보기', c: '강한 비례 대비와 유쾌한 프레이밍' },
  { label: '캐릭터', a: '큐레이터처럼 포인트에 등장', b: '검색·설명·저장 등 필요한 지점에서 작게', c: '대표 장면에서 크게, 쇼핑 정보에서는 절제' },
  { label: '상품/세트 상세', a: '구매 정보와 카드 이야기를 균형 있게', b: '판본·수록 목록·시세 비교 접근이 가장 빠름', c: '상단은 매력적으로, 구매 영역은 안정적으로' },
  { label: '모션', a: '작은 열림·자리잡기·호버 반응', b: '거의 정적, 상태 변화만 명료하게', c: '제한된 장면 연출 1개와 짧은 반응' },
  { label: '주요 위험', a: '에디토리얼이 상품 접근을 늦출 수 있음', b: '데이터 사이트처럼 딱딱해질 수 있음', c: '무겁거나 어린이 브랜드처럼 보일 수 있음' },
];

const SCREENS = [
  { path: '', label: '홈' },
  { path: '/products/pokemon-forest-light-booster-box-ko', label: '상품 상세 (박스)' },
  { path: '/products/card-sleeve-standard-100', label: '상품 상세 (옵션 있는 용품)' },
  { path: '/sets/smp-pk1-ko', label: '세트 상세 · 힛카드 · 전체 카드' },
  { path: '/shop', label: '샵 · 필터' },
  { path: '/search?q=084', label: '검색 (카드 번호)' },
  { path: '/cart', label: '장바구니' },
];

export function CompareIndex() {
  return (
    <main className="compare-index">
      <header className="compare-index-head">
        <p className="kicker">ODDLYS · 오들리즈 — 2단계 디자인 비교</p>
        <h1>같은 콘텐츠, 세 가지 방향</h1>
        <p className="lead">동일한 12개 상품·세트·카드·시세 샘플·카피·구매 로직 위에서 편집 방식·밀도·캐릭터 비중·상품 표현·움직임만 다릅니다. 색만 다른 시안이 아닙니다.</p>
        <div className="compare-index-ctas">
          <Link to="/compare" className="btn btn-primary btn-lg">나란히 비교 (모바일 390 / 데스크톱 1440)</Link>
        </div>
        <p className="muted small">모든 데이터는 샘플입니다. 장바구니는 브라우저에만 저장되고 결제는 연결되지 않았습니다. 캐릭터·워드마크·상품 이미지는 임시 자리표시자입니다.</p>
      </header>
      <section className="compare-cards">
        {(['a', 'b', 'c'] as const).map((k) => (
          <article key={k} className={`compare-card compare-card-${k}`}>
            <h2>{CONCEPTS[k].name}</h2>
            <p>{CONCEPTS[k].tagline}</p>
            <ul>
              {SCREENS.map((s) => <li key={s.path}><Link to={`/concepts/${k}${s.path}`}>{s.label}</Link></li>)}
            </ul>
            <Link to={`/concepts/${k}`} className="btn btn-secondary">{k.toUpperCase()} 프리뷰 열기</Link>
          </article>
        ))}
      </section>
      <section className="compare-table-wrap">
        <h2>무엇이 다른가</h2>
        <table className="compare-table">
          <thead><tr><th></th><th>A. 취향 편집숍</th><th>B. 컬렉터 아카이브</th><th>C. 플레이풀 쇼룸</th></tr></thead>
          <tbody>{ROWS.map((r) => <tr key={r.label}><th>{r.label}</th><td>{r.a}</td><td>{r.b}</td><td>{r.c}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="compare-questions">
        <h2>선택할 때 볼 것 (‘어느 것이 예쁜가’로 끝내지 않기)</h2>
        <ol>
          <li><strong>홈의 인상</strong> — 첫 화면에서 무엇을 파는지, 어디서 찾는지 알 수 있는가? 오들리가 상품 진입을 밀어내지 않는가?</li>
          <li><strong>상품을 찾는 방식</strong> — 검색·색인 중심(B)인가, 큐레이션에서 발견(A)하는가, 장면에서 진입(C)하는가?</li>
          <li><strong>정보 밀도</strong> — 세트 상세의 힛카드·전체 카드·시세 요약이 표(B)에 가까운 편이 좋은가, 이미지 중심(A/C)이 좋은가?</li>
          <li><strong>캐릭터 비중</strong> — 대표 장면에서 크게(C), 포인트에서 큐레이터처럼(A), 필요한 자리에서 작게(B) 중 어느 쪽이 브랜드에 맞는가?</li>
        </ol>
        <p>초기 추천(비교 후 확정): <strong>A의 홈 + B의 세트/시세 정보 질서 + C의 제한된 대표 장면 1개</strong>. 문서: <code>docs/DESIGN_COMPARISON.md</code></p>
      </section>
    </main>
  );
}
