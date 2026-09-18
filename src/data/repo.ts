import { PRODUCTS, productBySlug, productById } from './fixtures/products';
import { SETS, setById } from './fixtures/sets';
import { PRINTINGS, cardById, printingById, printingsBySet } from './fixtures/cards';
import { MARKET, MARKET_RULES, PLATFORMS, observationsForPrinting } from './fixtures/market';
import { STORIES, CURATION, storyBySlug } from './fixtures/stories';
import type { CategoryId, GameId, Language, Printing, Product, PriceObservationView, StockStatus, DataState, Rarity, ArtVersion } from './types';

export { PRODUCTS, SETS, PRINTINGS, MARKET, PLATFORMS, STORIES, CURATION, MARKET_RULES };
export { productBySlug, productById, setById, cardById, printingById, printingsBySet, storyBySlug, observationsForPrinting };

/* ---------- 포맷 ---------- */
export const krw = (n: number) => `${n.toLocaleString('ko-KR')}원`;
export const money = (amount: number | null, currency: string) => {
  if (amount == null) return '—';
  if (currency === 'KRW') return krw(amount);
  return `${currency === 'USD' ? 'US$' : currency + ' '}${amount.toLocaleString('en-US')}`;
};
export const shortDate = (iso: string | null) => {
  if (!iso) return '미확인';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: '판매중',
  low_stock: '재고 적음',
  sold_out: '품절',
  preorder: '예약 판매',
};

/* ---------- 상품 필터 ---------- */
export interface ShopFilters {
  q?: string;
  category?: CategoryId | 'all';
  game?: GameId | 'all';
  language?: Language | 'all';
  inStockOnly?: boolean;
  sort?: 'editorial' | 'price_asc' | 'price_desc' | 'newest';
}

/** 편집 기준 정렬 순서(추천순): 큐레이션 언급 → 세트 발매일 최신 → 이름 */
const EDITORIAL_ORDER = ['p-pk1-box-ko', 'p-pk1-pack-ko', 'p-op1-box-ko', 'p-op1-pack-ko', 'p-rb1-pack-en', 'p-binder-9', 'p-sleeve-std', 'p-rb1-box-en', 'p-pk1-box-ja', 'p-op1-box-ja', 'p-toploader', 'p-pk2-pack-ko'];

export const minPrice = (p: Product) => Math.min(...p.skus.map((s) => s.price));
export const productStatus = (p: Product): StockStatus => {
  if (p.skus.some((s) => s.status === 'in_stock')) return 'in_stock';
  if (p.skus.some((s) => s.status === 'low_stock')) return 'low_stock';
  if (p.skus.some((s) => s.status === 'preorder')) return 'preorder';
  return 'sold_out';
};
export const productLanguages = (p: Product): Language[] => [...new Set(p.skus.map((s) => s.language).filter((l): l is Language => !!l))];

export function filterProducts(f: ShopFilters): Product[] {
  let list = PRODUCTS.slice();
  const q = f.q?.trim().toLowerCase();
  if (q) list = list.filter((p) => [p.name, p.summary, ...p.setIds.map((id) => setById(id)?.name ?? ''), ...p.setIds.map((id) => setById(id)?.code ?? '')].join(' ').toLowerCase().includes(q));
  if (f.category && f.category !== 'all') list = list.filter((p) => p.category === f.category);
  if (f.game && f.game !== 'all') list = list.filter((p) => p.game === f.game);
  if (f.language && f.language !== 'all') list = list.filter((p) => productLanguages(p).includes(f.language as Language));
  if (f.inStockOnly) list = list.filter((p) => ['in_stock', 'low_stock'].includes(productStatus(p)));
  switch (f.sort) {
    case 'price_asc': list.sort((a, b) => minPrice(a) - minPrice(b)); break;
    case 'price_desc': list.sort((a, b) => minPrice(b) - minPrice(a)); break;
    case 'newest': list.sort((a, b) => (setById(b.setIds[0] ?? '')?.releaseDate ?? '').localeCompare(setById(a.setIds[0] ?? '')?.releaseDate ?? '')); break;
    default: list.sort((a, b) => EDITORIAL_ORDER.indexOf(a.id) - EDITORIAL_ORDER.indexOf(b.id));
  }
  return list;
}

export const activeFilterCount = (f: ShopFilters) => [f.category && f.category !== 'all', f.game && f.game !== 'all', f.language && f.language !== 'all', f.inStockOnly].filter(Boolean).length;

/* ---------- 세트/카드 ---------- */
export const productsForSet = (setId: string) => PRODUCTS.filter((p) => p.setIds.includes(setId));

