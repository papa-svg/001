/**
 * 화면용 도메인 타입.
 * 마스터 프롬프트 08장(상품·세트·카드 구분)과 13장(시세 화면 계약)을 따른다.
 * 기존 시세 DB 스키마를 강제하는 정의가 아니라 UI에 필요한 정보의 예시다.
 */

export type GameId = 'pokemon' | 'onepiece' | 'riftbound';
export type CategoryId = 'pack' | 'box' | 'supply';
export type Language = 'ko' | 'ja' | 'en';

export const GAME_LABEL: Record<GameId, string> = {
  pokemon: '포켓몬',
  onepiece: '원피스',
  riftbound: '리프트바운드',
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  ko: '한국어판',
  ja: '일본어판',
  en: '영어판',
};

export const CATEGORY_LABEL: Record<CategoryId, string> = {
  pack: '팩',
  box: '박스',
  supply: '카드 용품',
};

export type StockStatus = 'in_stock' | 'low_stock' | 'sold_out' | 'preorder';

export interface SKU {
  id: string;
  productId: string;
  /** 옵션 표시명. 옵션이 하나면 상품명과 동일하게 둔다. */
  label: string;
  language?: Language;
  region?: string;
  /** 판매 단위: 팩 1개 / 박스 1개 / 100매 등 */
  unit: string;
  /** 실제 구성. 출처가 없으면 null(미확인) */
  contents: string | null;
  price: number; // KRW
  currency: 'KRW';
  stock: number | null; // null = 재고 수량 비공개
  status: StockStatus;
  /** 예약 상품 발송 예상 안내 */
  shippingNote?: string;
  /** 옵션 그룹(용품용) */
  optionValues?: Record<string, string>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  game: GameId | null; // 용품은 null
  /** 연결된 세트(팩·박스). 여러 세트를 포함할 수 있어 배열. */
  setIds: string[];
  summary: string;
  description: string[];
  /** 용품 규격 */
  specs?: { label: string; value: string }[];
  skus: SKU[];
  /** 용품 옵션 그룹 정의 */
  optionGroups?: { key: string; label: string; values: string[] }[];
  /** 관련 용품 추천(팩·박스 상품) */
  relatedSupplyIds?: string[];
  imageTone: string; // 자리표시자 톤 (실제 이미지 교체 예정)
  isDemo: true;
}

export type Rarity = 'C' | 'U' | 'R' | 'RR' | 'SR' | 'SAR' | 'UR' | 'L' | 'SEC';

export const RARITY_LABEL: Record<Rarity, string> = {
  C: '커먼',
  U: '언커먼',
  R: '레어',
  RR: '더블 레어',
  SR: '슈퍼 레어',
  SAR: '스페셜 아트',
  UR: '울트라 레어',
  L: '리더',
  SEC: '시크릿',
};

export interface CardSet {
  id: string;
  code: string;
  name: string;
  game: GameId;
  language: Language;
  region: string;
  releaseDate: string | null; // ISO 또는 null(미확인)
  /** 팩당 카드 수·박스당 팩 수: 출처 있는 판본 정보만. 없으면 null */
  cardsPerPack: number | null;
  packsPerBox: number | null;
  totalCards: number | null;
  officialSource: string | null;
  features: string[]; // 특징 2~3줄
  artNotes: string; // 아트·가공 포인트
  intro: string; // 입문 설명
  isDemo: true;
}

export interface Card {
  id: string;
  name: string;
  game: GameId;
  type: string; // 카드 유형(포켓몬/트레이너/캐릭터/이벤트 등)
}

export type ArtVersion = 'regular' | 'alt' | 'full' | 'parallel';

export interface Printing {
  id: string;
  cardId: string;
  setId: string;
  number: string; // "012/090"
  rarity: Rarity;
  artVersion: ArtVersion;
  finish: 'normal' | 'holo' | 'reverse' | 'textured';
  language: Language;
  hasImage: boolean; // 이미지 없음 상태 확인용
  /** 편집 추천 이유(있으면 힛카드 편집 후보) */
  editorialReason?: string;
  editorialTag?: '아트' | '인기 캐릭터' | '특수 가공' | '입문 추천';
  tone: string;
}

export type DataState = 'loading' | 'ready' | 'empty' | 'stale' | 'error';
export type PriceKind = 'asking' | 'sold' | 'index';

/** 시세 화면 계약 — 마스터 프롬프트 13장 */
export type PriceObservationView = {
  id: string;
  printingId: string;
  platformId: string;
  language: string;
  region?: string;
  finish?: string;
  condition?: string;
  gradingCompany?: string;
  grade?: string;
  kind: PriceKind;
  amount: number | null;
  currency: string;
  observedAt: string | null;
  refreshedAt: string | null;
  sourceUrl: string | null;
  sampleSize: number | null;
  periodStart?: string;
  periodEnd?: string;
  transactionCount?: number | null;
  unitsSold?: number | null;
  shippingAmount?: number | null;
  taxesKnown?: boolean;
  convertedAmount?: number | null;
  fxAsOf?: string | null;
  aggregationMethod?: string;
  matchStatus: 'verified' | 'unverified';
  isDemo: boolean;
};

export interface Platform {
  id: string;
  name: string;
  market: string; // 관측 범위
}

export interface Story {
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  relatedSetIds: string[];
  relatedProductIds: string[];
  publishedAt: string;
  isDemo: true;
}

export interface EditorialFeature {
  id: string;
  title: string;
  reason: string;
  ref: { kind: 'set'; id: string } | { kind: 'product'; id: string } | { kind: 'printing'; id: string };
  updatedAt: string;
}
