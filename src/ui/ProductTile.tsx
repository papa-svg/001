import type { Product } from '@/data/types';
import { LANGUAGE_LABEL } from '@/data/types';
import { krw, minPrice, productStatus, productLanguages, gameLabel, setById } from '@/data/repo';
import { ProductImage } from './Placeholder';
import { StockBadge } from './Badge';
import { SaveButton } from './SaveButton';
import { CLink } from '@/concepts/concept';
import { useCart } from '@/state/cart';
import { useToast } from '@/state/toast';

/**
 * 상품 타일. 이미지·이름·언어/판본·판매 단위·가격·재고 상태가 항상 읽힌다(호버 의존 없음).
 * '빠른 담기'는 SKU가 하나이고 구매 가능할 때만.
 */
export function ProductTile({ product, dense, showSet }: { product: Product; dense?: boolean; showSet?: boolean }) {
  const { add } = useCart();
  const { show } = useToast();
  const status = productStatus(product);
  const langs = productLanguages(product);
  const single = product.skus.length === 1 ? product.skus[0]! : null;
  const canQuickAdd = single && single.status !== 'sold_out';
  const prices = product.skus.map((s) => s.price);
  const priceLabel = prices.length > 1 && Math.min(...prices) !== Math.max(...prices) ? `${krw(minPrice(product))}부터` : krw(minPrice(product));
  const set = product.setIds[0] ? setById(product.setIds[0]) : undefined;
  return (
    <article className={`product-tile ${dense ? 'is-dense' : ''}`} data-status={status}>
      <CLink to={`/products/${product.slug}`} className="product-tile-media" aria-label={product.name}>
        <ProductImage tone={product.imageTone} category={product.category} />
        <SaveButton kind="product" id={product.id} compact className="product-tile-save" />
        {status === 'sold_out' && <span className="product-tile-soldout">품절</span>}
      </CLink>
      <div className="product-tile-body">
        <p className="product-tile-meta">
          <span>{gameLabel(product.game)}</span>
          {langs.length > 0 && <span> · {langs.map((l) => LANGUAGE_LABEL[l]).join('/')}</span>}
          {showSet && set && <span> · {set.code}</span>}
        </p>
        <h3 className="product-tile-name"><CLink to={`/products/${product.slug}`}>{product.name}</CLink></h3>
        <p className="product-tile-unit">{single ? `${single.unit}${single.contents ? ` · ${single.contents}` : ''}` : `${product.skus.length}개 옵션`}</p>
        <div className="product-tile-foot">
          <span className="price product-tile-price">{priceLabel}</span>
          <StockBadge status={status} />
        </div>
        {canQuickAdd ? (
          <button type="button" className="btn btn-quiet product-tile-add" onClick={() => show(add(single.id).message)}>담기</button>
        ) : (
          <CLink to={`/products/${product.slug}`} className="btn btn-quiet product-tile-add">{status === 'sold_out' ? '상품 정보 보기' : '옵션 선택'}</CLink>
        )}
      </div>
    </article>
  );
}