export interface CardFilters {
  q?: string;
  rarity?: Rarity | 'all';
  art?: ArtVersion | 'all';
  type?: string | 'all';
}
export function filterPrintings(setId: string, f: CardFilters): Printing[] {
  let list = printingsBySet(setId);
  const q = f.q?.trim().toLowerCase();
  if (q) list = list.filter((p) => (cardById(p.cardId)?.name ?? '').toLowerCase().includes(q) || p.number.includes(q));
  if (f.rarity && f.rarity !== 'all') list = list.filter((p) => p.rarity === f.rarity);
  if (f.art && f.art !== 'all') list = list.filter((p) => p.artVersion === f.art);
  if (f.type && f.type !== 'all') list = list.filter((p) => cardById(p.cardId)?.type === f.type);
  return list;
}

/** 힛카드 후보 — 기준을 구분해 반환 */
export type HitCriteria = 'editorial' | 'rarity' | 'price';
export function hitCards(setId: string, criteria: HitCriteria): Printing[] {
  const all = printingsBySet(setId);
  if (criteria === 'editorial') return all.filter((p) => p.editorialReason);
  if (criteria === 'rarity') {
    const order: Rarity[] = ['UR', 'SEC', 'SAR', 'SR', 'L', 'RR', 'R', 'U', 'C'];
    return all.filter((p) => ['UR', 'SEC', 'SAR', 'SR', 'L'].includes(p.rarity)).sort((a, b) => order.indexOf(a.rarity) - order.indexOf(b.rarity)).slice(0, 8);
  }
  // 가격 상위: 비교 가능한 데이터(검증된 매칭·표본 충족·최신)만
  return all
    .map((p) => ({ p, s: priceSummary(p.id) }))
    .filter(({ s }) => s.state === 'ready' && s.headline?.amount != null)
    .sort((a, b) => (b.s.headline!.convertedAmount ?? b.s.headline!.amount!) - (a.s.headline!.convertedAmount ?? a.s.headline!.amount!))
    .map(({ p }) => p);
}

/* ---------- 시세 요약 ---------- */
export interface PriceSummaryView {
  state: DataState;
  reason?: '표본 부족' | '최근 거래 없음' | '갱신 지연' | '자료 없음' | '매칭 미확인';
  headline: PriceObservationView | null; // 대표값(실거래 KRW 우선)
  asking: PriceObservationView | null;
  others: PriceObservationView[];
  asOf: string | null;
}

export function priceSummary(printingId: string): PriceSummaryView {
  const obs = observationsForPrinting(printingId);
  if (obs.length === 0) return { state: 'empty', reason: '자료 없음', headline: null, asking: null, others: [], asOf: null };
  const verified = obs.filter((o) => o.matchStatus === 'verified');
  if (verified.length === 0) return { state: 'empty', reason: '매칭 미확인', headline: null, asking: null, others: obs, asOf: obs[0]!.refreshedAt };
  const sold = verified.filter((o) => o.kind === 'sold').sort((a, b) => (a.currency === 'KRW' ? -1 : 1) - (b.currency === 'KRW' ? -1 : 1));
  const asking = verified.find((o) => o.kind === 'asking') ?? null;
  const headline = sold[0] ?? null;
  const asOf = verified.map((o) => o.refreshedAt).filter(Boolean).sort().at(-1) ?? null;
  if (!headline) return { state: 'ready', reason: '최근 거래 없음', headline: null, asking, others: verified.filter((o) => o !== asking), asOf };
  const days = (new Date(MARKET_RULES.asOf).getTime() - new Date(headline.refreshedAt ?? 0).getTime()) / 86400000;
  if (days > MARKET_RULES.staleAfterDays) return { state: 'stale', reason: '갱신 지연', headline, asking, others: sold.slice(1), asOf };
  if ((headline.sampleSize ?? 0) < MARKET_RULES.minSampleSize) return { state: 'empty', reason: '표본 부족', headline, asking, others: sold.slice(1), asOf };
  return { state: 'ready', headline, asking, others: sold.slice(1), asOf };
}

/* ---------- 검색(통합) ---------- */
export interface SearchResults {
  products: Product[];
  sets: typeof SETS;
  printings: Printing[];
  stories: typeof STORIES;
}
export function searchAll(q: string): SearchResults {
  const t = q.trim().toLowerCase();
  if (!t) return { products: [], sets: [], printings: [], stories: [] };
  return {
    products: filterProducts({ q: t }),
    sets: SETS.filter((s) => [s.name, s.code].join(' ').toLowerCase().includes(t)),
    printings: PRINTINGS.filter((p) => (cardById(p.cardId)?.name ?? '').toLowerCase().includes(t) || p.number.split('/')[0] === t.padStart(3, '0')).slice(0, 24),
    stories: STORIES.filter((s) => [s.title, s.excerpt].join(' ').toLowerCase().includes(t)),
  };
}

export const gameLabel = (g: GameId | null) => (g ? { pokemon: '포켓몬', onepiece: '원피스', riftbound: '리프트바운드' }[g] : '카드 용품');
