import { Routes, Route, Navigate } from 'react-router';
import { ConceptShell } from './concepts/Shell';
import { HomePage } from './concepts/Home';
import { ProductDetailPage } from './concepts/ProductDetail';
import { SetDetailPage } from './concepts/SetDetail';
import { ShopPage } from './pages/Shop';
import { SearchPage } from './pages/Search';
import { CartPage } from './pages/Cart';
import { CardDetailPage } from './pages/CardDetail';
import { SetsPage, StoriesPage, StoryDetailPage, SavedPage, MarketSoonPage, LivePage, AboutPage, HelpPage, NotFoundPage } from './pages/Misc';
import { CompareIndex } from './pages/CompareIndex';
import { ComparePage } from './pages/Compare';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<CompareIndex />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/concepts/:concept" element={<ConceptShell />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="sets" element={<SetsPage />} />
        <Route path="sets/:setId" element={<SetDetailPage />} />
        <Route path="cards/:printingId" element={<CardDetailPage />} />
        <Route path="market" element={<MarketSoonPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="stories/:slug" element={<StoryDetailPage />} />
        <Route path="live" element={<LivePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Navigate to="../cart" replace />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
