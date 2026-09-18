import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useCart } from '@/state/cart';
import { useSaved } from '@/state/saved';
import { CLink, useCPath, useConcept, CONCEPTS } from '@/concepts/concept';
import { Wordmark, OddlyMark } from './Placeholder';

const NAV = [
  { to: '/shop', label: '샵' },
  { to: '/sets', label: '카드 도감' },
  { to: '/market', label: '시세', soon: true },
  { to: '/stories', label: '이야기' },
];

export function SearchBox({ className, placeholder = '상품, 세트 코드, 카드 이름·번호', autoFocus, size = 'md' }: { className?: string; placeholder?: string; autoFocus?: boolean; size?: 'md' | 'lg' }) {
  const nav = useNavigate();
  const cpath = useCPath();
  const loc = useLocation();
  const initial = new URLSearchParams(loc.search).get('q') ?? '';
  const [q, setQ] = useState(initial);
  return (
    <form
      className={`searchbox searchbox-${size} ${className ?? ''}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        nav(cpath(`/search?q=${encodeURIComponent(q.trim())}`));
      }}
    >
      <label className="sr-only" htmlFor={`search-${size}`}>검색</label>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="searchbox-icon"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <input id={`search-${size}`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} autoComplete="off" />
      <button type="submit" className="searchbox-submit">검색</button>
    </form>
  );
}

export function Header() {
  const { count } = useCart();
  const { items } = useSaved();
  const c = useConcept();
  const loc = useLocation();
  const cpath = useCPath();
  const isActive = (to: string) => loc.pathname.startsWith(cpath(to));
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="concept-strip" role="note">
        <Link to="/" className="concept-strip-back">← 비교 목록</Link>
        <span className="concept-strip-name">{CONCEPTS[c].name}</span>
        <span className="concept-strip-switch" aria-label="다른 방향 보기">
          {(['a', 'b', 'c'] as const).map((k) => (
            <Link key={k} to={loc.pathname.replace(`/concepts/${c}`, `/concepts/${k}`) + loc.search} className={k === c ? 'is-current' : ''} aria-current={k === c ? 'true' : undefined}>{k.toUpperCase()}</Link>
          ))}
        </span>
        <span className="concept-strip-demo">샘플 데이터 · 데모 장바구니 · 결제 미연결</span>
      </div>
      <div className="site-header-bar">
        <button className="icon-btn menu-btn" aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen((v) => !v)} aria-label="메뉴">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <CLink to="/" className="site-logo" aria-label="ODDLYS 홈">
          {c === 'c' && <OddlyMark size={34} mood="happy" className="site-logo-mark" />}
          <Wordmark />
        </CLink>
        <nav id="site-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="주요 메뉴">
          {NAV.map((n) => (
            <CLink key={n.to} to={n.to} className={`site-nav-link ${isActive(n.to) ? 'is-active' : ''}`} aria-current={isActive(n.to) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
              {n.label}
              {n.soon && <small className="site-nav-soon">준비 중</small>}
            </CLink>
          ))}
        </nav>
        <SearchBox className="site-header-search" />
        <div className="site-header-actions">
          <CLink to="/search" className="icon-btn search-btn" aria-label="검색">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </CLink>
          <CLink to="/saved" className="icon-btn" aria-label={`저장 목록 ${items.length}개`}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>
            {items.length > 0 && <span className="icon-count">{items.length}</span>}
          </CLink>
          <CLink to="/cart" className="icon-btn" aria-label={`장바구니 ${count}개`}>
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.4 11.5a2 2 0 0 0 2 1.5h8.7a2 2 0 0 0 2-1.5L22 8H6.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="20" r="1.5" fill="currentColor" /><circle cx="17" cy="20" r="1.5" fill="currentColor" /></svg>
            {count > 0 && <span className="icon-count">{count}</span>}
          </CLink>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Wordmark className="site-footer-logo" />
          <p className="site-footer-desc">좋아하는 것에 푹 빠진 사람들이 모여, 각자의 취향을 이야기하고 함께 즐기는 브랜드.</p>
        </div>
        <div>
          <p className="site-footer-h">둘러보기</p>
          <CLink to="/shop">샵</CLink>
          <CLink to="/sets">카드 도감</CLink>
          <CLink to="/stories">이야기</CLink>
          <CLink to="/live">라이브 안내</CLink>
        </div>
        <div>
          <p className="site-footer-h">안내</p>
          <CLink to="/about">소개</CLink>
          <CLink to="/help">배송 · 교환/반품 · 문의</CLink>
        </div>
        <div>
          <p className="site-footer-h">이 프리뷰에 대해</p>
          <p className="site-footer-small">상품·세트·카드·가격은 모두 샘플입니다. 장바구니는 이 브라우저에만 저장되며 결제는 연결되지 않았습니다. 사업자 정보·배송·환불 정책은 확정 전이라 표시하지 않습니다.</p>
        </div>
      </div>
    </footer>
  );
}
