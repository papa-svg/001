import type { Card, Printing, Rarity, ArtVersion, GameId, Language } from '../types';

/**
 * 샘플 카드·판본. 실재 카드가 아니며 이름은 임의로 만든 것이다.
 * 같은 이름의 카드가 여러 판본(레귤러/스페셜 아트/패러렐)으로 수록되는 구조를 보여주기 위해
 * 카드(Card)와 판본(Printing)을 분리한다.
 */

const PK_NAMES = ['이슬잎여우', '번개꼬리', '물결도롱', '바위등껍', '달빛나방', '숲지기곰', '반딧불정령', '가시덤불', '노을매', '얼음결정', '풀피리', '강바닥잉어', '구름양', '별똥벌레', '흙두더지', '연꽃거북', '안개늑대', '소금사슴', '모래게', '햇살토끼', '소나무올빼미', '이끼개구리', '유리나비', '벼락염소', '도토리쥐', '진주조개', '바람제비', '수련오리', '산딸기곰', '연기여우'];
const PK_TYPES = ['풀', '물', '번개', '격투', '초', '악', '강철', '노말'];
const OP_NAMES = ['선장 로아', '항해사 미르', '요리사 단', '저격수 세이', '검사 하루', '박사 에린', '의사 노엘', '음악가 리브', '조선공 텐', '항로 기록관', '폭풍의 함대', '새벽 상선', '등대지기', '해류의 문', '기항지 시장', '보급선', '북풍 해적단', '섬의 수호자', '연안 순찰대', '고래 등 항구'];
const OP_TYPES = ['캐릭터', '이벤트', '스테이지'];
const RB_NAMES = ['협곡의 수호자', '균열 마법사', '룬 조각', '심연의 전령', '창공 기사', '고대 룬석', '폭발 주문', '얼음 장벽', '그림자 도적', '태양의 사제', '바람 정찰병', '용암 골렘', '수정 궁수', '시간의 문', '강철 파수꾼', '안개 암살자'];
const RB_TYPES = ['유닛', '주문', '룬', '전장'];

const TONES = ['sage', 'sky', 'sand', 'rose', 'lilac', 'mint', 'amber', 'slate'];

interface Seed {
  setId: string;
  game: GameId;
  language: Language;
  total: number;
  names: string[];
  types: string[];
  secretFrom?: number; // 시크릿 번호 시작
  hits: Array<{ idx: number; rarity: Rarity; art: ArtVersion; finish: Printing['finish']; reason: string; tag: Printing['editorialTag'] }>;
}

