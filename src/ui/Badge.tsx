import type { StockStatus } from '@/data/types';
import { STOCK_LABEL } from '@/data/repo';

export function StockBadge({ status, className }: { status: StockStatus; className?: string }) {
  return (
    <span className={`badge badge-stock badge-stock-${status} ${className ?? ''}`} data-status={status}>
      {status === 'sold_out' ? '✕ ' : status === 'preorder' ? '◷ ' : status === 'low_stock' ? '! ' : ''}
      {STOCK_LABEL[status]}
    </span>
  );
}
export function Badge({ children, tone = 'neutral', className }: { children: React.ReactNode; tone?: 'neutral' | 'brand' | 'demo' | 'warn' | 'ink'; className?: string }) {
  return <span className={`badge badge-${tone} ${className ?? ''}`}>{children}</span>;
}
export function DemoTag({ children = '샘플 데이터' }: { children?: React.ReactNode }) {
  return <Badge tone="demo">{children}</Badge>;
}
