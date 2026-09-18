import { useState } from 'react';
import { Link } from 'react-router';
import { CONCEPTS } from '@/concepts/concept';

const SCREENS = [
  { path: '', label: '홈' },
  { path: '/products/pokemon-forest-light-booster-box-ko', label: '상품 상세 · 박스' },
  { path: '/products/card-sleeve-standard-100', label: '상품 상세 · 옵션 용품' },
  { path: '/sets/smp-pk1-ko', label: '세트 상세' },
  { path: '/sets/smp-pk1-ko#hits', label: '세트 · 힛카드' },
  { path: '/sets/smp-pk1-ko#cards', label: '세트 · 전체 카드' },
  { path: '/shop', label: '샵' },
  { path: '/cart', label: '장바구니' },
];

/** 나란히 비교. iframe 3개가 같은 경로를 각 방향으로 연다. 데스크톱은 1440px 캔버스를 축소해 표시. */
export function ComparePage() {
  const [screen, setScreen] = useState(0);
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [show, setShow] = useState<Record<'a' | 'b' | 'c', boolean>>({ a: true, b: true, c: true });
  const base = import.meta.env.VITE_ROUTER === 'hash' ? `${import.meta.env.BASE_URL}#` : '';
  const src = (k: string) => `${base}/concepts/${k}${SCREENS[screen]!.path}`;
  const width = device === 'mobile' ? 390 : 1440;
  const height = device === 'mobile' ? 844 : 900;
  const scale = device === 'mobile' ? 1 : 0.42;
  const visible = (['a', 'b', 'c'] as const).filter((k) => show[k]);
  return (
    <main className="compare-page">
      <header className="compare-toolbar">
        <Link to="/" className="compare-back">← 비교 목록</Link>
        <label>화면
          <select value={screen} onChange={(e) => setScreen(Number(e.target.value))}>{SCREENS.map((s, i) => <option key={s.path} value={i}>{s.label}</option>)}</select>
        </label>
        <div className="compare-seg" role="group" aria-label="기기">
          <button type="button" className={device === 'mobile' ? 'is-on' : ''} onClick={() => setDevice('mobile')}>모바일 390</button>
          <button type="button" className={device === 'desktop' ? 'is-on' : ''} onClick={() => setDevice('desktop')}>데스크톱 1440 (축소)</button>
        </div>
        <div className="compare-seg" role="group" aria-label="표시할 방향">
          {(['a', 'b', 'c'] as const).map((k) => <button key={k} type="button" className={show[k] ? 'is-on' : ''} aria-pressed={show[k]} onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))}>{k.toUpperCase()}</button>)}
        </div>
        <span className="muted small">각 프레임은 실제 클릭·스크롤이 가능합니다. 세 프레임은 같은 fixture·상태·구매 로직을 공유합니다.</span>
      </header>
      <div className={`compare-frames compare-frames-${device}`} style={{ ['--n' as string]: visible.length }}>
        {visible.map((k) => (
          <figure key={k} className="compare-frame">
            <figcaption><strong>{CONCEPTS[k].name}</strong><span className="muted"> — {CONCEPTS[k].tagline}</span> <a href={src(k)} target="_blank" rel="noreferrer">새 탭 ↗</a></figcaption>
            <div className="compare-frame-viewport" style={{ width: width * scale, height: height * scale }}>
              <iframe title={`${CONCEPTS[k].name} — ${SCREENS[screen]!.label}`} src={src(k)} width={width} height={height} style={{ transform: `scale(${scale})` }} loading="lazy" />
            </div>
          </figure>
        ))}
      </div>
    </main>
  );
}
