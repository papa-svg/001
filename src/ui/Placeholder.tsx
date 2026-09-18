import type { CategoryId } from '@/data/types';

/**
 * 중립 자리표시자. 실제 상품 사진·카드 이미지·캐릭터 원본이 없어 사용한다.
 * 실제 상품 사진처럼 보이지 않도록 라벨을 안에 적는다. (docs/ASSETS.md — 교체 예정)
 */

export const TONE: Record<string, [string, string]> = {
  green: ['#DDEBD3', '#4E7A3C'], teal: ['#D4E9E6', '#2E6F68'], navy: ['#D7DDEA', '#2F3B63'], red: ['#F2D9D3', '#9A3A2B'],
  crimson: ['#EED3DA', '#8A2E45'], violet: ['#E1D8EC', '#5B3F86'], gray: ['#E6E5E1', '#5B5A57'], blue: ['#D6E1F7', '#2E5BB8'],
  sage: ['#DCE5D6', '#5B7350'], sky: ['#D7E6F3', '#3B6C93'], sand: ['#EEE4D2', '#8A6E3F'], rose: ['#F1DADF', '#9A4B63'],
  lilac: ['#E4DCEF', '#6A5290'], mint: ['#D6EBE3', '#357A63'], amber: ['#F3E4CC', '#9A6A22'], slate: ['#DDE0E6', '#4A5568'],
};
const tone = (t: string) => TONE[t] ?? TONE.gray!;

export function ProductImage({ tone: t, category, label, className }: { tone: string; category: CategoryId; label?: string; className?: string }) {
  const [bg, fg] = tone(t);
  const kind = category === 'pack' ? '팩' : category === 'box' ? '박스' : '용품';
  // 팩: 세로 봉지 / 박스: 직육면체 / 용품: 납작한 사각
  return (
    <svg className={className} viewBox="0 0 400 400" role="img" aria-label={`${label ?? kind} 이미지 자리표시자`} preserveAspectRatio="xMidYMid meet">
      <rect width="400" height="400" fill={bg} />
      {category === 'pack' && (
        <g>
          <path d="M120 60 h160 l-8 24 v250 l8 26 h-160 l8-26 v-250z" fill={fg} opacity=".92" />
          <path d="M128 90 h144 v230 h-144z" fill="#fff" opacity=".12" />
          <rect x="150" y="150" width="100" height="110" rx="6" fill="#fff" opacity=".28" />
        </g>
      )}
      {category === 'box' && (
        <g>
          <path d="M70 140 l160-60 l110 40 v170 l-160 60 l-110-40z" fill={fg} opacity=".92" />
          <path d="M70 140 l110 40 l160-60" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
          <path d="M180 180 v170" stroke="#fff" strokeOpacity=".35" strokeWidth="3" />
          <rect x="205" y="200" width="90" height="70" rx="4" fill="#fff" opacity=".22" transform="skewY(-18)" />
        </g>
      )}
      {category === 'supply' && (
        <g>
          <rect x="90" y="110" width="220" height="180" rx="10" fill={fg} opacity=".9" />
          <rect x="110" y="130" width="180" height="140" rx="6" fill="#fff" opacity=".18" />
          <path d="M130 200 h140" stroke="#fff" strokeOpacity=".4" strokeWidth="4" />
        </g>
      )}
      <text x="200" y="372" textAnchor="middle" fontSize="16" fontFamily="inherit" fill={fg} opacity=".75" letterSpacing="1">
        {`상품 이미지 자리 · ${kind}`}
      </text>
    </svg>
  );
}

