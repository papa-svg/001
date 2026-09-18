import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ConceptProvider, useConceptFromRoute } from './concept';
import { Header, Footer } from '@/ui/Header';
import { Toasts } from '@/ui/Toasts';

/** 방향별 셸. data-concept 속성으로 표현 계층(CSS)만 바뀌고, 라우팅·상태·구매 로직은 공유한다. */
export function ConceptShell() {
  const c = useConceptFromRoute();
  const loc = useLocation();
  useEffect(() => {
    document.documentElement.dataset.concept = c;
    return () => { delete document.documentElement.dataset.concept; };
  }, [c]);
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1));
      if (el) { el.scrollIntoView({ block: 'start' }); return; }
    }
    window.scrollTo({ top: 0 });
  }, [loc.pathname, loc.hash]);
  return (
    <ConceptProvider value={c}>
      <div className="site" data-concept={c}>
        <a href="#main" className="skip-link">본문으로 건너뛰기</a>
        <Header />
        <div id="main" className="site-main">
          <Outlet />
        </div>
        <Footer />
        <Toasts />
      </div>
    </ConceptProvider>
  );
}
