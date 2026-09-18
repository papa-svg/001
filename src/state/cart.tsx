import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJSON, writeJSON } from './storage';
import { PRODUCTS } from '@/data/fixtures/products';
import type { SKU, Product } from '@/data/types';

/**
 * 장바구니 상태 — 세 방향(A/B/C)이 동일하게 공유하는 구매 로직.
 * 로컬 저장(데모). 결제·주문은 연결되지 않았다.
 */
export interface CartLine {
  skuId: string;
  qty: number;
  /** 개봉 방식. 현재는 미개봉 배송만 제공. 라이브 개봉은 회차가 정해질 때 추가. */
  openMode: 'sealed';
  addedAt: string;
}

export interface CartLineView extends CartLine {
  sku: SKU;
  product: Product;
  lineTotal: number;
  issue?: '품절' | '재고 초과' | '예약 상품';
}

interface CartApi {
  lines: CartLineView[];
  count: number;
  subtotal: number;
  shippingFee: number;
  shippingNote: string;
  add: (skuId: string, qty?: number) => { ok: boolean; message: string };
  setQty: (skuId: string, qty: number) => void;
  remove: (skuId: string) => void;
  undoRemove: () => void;
  lastRemoved: CartLineView | null;
  clear: () => void;
  hasPreorderMix: boolean;
}

const KEY = 'oddlys.cart.v1';
/** 임시 배송 정책(샘플): 50,000원 이상 무료, 미만 3,000원. 확정 정책이 아니다. */
export const SHIPPING_RULE = { fee: 3000, freeFrom: 50000, label: '샘플 배송 정책' };

const CartCtx = createContext<CartApi | null>(null);

const findSku = (skuId: string) => {
  for (const p of PRODUCTS) {
    const s = p.skus.find((x) => x.id === skuId);
    if (s) return { sku: s, product: p };
  }
  return null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(() => readJSON<CartLine[]>(KEY, []));
  const [lastRemoved, setLastRemoved] = useState<CartLineView | null>(null);
  useEffect(() => writeJSON(KEY, raw), [raw]);

  const lines = useMemo<CartLineView[]>(() => {
    return raw.flatMap((l) => {
      const f = findSku(l.skuId);
      if (!f) return [];
      let issue: CartLineView['issue'];
      if (f.sku.status === 'sold_out') issue = '품절';
      else if (f.sku.stock != null && l.qty > f.sku.stock) issue = '재고 초과';
      else if (f.sku.status === 'preorder') issue = '예약 상품';
      return [{ ...l, sku: f.sku, product: f.product, lineTotal: f.sku.price * l.qty, issue }];
    });
  }, [raw]);

  const subtotal = lines.filter((l) => l.issue !== '품절').reduce((a, l) => a + l.lineTotal, 0);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const shippingFee = subtotal === 0 || subtotal >= SHIPPING_RULE.freeFrom ? 0 : SHIPPING_RULE.fee;
  const hasPreorderMix = lines.some((l) => l.sku.status === 'preorder') && lines.some((l) => l.sku.status !== 'preorder');

  const add = useCallback<CartApi['add']>((skuId, qty = 1) => {
    const f = findSku(skuId);
    if (!f) return { ok: false, message: '상품을 찾을 수 없어요.' };
    if (f.sku.status === 'sold_out') return { ok: false, message: '품절된 상품이에요.' };
    let message = '장바구니에 담았어요.';
    setRaw((prev) => {
      const cur = prev.find((l) => l.skuId === skuId);
      const nextQty = (cur?.qty ?? 0) + qty;
      if (f.sku.stock != null && nextQty > f.sku.stock) {
        message = `재고가 ${f.sku.stock}개예요. 담을 수 있는 최대 수량으로 맞췄어요.`;
        const capped = f.sku.stock;
        return cur ? prev.map((l) => (l.skuId === skuId ? { ...l, qty: capped } : l)) : [...prev, { skuId, qty: capped, openMode: 'sealed', addedAt: new Date().toISOString() }];
      }
      return cur ? prev.map((l) => (l.skuId === skuId ? { ...l, qty: nextQty } : l)) : [...prev, { skuId, qty, openMode: 'sealed', addedAt: new Date().toISOString() }];
    });
    return { ok: true, message };
  }, []);

  const setQty = useCallback((skuId: string, qty: number) => {
    setRaw((prev) => prev.map((l) => (l.skuId === skuId ? { ...l, qty: Math.max(1, qty) } : l)));
  }, []);
  const remove = useCallback((skuId: string) => {
    setRaw((prev) => {
      const target = lines.find((l) => l.skuId === skuId) ?? null;
      setLastRemoved(target);
      return prev.filter((l) => l.skuId !== skuId);
    });
  }, [lines]);
  const undoRemove = useCallback(() => {
    if (!lastRemoved) return;
    const { skuId, qty, openMode, addedAt } = lastRemoved;
    setRaw((prev) => (prev.some((l) => l.skuId === skuId) ? prev : [...prev, { skuId, qty, openMode, addedAt }]));
    setLastRemoved(null);
  }, [lastRemoved]);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartApi>(() => ({ lines, count, subtotal, shippingFee, shippingNote: `${SHIPPING_RULE.freeFrom.toLocaleString('ko-KR')}원 이상 무료배송 · 미만 ${SHIPPING_RULE.fee.toLocaleString('ko-KR')}원 (${SHIPPING_RULE.label})`, add, setQty, remove, undoRemove, lastRemoved, clear, hasPreorderMix }), [lines, count, subtotal, shippingFee, add, setQty, remove, undoRemove, lastRemoved, clear, hasPreorderMix]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('CartProvider missing');
  return ctx;
}
