import { priceSummary, money, shortDate, PLATFORMS, MARKET_RULES } from '@/data/repo';
import type { PriceObservationView } from '@/data/types';
import { Badge } from './Badge';

const KIND_LABEL: Record<PriceObservationView['kind'], string> = { asking: '판매 호가', sold: '실거래가', index: '집계 시세' };
const platName = (id: string) => PLATFORMS.find((p) => p.id === id)?.name ?? id;

/**
 * 세트 안 '참고 시세 요약(샘플)'. 상태(표본 부족·갱신 지연·자료 없음·매칭 미확인)를 0원·0%로 대체하지 않는다.
 * 독립 시세 화면·차트는 기존 시세 DB 연결 단계에서 다룬다.
 */
export function PriceSummary({ printingId, compact }: { printingId: string; compact?: boolean }) {
  const s = priceSummary(printingId);
  return (
    <div className={`price-summary price-summary-${s.state} ${compact ? 'is-compact' : ''}`} aria-live="off">
      <div className="price-summary-head">
        <span className="price-summary-title">참고 시세</span>
        <Badge tone="demo">샘플</Badge>
        {s.reason && <Badge tone={s.state === 'stale' ? 'warn' : 'neutral'}>{s.reason}</Badge>}
      </div>
      {s.headline ? (
        <div className="price-summary-main">
          <span className="price-summary-kind">{KIND_LABEL[s.headline.kind]} · {s.headline.condition ?? '상태 미기재'}{s.headline.gradingCompany ? ` · ${s.headline.gradingCompany} ${s.headline.grade}` : ''}</span>
          <span className={`price price-summary-amount ${s.state !== 'ready' ? 'is-muted' : ''}`}>
            {money(s.headline.amount, s.headline.currency)}
            {s.headline.convertedAmount != null && <small> ≈ {money(s.headline.convertedAmount, 'KRW')}</small>}
          </span>
          <span className="price-summary-meta">
            {platName(s.headline.platformId)} · 표본 {s.headline.sampleSize ?? '?'}건
            {s.headline.aggregationMethod === 'median' ? ' 중앙값' : s.headline.aggregationMethod === 'min' ? ' 최저' : ''}
            {s.headline.periodStart && ` · ${shortDate(s.headline.periodStart)}–${shortDate(s.headline.periodEnd ?? null)}`}
            {s.headline.taxesKnown === false && ' · 배송비/세금 미포함 여부 미확인'}
          </span>
        </div>
      ) : (
        <p className="price-summary-empty">
          {s.reason === '자료 없음' && '아직 비교할 가격 정보가 없어요.'}
          {s.reason === '매칭 미확인' && '판본 매칭이 확인되지 않아 비교 결과에서 제외했어요.'}
          {s.reason === '최근 거래 없음' && '최근 확인된 거래가 없어요. 호가만 있어요.'}
        </p>
      )}
      {!compact && s.asking && (
        <p className="price-summary-asking">{KIND_LABEL.asking} 최저 {money(s.asking.amount, s.asking.currency)} · {platName(s.asking.platformId)} · 매물 {s.asking.sampleSize ?? '?'}건 <span className="muted">(아직 팔리지 않은 가격)</span></p>
      )}
      {!compact && s.state === 'stale' && <p className="price-summary-note">최근 갱신이 지연되고 있어요. 마지막 확인 시각을 참고해 주세요.</p>}
      {!compact && s.reason === '표본 부족' && <p className="price-summary-note">표본이 {MARKET_RULES.minSampleSize}건 미만이라 순위·비교에 넣지 않았어요.</p>}
      <p className="price-summary-asof">
        {s.asOf ? `마지막 확인 ${shortDate(s.asOf)}` : '확인 시각 없음'} · 관측 범위: {PLATFORMS.map((p) => `${p.name}(${p.market})`).join(', ')}
      </p>
    </div>
  );
}