/** 카드 이미지 자리표시자. 실제 카드 비율(63×88) 유지. */
export function CardImage({ tone: t, number, name, hasImage, className, big }: { tone: string; number: string; name: string; hasImage: boolean; className?: string; big?: boolean }) {
  const [bg, fg] = tone(t);
  if (!hasImage) {
    return (
      <svg className={className} viewBox="0 0 63 88" role="img" aria-label={`${name} 카드 이미지 미제공`}>
        <rect width="63" height="88" rx="3" fill="#ECEBE7" />
        <rect x="6" y="8" width="51" height="56" rx="2" fill="#fff" stroke="#D5D3CE" strokeDasharray="2 2" />
        <text x="31.5" y="40" textAnchor="middle" fontSize="5" fill="#77756F" fontFamily="inherit">이미지 없음</text>
        <text x="31.5" y="78" textAnchor="middle" fontSize="5" fill="#77756F" fontFamily="inherit">{number}</text>
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 63 88" role="img" aria-label={`${name} ${number} 카드 이미지 자리표시자`}>
      <rect width="63" height="88" rx="3" fill={fg} />
      <rect x="3" y="3" width="57" height="82" rx="2" fill={bg} />
      <rect x="6" y="9" width="51" height="42" rx="1.5" fill={fg} opacity=".55" />
      <circle cx="42" cy="22" r="9" fill="#fff" opacity=".35" />
      <path d="M8 48 l14-14 l10 9 l8-6 l15 11 z" fill="#fff" opacity=".35" />
      <rect x="6" y="55" width="51" height="4" rx="1" fill={fg} opacity=".35" />
      <rect x="6" y="62" width="38" height="3" rx="1" fill={fg} opacity=".25" />
      <rect x="6" y="68" width="44" height="3" rx="1" fill={fg} opacity=".25" />
      <text x="6" y="82" fontSize={big ? 4 : 4.5} fill={fg} fontFamily="inherit" fontWeight="700">{number}</text>
    </svg>
  );
}

/**
 * 오들리 자리표시자. 최종 캐릭터가 아니다.
 * 현재 방향 기준(낮고 도톰한 연속 슬라임 몸·팔다리 없음·두 가닥 머리·이빨 없음·매트 블루)을
 * 실루엣 수준으로만 따른다. 비례·눈·입·블루 값은 미정.
 */
export function OddlyMark({ size = 120, gaze = 'front', mood = 'curious', className, title }: { size?: number; gaze?: 'left' | 'right' | 'front'; mood?: 'curious' | 'happy' | 'listen'; className?: string; title?: string }) {
  const dx = gaze === 'left' ? -4 : gaze === 'right' ? 4 : 0;
  const mouth = mood === 'happy' ? 'M84 92 q16 12 32 0' : mood === 'listen' ? 'M92 94 h16' : 'M90 92 q10 6 20 0';
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 200 140" className={className} role="img" aria-label={title ?? '오들리 자리표시자(임시)'}>
      <title>{title ?? '오들리 자리표시자 — 최종 캐릭터 아님'}</title>
      {/* 두 가닥 머리 */}
      <path d="M92 30 q-6 -22 8 -26 q-2 12 2 24z" fill="var(--brand-blue)" />
      <path d="M112 30 q10 -20 20 -16 q-10 6 -12 20z" fill="var(--brand-blue)" />
      {/* 낮고 도톰한 연속 몸 */}
      <path d="M22 118 C 14 70, 60 26, 108 30 C 160 34, 190 74, 178 112 C 172 130, 150 134, 100 134 C 50 134, 28 132, 22 118 Z" fill="var(--brand-blue)" />
      {/* 눈 */}
      <ellipse cx={80 + dx} cy="76" rx="6" ry={mood === 'listen' ? 5 : 7} fill="#1B1D22" />
      <ellipse cx={126 + dx} cy="76" rx="6" ry={mood === 'listen' ? 5 : 7} fill="#1B1D22" />
      <circle cx={82 + dx} cy="73" r="2" fill="#fff" />
      <circle cx={128 + dx} cy="73" r="2" fill="#fff" />
      {/* 입 — 이빨 없음 */}
      <path d={mouth} stroke="#1B1D22" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** 임시 워드마크. 최종 로고 원본 없음 — 교체 예정. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`wordmark ${className ?? ''}`} aria-label="ODDLYS 오들리즈">
      ODDLYS
    </span>
  );
}
