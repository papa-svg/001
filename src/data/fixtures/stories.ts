import type { Story, EditorialFeature } from '../types';

export const STORIES: Story[] = [
  {
    slug: 'first-box',
    title: '처음 고르는 박스라면',
    kicker: '입문 가이드',
    excerpt: '팩과 박스는 무엇이 다를까. 확장팩과 하이클래스 팩의 차이, 그리고 첫 박스를 고를 때 보면 좋은 세 가지.',
    relatedSetIds: ['smp-pk1-ko'],
    relatedProductIds: ['p-pk1-box-ko', 'p-op1-box-ko'],
    publishedAt: '2026-09-10',
    isDemo: true,
  },
  {
    slug: 'keep-one-card-long',
    title: '한 장을 오래 좋아하는 방법',
    kicker: '보관',
    excerpt: '슬리브, 탑로더, 바인더는 각각 언제 쓰는 물건일까. 규격 표기를 읽는 법부터.',
    relatedSetIds: [],
    relatedProductIds: ['p-sleeve-std', 'p-toploader', 'p-binder-9'],
    publishedAt: '2026-09-03',
    isDemo: true,
  },
  {
    slug: 'forest-light-six-scenes',
    title: '「숲의 빛」 스페셜 아트 여섯 장이 이어지는 풍경',
    kicker: '카드 이야기',
    excerpt: '084부터 089까지, 여섯 장을 나란히 두면 하나의 숲이 된다. 어느 장면부터 시작하는지 살펴봤다.',
    relatedSetIds: ['smp-pk1-ko'],
    relatedProductIds: ['p-pk1-box-ko'],
    publishedAt: '2026-09-14',
    isDemo: true,
  },
];

export const storyBySlug = (slug: string) => STORIES.find((s) => s.slug === slug);

/** 홈 '현재 큐레이션' — 편집 이유가 있는 세트/상품 */
export const CURATION: EditorialFeature[] = [
  { id: 'c1', title: '이번 주 가장 많이 들여다본 세트', reason: '스페셜 아트 6장이 하나의 장면으로 이어지는 구성. 도감으로 보는 재미가 크다.', ref: { kind: 'set', id: 'smp-pk1-ko' }, updatedAt: '2026-09-15' },
  { id: 'c2', title: '리더 8종으로 시작하는 새 진영', reason: '패러렐 판본과 일반판이 같은 번호를 쓰는 구조를 처음 접하기 좋다.', ref: { kind: 'set', id: 'smp-op1-ko' }, updatedAt: '2026-09-12' },
  { id: 'c3', title: '첫 박스로 고르기 좋은 이유', reason: '팩당 5장, 30팩 구성. 기본 카드 비중이 높아 시작하기 편하다.', ref: { kind: 'product', id: 'p-pk1-box-ko' }, updatedAt: '2026-09-15' },
  { id: 'c4', title: '세트 한 벌을 번호순으로', reason: '수록 카드 90종 기준으로 바인더 한 권이면 여유 있게 들어간다.', ref: { kind: 'product', id: 'p-binder-9' }, updatedAt: '2026-09-08' },
];
