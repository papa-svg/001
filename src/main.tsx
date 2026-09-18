import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import './styles/base.css';
import './styles/concept-a.css';
import './styles/concept-b.css';
import './styles/concept-c.css';
import './styles/compare.css';
import { App } from './App';
import { CartProvider } from './state/cart';
import { SavedProvider } from './state/saved';
import { ToastProvider } from './state/toast';

/** 정적 호스팅(서버 fallback 없음)용 빌드는 VITE_ROUTER=hash. 기본은 BrowserRouter. */
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <SavedProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </SavedProvider>
      </ToastProvider>
    </Router>
  </StrictMode>,
);
