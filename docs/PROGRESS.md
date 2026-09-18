# 진행 상태

마지막 갱신 2026-09-18 · 브랜치 `claude/oddlys-shop-planning-design-k64s2t`

## 네 줄 요약
- **완료**: 1단계 문서(브랜드 기준·자산·IA·데이터 모델·결정)와 2단계 A/B/C 비교 프리뷰(홈·상품 상세·세트 상세 + 샵/검색/장바구니/카드 상세/저장/이야기 보조 화면), 스크린샷 54장 + 나란히 비교 9장, 자동 QA 56/56 통과, 타입 검사·빌드 통과.
- **이번 결정**: D-01~D-07, D-10~D-15 (docs/DECISIONS.md). 디자인 방향은 **선택 대기(D-08)**.
- **미정·막힌 점**: 캐릭터·로고·상품 사진 원본 없음(자리표시자). 시세 DB·커머스 백엔드 미연결. 운영 렌더링 방식(D-09) 미정. 브라우저 검증은 Chromium(Playwright)만 수행.
- **다음 작업**: 사용자가 4개 축(홈 인상 / 찾는 방식 / 정보 밀도 / 캐릭터 비중)으로 선택 → 3단계: 선택 조합으로 토큰·핵심 화면 확정, 카드 상세 심화, 시세 UI 계약 마감.

## 실행 방법
```bash
npm install
npm run dev          # http://localhost:5173  (비교 목록 → /compare, /concepts/a|b|c)
npm run build && npm run preview   # http://localhost:4173
npm run typecheck
npm run screenshots  # docs/previews/*.png (preview 서버 필요, PREVIEW_URL 기본 http://127.0.0.1:4173)
node scripts/contact-sheet.mjs     # 나란히 비교 이미지
node scripts/qa-flows.mjs          # 핵심 클릭 흐름 자동 QA
npm run build:static # dist-static/ — 해시 라우터, 정적 호스팅용
```
Playwright는 이 환경의 사전 설치 Chromium(`/opt/pw-browsers/chromium-1194`)을 사용한다. 다른 환경에서는 `CHROMIUM_PATH`를 지정하거나 `npx playwright install chromium`.

## 프리뷰 URL
- 로컬: 위 명령.
- 공유 프리뷰(Claude 아티팩트, 비공개·소유자와 공유 대상만 열람): https://claude.ai/artifact/SWeK3pF5Mem2vW1XvoqhUA — `npm run build:static` 결과(해시 라우터)를 발행한 것. 브라우저에서 실제 렌더링 확인은 사용자 몫(발행 환경에서 모듈 스크립트 실행 여부는 이 세션에서 검증하지 못함). 갱신: 같은 파일 경로로 재발행.

## 검증한 것 (2026-09-18, Chromium 1194 · 1440×900 / 390×844 · reduced-motion)
- 자동 QA(`scripts/qa-flows.mjs`) 56/56: 모바일 필터 시트(포켓몬·박스·한국어판 → 1개) → 상품 상세 구성·배송비 → 하단 구매 바 가격 반영 → 담기 → 장바구니 합계·배송비 → 삭제·되돌리기 → 뒤로 가기 필터 복원 / 세트 번호 필터 → 카드 상세 판본 표시 → 단품·랜덤 팩 구분 안내 → 목록 복귀 필터 유지 / 품절 담기 비활성·세트 링크 유지 / 옵션 미선택 안내·품절 옵션 비활성 / 검색 없음 회복 경로 / 키보드 검색→상품→담기 / 필터 시트 Esc 후 포커스 복귀 / 콘솔 페이지 오류 0.
- `tsc -b` 통과, `vite build` 통과 (JS 385KB·gzip 115KB, CSS 45KB, 폰트 2.0MB).
- 시각 점검: A/B/C 홈·상품·세트 데스크톱/모바일 스크린샷 확인 후 헤더 워드마크 줄바꿈·모바일 검색창 노출·A 히어로 캡션 겹침·C 히어로 대비 문제 수정.

## 검증하지 않은 것
- 실기기·Safari·Firefox·360/768px(스크린샷은 390/1440만).
- 스크린리더 실제 청취, 색 대비 자동 검사(토큰 값은 수동 계산만).
- 성능 실측(LCP/INP/CLS) — 출시 후 실사용 데이터 기준이며 개발 중 측정 안 함.
- 실제 결제·주문·재고·시세 연동(연결 대상 없음).

## 미연결·데모 기능
| 기능 | 상태 |
|---|---|
| 장바구니·저장 | 로컬 저장(데모). 계정 동기화 없음 |
| 주문하기 | 비활성 버튼. 결제 없음 |
| 배송 정책 | 샘플값 표시 |
| 시세 | 샘플 관측 8건. 독립 시세 화면·차트·플랫폼 이동 없음 |
| 이야기 본문 | 자리만 |
| 라이브 | 편성 없음 상태 화면만 |
| 이미지·캐릭터·로고 | 자리표시자 |

## 다음 작업자용 프롬프트
> 첨부한 마스터 프롬프트와 현재 프로젝트 파일(docs/PROGRESS.md, docs/DECISIONS.md, docs/DESIGN_COMPARISON.md)을 읽어줘. 선택된 방향은 [축별 선택: 홈 A/B/C · 찾는 방식 · 정보 밀도 · 캐릭터 비중]이고, 피드백은 [내용]이야. 기존 결정과 구현을 보존하면서 3단계(선택안 발전)부터 이어서 진행해줘. 완료한 결과, 실제 검증한 것, 미연결 기능을 구분해 보고해줘.
