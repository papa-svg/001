import type { Platform, PriceObservationView } from '../types';

/**
 * 샘플 시세. 모두 isDemo: true. 실재 카드의 가격이 아니다.
 * 세트 상세의 '참고 시세 요약(샘플)'에만 쓰고, 독립 시세 화면은 3단계 이후 기존 시세 DB와 연결한다.
 */
export const PLATFORMS: Platform[] = [
  { id: 'plat-a', name: '샘플 플랫폼 A', market: '국내 · KRW' },
  { id: 'plat-b', name: '샘플 플랫폼 B', market: '해외 · USD' },
];

const T = '2026-09-17T09:00:00+09:00';

export const MARKET: PriceObservationView[] = [
  // 084 SAR — 정상 데이터
  { id: 'm1', printingId: 'smp-pk1-ko-084', platformId: 'plat-a', language: 'ko', region: 'KR', finish: 'textured', condition: 'NM', kind: 'sold', amount: 128000, currency: 'KRW', observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 14, periodStart: '2026-09-10', periodEnd: '2026-09-17', transactionCount: 14, aggregationMethod: 'median', matchStatus: 'verified', isDemo: true },
  { id: 'm2', printingId: 'smp-pk1-ko-084', platformId: 'plat-a', language: 'ko', region: 'KR', finish: 'textured', condition: 'NM', kind: 'asking', amount: 139000, currency: 'KRW', observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 6, aggregationMethod: 'min', matchStatus: 'verified', isDemo: true },
  { id: 'm3', printingId: 'smp-pk1-ko-084', platformId: 'plat-b', language: 'ko', region: 'KR', finish: 'textured', condition: 'NM', kind: 'sold', amount: 92, currency: 'USD', convertedAmount: 126500, fxAsOf: '2026-09-17', taxesKnown: false, observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 5, periodStart: '2026-09-10', periodEnd: '2026-09-17', transactionCount: 5, aggregationMethod: 'median', matchStatus: 'verified', isDemo: true },
  // 085 SAR — 갱신 지연(stale)
  { id: 'm4', printingId: 'smp-pk1-ko-085', platformId: 'plat-a', language: 'ko', finish: 'textured', condition: 'NM', kind: 'sold', amount: 74000, currency: 'KRW', observedAt: '2026-09-02T10:00:00+09:00', refreshedAt: '2026-09-02T10:00:00+09:00', sourceUrl: null, sampleSize: 9, periodStart: '2026-08-26', periodEnd: '2026-09-02', transactionCount: 9, aggregationMethod: 'median', matchStatus: 'verified', isDemo: true },
  // 033 SR — 표본 부족
  { id: 'm5', printingId: 'smp-pk1-ko-033', platformId: 'plat-a', language: 'ko', finish: 'holo', condition: 'NM', kind: 'sold', amount: 21000, currency: 'KRW', observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 2, periodStart: '2026-09-10', periodEnd: '2026-09-17', transactionCount: 2, aggregationMethod: 'median', matchStatus: 'verified', isDemo: true },
  // 012 RR — 정상, 호가만
  { id: 'm6', printingId: 'smp-pk1-ko-012', platformId: 'plat-a', language: 'ko', finish: 'holo', condition: 'NM', kind: 'asking', amount: 4500, currency: 'KRW', observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 21, aggregationMethod: 'min', matchStatus: 'verified', isDemo: true },
  // 089 UR — 매칭 미확인
  { id: 'm7', printingId: 'smp-pk1-ko-089', platformId: 'plat-b', language: 'ko', finish: 'textured', condition: 'NM', kind: 'sold', amount: 210, currency: 'USD', convertedAmount: 288000, fxAsOf: '2026-09-17', taxesKnown: false, observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 3, transactionCount: 3, aggregationMethod: 'median', matchStatus: 'unverified', isDemo: true },
  // 원피스 022 SEC — 정상
  { id: 'm8', printingId: 'smp-op1-ko-022', platformId: 'plat-a', language: 'ko', finish: 'textured', condition: 'NM', kind: 'sold', amount: 156000, currency: 'KRW', observedAt: T, refreshedAt: T, sourceUrl: null, sampleSize: 11, periodStart: '2026-09-10', periodEnd: '2026-09-17', transactionCount: 11, aggregationMethod: 'median', matchStatus: 'verified', isDemo: true },
  // 005 C 입문 추천 — 데이터 없음 (의도적으로 관측 없음)
];

/** 데이터 제공자와 합의할 설정값(임시). */
export const MARKET_RULES = {
  minSampleSize: 5,
  staleAfterDays: 7,
  asOf: T,
};

export const observationsForPrinting = (printingId: string) => MARKET.filter((m) => m.printingId === printingId);
