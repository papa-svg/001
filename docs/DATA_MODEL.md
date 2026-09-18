# 상품·세트·카드·시세 데이터 매핑

타입 정의: `src/data/types.ts`. 조회·필터·요약 로직: `src/data/repo.ts`. 기존 시세 DB 스키마를 강제하지 않으며, 어댑터에서 이 화면 모델로 변환한다.

| 대상 | 타입 | 핵심 필드 | 비고 |
|---|---|---|---|
| Product | `Product` | slug, name, category(pack/box/supply), game(null=용품), setIds[], skus[], specs, optionGroups, relatedSupplyIds | 여러 세트 포함 상품을 위해 setIds 배열 |
| SKU | `SKU` | language, region, unit, contents(null=미확인), price, stock(null=비공개), status(in_stock/low_stock/sold_out/preorder), shippingNote, optionValues | 실제 판매·재고 단위 |
| Set | `CardSet` | code, language, region, releaseDate(null 허용), cardsPerPack/packsPerBox/totalCards(null=미확인), officialSource, features, artNotes, intro | 일본어판·한국어판은 별도 Set |
| Card | `Card` | name, game, type | 캐릭터 이름만으로 동일 판단 금지 |
| Printing | `Printing` | cardId, setId, number, rarity, artVersion(regular/alt/full/parallel), finish, language, hasImage, editorialReason/Tag | 카드 상세·시세 연결 기준 |
| Market observation | `PriceObservationView` | kind(asking/sold/index), amount, currency, convertedAmount+fxAsOf, sampleSize, period, transactionCount, unitsSold, condition/grade, aggregationMethod, matchStatus, isDemo | 상태·등급은 Printing이 아닌 관측의 조건 |
| Editorial feature | `EditorialFeature`, `Story` | title, reason, ref(set/product/printing), updatedAt | 홈 큐레이션·이야기 |

## 시세 요약 규칙 (`priceSummary`)
- 대표값: 검증된 매칭(`matchStatus: verified`)의 **실거래(sold)**, KRW 우선.
- `MARKET_RULES.minSampleSize`(5) 미만 → '표본 부족' (값은 흐리게 표시, 순위 제외).
- `staleAfterDays`(7) 초과 → '갱신 지연' + 마지막 확인 시각.
- 관측 없음 → '자료 없음'. 검증 매칭 없음 → '매칭 미확인'(비교 제외). 실거래 없고 호가만 → '최근 거래 없음'.
- 호가는 항상 '판매 호가(아직 팔리지 않은 가격)'로 구분. 환산 금액은 원통화와 함께, 배송비/세금 포함 여부 미확인 표기.
- 0원·0%로 대체하지 않는다. 힛카드 '가격 상위' 기준은 `state === 'ready'`인 카드만 정렬.
- 최소 표본·유효기간은 데이터 제공자와 합의할 설정값(임시).

## 어댑터 계약 (후속)
- `getProducts(filters)`, `getProduct(slug)`, `getSet(id)`, `getPrintings(setId, filters)`, `getPrinting(id)`, `getObservations(printingId, {platform, condition, period})` 형태로 `repo.ts` 함수 시그니처를 유지하면 화면 코드를 바꾸지 않고 데이터 소스를 교체할 수 있다.
- 로딩/오류/빈/오래됨은 `DataState`로 전달. 시세 장애가 상품 구매 화면을 멈추지 않도록 `PriceSummary`는 독립 컴포넌트.
- 분석 이벤트(설계만): search, filter_apply, view_product, view_set, view_card, save_item, add_to_cart, begin_checkout, outbound_price_click.