const SEEDS: Seed[] = [
  {
    setId: 'smp-pk1-ko', game: 'pokemon', language: 'ko', total: 90, names: PK_NAMES, types: PK_TYPES, secretFrom: 81,
    hits: [
      { idx: 12, rarity: 'RR', art: 'regular', finish: 'holo', reason: '이번 세트의 대표 진화 카드. 홀로 가공에서 잎맥 무늬가 살아난다.', tag: '인기 캐릭터' },
      { idx: 33, rarity: 'SR', art: 'full', finish: 'holo', reason: '프레임 없는 풀아트. 물가에 비친 노을이 카드 아래까지 이어진다.', tag: '아트' },
      { idx: 84, rarity: 'SAR', art: 'alt', finish: 'textured', reason: '스페셜 아트 6종 중 장면의 시작. 여섯 장을 나란히 두면 한 풍경이 된다.', tag: '아트' },
      { idx: 85, rarity: 'SAR', art: 'alt', finish: 'textured', reason: '텍스처 가공이 가장 두드러지는 카드. 손으로 만질 때 결이 느껴진다.', tag: '특수 가공' },
      { idx: 5, rarity: 'C', art: 'regular', finish: 'normal', reason: '처음 덱을 짜는 사람이 가장 많이 쓰는 기본 카드. 값이 낮아 여러 장 모으기 좋다.', tag: '입문 추천' },
      { idx: 89, rarity: 'UR', art: 'alt', finish: 'textured', reason: '골드 가공 울트라 레어. 세트 마지막 번호.', tag: '특수 가공' },
    ],
  },
  { setId: 'smp-pk1-ja', game: 'pokemon', language: 'ja', total: 24, names: PK_NAMES, types: PK_TYPES, hits: [
    { idx: 12, rarity: 'RR', art: 'regular', finish: 'holo', reason: '한국어판 012와 같은 카드지만 일본어판은 별도 판본으로 구분한다.', tag: '인기 캐릭터' },
  ] },
  { setId: 'smp-pk2-ko', game: 'pokemon', language: 'ko', total: 36, names: PK_NAMES, types: PK_TYPES, secretFrom: 31, hits: [
    { idx: 31, rarity: 'SEC', art: 'alt', finish: 'textured', reason: '재판본 중 가장 찾는 사람이 많은 카드.', tag: '인기 캐릭터' },
  ] },
  { setId: 'smp-op1-ko', game: 'onepiece', language: 'ko', total: 40, names: OP_NAMES, types: OP_TYPES, hits: [
    { idx: 1, rarity: 'L', art: 'regular', finish: 'holo', reason: '세트 첫 리더. 새 진영의 중심.', tag: '입문 추천' },
    { idx: 7, rarity: 'SR', art: 'parallel', finish: 'holo', reason: '패러렐 판본. 같은 번호의 일반판과 가공만 다르다.', tag: '특수 가공' },
    { idx: 22, rarity: 'SEC', art: 'alt', finish: 'textured', reason: '얼터너티브 아트. 배경의 새벽 항로 묘사가 세트 이름과 이어진다.', tag: '아트' },
  ] },
  { setId: 'smp-op1-ja', game: 'onepiece', language: 'ja', total: 12, names: OP_NAMES, types: OP_TYPES, hits: [] },
  { setId: 'smp-rb1-en', game: 'riftbound', language: 'en', total: 40, names: RB_NAMES, types: RB_TYPES, hits: [
    { idx: 3, rarity: 'R', art: 'regular', finish: 'holo', reason: '첫 세트의 대표 챔피언.', tag: '인기 캐릭터' },
    { idx: 38, rarity: 'UR', art: 'full', finish: 'textured', reason: '풀아트 판본은 별도 번호 체계를 쓴다.', tag: '아트' },
  ] },
];

const rarityFor = (i: number, total: number, secretFrom?: number): Rarity => {
  if (secretFrom && i >= secretFrom) return i === total ? 'UR' : 'SAR';
  const m = i % 17;
  if (m === 0) return 'SR';
  if (m === 6 || m === 13) return 'RR';
  if (m === 3 || m === 9 || m === 15) return 'R';
  if (m % 2 === 0) return 'U';
  return 'C';
};

const pad = (n: number, w = 3) => String(n).padStart(w, '0');

const cardsMap = new Map<string, Card>();
const printings: Printing[] = [];

for (const seed of SEEDS) {
  const width = seed.total >= 100 ? 3 : 3;
  for (let i = 1; i <= seed.total; i++) {
    const name = seed.names[(i - 1) % seed.names.length]!;
    const cardId = `${seed.game}-${name}`;
    if (!cardsMap.has(cardId)) {
      cardsMap.set(cardId, { id: cardId, name, game: seed.game, type: seed.types[(i - 1) % seed.types.length]! });
    }
    const hit = seed.hits.find((h) => h.idx === i);
    const rarity = hit?.rarity ?? rarityFor(i, seed.total, seed.secretFrom);
    const art: ArtVersion = hit?.art ?? (seed.secretFrom && i >= seed.secretFrom ? 'alt' : 'regular');
    const finish = hit?.finish ?? (rarity === 'C' || rarity === 'U' ? 'normal' : 'holo');
    printings.push({
      id: `${seed.setId}-${pad(i, width)}`,
      cardId,
      setId: seed.setId,
      number: `${pad(i, width)}/${pad(seed.secretFrom ? seed.secretFrom - 1 : seed.total, width)}`,
      rarity,
      artVersion: art,
      finish,
      language: seed.language,
      // 이미지 없음 상태를 보여주기 위해 일부 판본은 이미지 미제공으로 둔다
      hasImage: !(i % 23 === 0),
      editorialReason: hit?.reason,
      editorialTag: hit?.tag,
      tone: TONES[(i * 7) % TONES.length]!,
    });
  }
}

export const CARDS: Card[] = [...cardsMap.values()];
export const PRINTINGS: Printing[] = printings;

export const cardById = (id: string) => cardsMap.get(id);
export const printingById = (id: string) => PRINTINGS.find((p) => p.id === id);
export const printingsBySet = (setId: string) => PRINTINGS.filter((p) => p.setId === setId);
