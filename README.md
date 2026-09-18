# ODDLYS 온라인 샵 — 기획·디자인 비교 프리뷰

ODDLYS(오들리즈) 온라인 샵의 1단계(기획 기준)와 2단계(A/B/C 디자인 비교) 산출물. 같은 콘텐츠·같은 구매 로직 위에서 세 디자인 방향을 실제로 클릭해 비교할 수 있다.

- 시작: `npm install && npm run dev` → http://localhost:5173
- 비교: `/compare` (390 / 1440 나란히), `/concepts/a`, `/concepts/b`, `/concepts/c`
- 문서: `docs/PROGRESS.md`(진행·실행·검증), `docs/DESIGN_COMPARISON.md`(비교 결과·추천), `docs/DECISIONS.md`, `docs/BRAND_CONTEXT.md`, `docs/IA.md`, `docs/DATA_MODEL.md`, `docs/ASSETS.md`
- 스크린샷: `docs/previews/`

모든 상품·세트·카드·가격은 샘플이다. 장바구니는 브라우저에만 저장되고 결제는 연결되지 않았다. 캐릭터·로고·이미지는 임시 자리표시자다.

```
src/
  data/        타입(types.ts) · fixture · 조회/필터/시세요약(repo.ts)
  state/       cart · saved · toast (A/B/C 공유)
  ui/          공통 컴포넌트 (Header, ProductTile, BuyPanel, CardTile, PriceSummary, FilterSheet, States…)
  concepts/    방향별 구성: Home.tsx · ProductDetail.tsx · SetDetail.tsx · Shell.tsx
  pages/       공통 페이지(Shop, Search, Cart, CardDetail, Misc) · 비교 페이지
  styles/      base.css(토큰·공통) · concept-a/b/c.css(표현 계층) · compare.css
scripts/       screenshots · contact-sheet · qa-flows (Playwright)
```
