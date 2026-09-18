import { useEffect, useId, useState } from 'react';
import type { Product, SKU } from '@/data/types';
import { LANGUAGE_LABEL } from '@/data/types';
import { krw, STOCK_LABEL, gameLabel, setById } from '@/data/repo';
import { useCart } from '@/state/cart';
import { useToast } from '@/state/toast';
import { StockBadge } from './Badge';
import { SaveButton } from './SaveButton';
import { CLink, useCPath } from '@/concepts/concept';
import { useNavigate } from 'react-router';

/**
 * 구매 패널 — 세 방향이 같은 로직·같은 순서를 쓴다.
 * 상품명 / 게임·세트 / 언어·지역판 / 팩·박스 / 실제 구성 / 판매가 / 재고·예약 상태 / 배송 안내 / 옵션·수량 / 장바구니·구매
 */
export function useBuyState(product: Product) {
  const [skuId, setSkuId] = useState<string | null>(product.skus.length === 1 ? product.skus[0]!.id : null);
  const [qty, setQty] = useState(1);
  useEffect(() => { setSkuId(product.skus.length === 1 ? product.skus[0]!.id : null); setQty(1); }, [product.id, product.skus]);
  const sku = product.skus.find((s) => s.id === skuId) ?? null;
  const maxQty = sku?.stock ?? 99;
  return { sku, skuId, setSkuId, qty, setQty: (n: number) => setQty(Math.min(Math.max(1, n), Math.max(1, maxQty))), maxQty };
}

export type BuyState = ReturnType<typeof useBuyState>;

