import { useCart } from '@/state/cart';
import { krw } from '@/data/repo';
import { ProductImage } from '@/ui/Placeholder';
import { EmptyState } from '@/ui/States';
import { CLink } from '@/concepts/concept';
import { StockBadge } from '@/ui/Badge';

export function CartPage() {
  const cart = useCart();
  return (
    <main className="page cart-page">
      <header className="page-head"><h1 className="page-title">장바구니</h1><p className="page-lead muted">이 브라우저에만 저장돼요. 결제는 연결되지 않은 데모입니다.</p></header>
      {cart.lastRemoved && (
        <div className="notice" role="status">‘{cart.lastRemoved.product.name}’을 삭제했어요. <button className="link-btn" onClick={cart.undoRemove}>되돌리기</button></div>
      )}
      {cart.lines.length === 0 ? (
        <EmptyState title="장바구니가 비어 있어요." hint="구경하다 마음에 드는 것이 있으면 담아 두세요." actions={<><CLink to="/shop" className="btn btn-primary">샵 보기</CLink><CLink to="/saved" className="btn btn-secondary">저장 목록</CLink></>} />
      ) : (
        <div className="cart-layout">
          <ul className="cart-lines">
            {cart.lines.map((l) => (
              <li key={l.skuId} className={`cart-line ${l.issue === '품절' ? 'is-soldout' : ''}`}>
                <CLink to={`/products/${l.product.slug}`} className="cart-line-media"><ProductImage tone={l.product.imageTone} category={l.product.category} /></CLink>
                <div className="cart-line-body">
                  <CLink to={`/products/${l.product.slug}`} className="cart-line-name">{l.product.name}</CLink>
                  <p className="cart-line-meta">{l.sku.label !== l.product.name && l.sku.label} · {l.sku.unit}{l.sku.contents ? ` · ${l.sku.contents}` : ''} · 미개봉 배송</p>
                  {l.issue && <p className={`cart-line-issue issue-${l.issue}`}><StockBadge status={l.sku.status} /> {l.issue === '재고 초과' && `재고 ${l.sku.stock}개 — 수량을 줄여 주세요.`}{l.issue === '예약 상품' && (l.sku.shippingNote ?? '예약 상품')}{l.issue === '품절' && '품절되어 주문할 수 없어요. 세트 정보는 계속 볼 수 있어요.'}</p>}
                  <div className="cart-line-controls">
                    <div className="qty-control">
                      <button type="button" onClick={() => cart.setQty(l.skuId, l.qty - 1)} disabled={l.qty <= 1} aria-label="수량 줄이기">−</button>
                      <input type="number" min={1} value={l.qty} onChange={(e) => cart.setQty(l.skuId, Number(e.target.value) || 1)} aria-label="수량" />
                      <button type="button" onClick={() => cart.setQty(l.skuId, l.qty + 1)} aria-label="수량 늘리기">+</button>
                    </div>
                    <span className="price">{krw(l.lineTotal)}</span>
                    <button type="button" className="link-btn" onClick={() => cart.remove(l.skuId)}>삭제</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="cart-summary" aria-label="주문 요약">
            <h2>주문 요약</h2>
            <dl>
              <dt>상품 금액</dt><dd>{krw(cart.subtotal)}</dd>
              <dt>배송비</dt><dd>{cart.shippingFee === 0 ? '무료' : krw(cart.shippingFee)}</dd>
              <dt className="total">합계</dt><dd className="total price">{krw(cart.subtotal + cart.shippingFee)}</dd>
            </dl>
            <p className="muted small">{cart.shippingNote}</p>
            {cart.hasPreorderMix && <p className="notice small">예약 상품과 일반 재고가 함께 있어요. 실제 서비스에서는 발송 시점이 달라 분리 배송 또는 합배송 선택이 필요합니다.</p>}
            <button type="button" className="btn btn-primary btn-lg" disabled aria-describedby="checkout-demo">주문하기</button>
            <p id="checkout-demo" className="muted small">데모: 결제·주문은 4단계(실제 서비스 연결)에서 연결됩니다.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