export function SKUSelector({ product, state }: { product: Product; state: BuyState }) {
  const gid = useId();
  if (product.skus.length <= 1) return null;
  const groupLabel = product.optionGroups?.[0]?.label ?? '옵션';
  return (
    <fieldset className="sku-selector">
      <legend className="field-label">{groupLabel} <span className="field-required">(선택 필요)</span></legend>
      <div className="sku-options" role="radiogroup" aria-labelledby={gid}>
        {product.skus.map((s) => (
          <label key={s.id} className={`sku-option ${state.skuId === s.id ? 'is-selected' : ''} ${s.status === 'sold_out' ? 'is-soldout' : ''}`}>
            <input type="radio" name={`sku-${product.id}`} value={s.id} checked={state.skuId === s.id} onChange={() => state.setSkuId(s.id)} disabled={s.status === 'sold_out'} />
            <span className="sku-option-label">{s.label}</span>
            <span className="sku-option-price">{krw(s.price)}</span>
            <span className="sku-option-status">{STOCK_LABEL[s.status]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function QuantityInput({ state, id }: { state: BuyState; id: string }) {
  const disabled = !state.sku || state.sku.status === 'sold_out';
  return (
    <div className="qty">
      <label className="field-label" htmlFor={id}>수량</label>
      <div className="qty-control">
        <button type="button" onClick={() => state.setQty(state.qty - 1)} disabled={disabled || state.qty <= 1} aria-label="수량 줄이기">−</button>
        <input id={id} type="number" inputMode="numeric" min={1} max={state.maxQty} value={state.qty} onChange={(e) => state.setQty(Number(e.target.value) || 1)} disabled={disabled} />
        <button type="button" onClick={() => state.setQty(state.qty + 1)} disabled={disabled || state.qty >= state.maxQty} aria-label="수량 늘리기">+</button>
      </div>
      {state.sku?.stock != null && state.sku.status !== 'sold_out' && <p className="field-hint">{state.sku.status === 'low_stock' ? `남은 재고 ${state.sku.stock}개` : `최대 ${state.maxQty}개`}</p>}
    </div>
  );
}

export function useAddToCart(product: Product, state: BuyState) {
  const { add } = useCart();
  const { show } = useToast();
  const nav = useNavigate();
  const cpath = useCPath();
  const canBuy = !!state.sku && state.sku.status !== 'sold_out';
  const needsOption = product.skus.length > 1 && !state.sku;
  const addToCart = () => {
    if (needsOption) { show('옵션을 먼저 선택해 주세요.'); return false; }
    if (!state.sku) return false;
    const r = add(state.sku.id, state.qty);
    show(r.message, r.ok ? { label: '장바구니 보기', onClick: () => nav(cpath('/cart')) } : undefined);
    return r.ok;
  };
  const buyNow = () => { if (addToCart()) nav(cpath('/cart')); };
  return { canBuy, needsOption, addToCart, buyNow };
}

export function BuyPanel({ product, state, variant = 'default' }: { product: Product; state: BuyState; variant?: 'default' | 'compact' }) {
  const qid = useId();
  const { canBuy, needsOption, addToCart, buyNow } = useAddToCart(product, state);
  const { shippingNote } = useCart();
  const set = product.setIds[0] ? setById(product.setIds[0]) : undefined;
  const sku: SKU | null = state.sku;
  const langs = [...new Set(product.skus.map((s) => s.language).filter(Boolean))];
  return (
    <section className={`buy-panel buy-panel-${variant}`} aria-labelledby="buy-title">
      <p className="buy-panel-kicker">
        {gameLabel(product.game)}
        {set && <> · <CLink to={`/sets/${set.id}`}>{set.name} <span className="mono">{set.code}</span></CLink></>}
      </p>
      <h1 id="buy-title" className="buy-panel-title">{product.name}</h1>
      <dl className="buy-panel-facts">
        {langs.length > 0 && <><dt>언어·지역판</dt><dd>{langs.map((l) => LANGUAGE_LABEL[l!]).join(' / ')}{sku?.region ? ` (${sku.region})` : ''}</dd></>}
        <dt>판매 단위</dt><dd>{sku ? sku.unit : product.skus.length > 1 ? '옵션에 따라 다름' : product.skus[0]!.unit}</dd>
        <dt>구성</dt><dd>{sku ? (sku.contents ?? <span className="muted">미확인 — 출처 확인 전</span>) : product.skus[0]!.contents ?? <span className="muted">미확인</span>}</dd>
      </dl>
      <div className="buy-panel-price-row">
        <span className="price price-lg" aria-live="polite">{sku ? krw(sku.price) : `${krw(Math.min(...product.skus.map((s) => s.price)))}부터`}</span>
        {sku && <StockBadge status={sku.status} />}
      </div>
      {sku?.shippingNote && <p className="buy-panel-note buy-panel-note-preorder">{sku.shippingNote}</p>}
      <p className="buy-panel-shipping">배송비: {shippingNote}</p>
      <SKUSelector product={product} state={state} />
      <QuantityInput state={state} id={qid} />
      <div className="buy-panel-actions">
        <button type="button" className="btn btn-secondary btn-lg" onClick={addToCart} disabled={!canBuy && !needsOption} aria-disabled={!canBuy && !needsOption}>
          {sku?.status === 'sold_out' ? '품절' : '장바구니에 담기'}
        </button>
        <button type="button" className="btn btn-primary btn-lg" onClick={buyNow} disabled={!canBuy && !needsOption}>
          {sku?.status === 'preorder' ? '예약하기' : '구매하기'}
        </button>
      </div>
      <p className="buy-panel-demo">데모: 실제 주문·결제는 연결되지 않았어요. 미개봉 배송 기준. 라이브 개봉은 회차가 정해지면 별도 선택으로 추가됩니다.</p>
      <div className="buy-panel-save"><SaveButton kind="product" id={product.id} label="관심 상품 저장" /></div>
    </section>
  );
}

/** 모바일 하단 구매 바 — 선택된 SKU·가격을 반영. 다른 요소를 가리지 않게 본문 하단 여백을 둔다. */
export function MobileBuyBar({ product, state }: { product: Product; state: BuyState }) {
  const { canBuy, needsOption, addToCart, buyNow } = useAddToCart(product, state);
  const sku = state.sku;
  return (
    <div className="mobile-buy-bar" role="region" aria-label="구매">
      <div className="mobile-buy-bar-info">
        <span className="mobile-buy-bar-sku">{sku ? `${sku.label}${state.qty > 1 ? ` × ${state.qty}` : ''}` : '옵션을 선택하세요'}</span>
        <span className="price">{sku ? krw(sku.price * state.qty) : `${krw(Math.min(...product.skus.map((s) => s.price)))}부터`}</span>
      </div>
      <button type="button" className="btn btn-secondary" onClick={addToCart} disabled={!canBuy && !needsOption}>담기</button>
      <button type="button" className="btn btn-primary" onClick={buyNow} disabled={!canBuy && !needsOption}>{sku?.status === 'preorder' ? '예약' : sku?.status === 'sold_out' ? '품절' : '구매'}</button>
    </div>
  );
}
