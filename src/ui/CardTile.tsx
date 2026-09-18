import type { Printing } from '@/data/types';
import { RARITY_LABEL } from '@/data/types';
import { cardById } from '@/data/repo';
import { CardImage } from './Placeholder';
import { SaveButton } from './SaveButton';
import { CLink } from '@/concepts/concept';

export const ART_LABEL: Record<Printing['artVersion'], string> = { regular: '일반', alt: '얼터너티브 아트', full: '풀아트', parallel: '패러렐' };
export const FINISH_LABEL: Record<Printing['finish'], string> = { normal: '일반', holo: '홀로', reverse: '리버스', textured: '텍스처' };

export function CardTile({ printing, size = 'md', showReason }: { printing: Printing; size?: 'sm' | 'md' | 'lg'; showReason?: boolean }) {
  const card = cardById(printing.cardId)!;
  return (
    <article className={`card-tile card-tile-${size}`}>
      <CLink to={`/cards/${printing.id}`} className="card-tile-media" aria-label={`${card.name} ${printing.number} 카드 상세`}>
        <CardImage tone={printing.tone} number={printing.number} name={card.name} hasImage={printing.hasImage} big={size === 'lg'} />
        <SaveButton kind="printing" id={printing.id} compact className="card-tile-save" />
      </CLink>
      <div className="card-tile-body">
        <p className="card-tile-number mono">{printing.number}</p>
        <h3 className="card-tile-name"><CLink to={`/cards/${printing.id}`}>{card.name}</CLink></h3>
        <p className="card-tile-meta">
          <span className={`rarity rarity-${printing.rarity}`}>{printing.rarity}</span>
          <span> {RARITY_LABEL[printing.rarity]}</span>
          {printing.artVersion !== 'regular' && <span> · {ART_LABEL[printing.artVersion]}</span>}
        </p>
        {showReason && printing.editorialReason && (
          <p className="card-tile-reason">
            {printing.editorialTag && <span className="tag">{printing.editorialTag}</span>}
            {printing.editorialReason}
          </p>
        )}
      </div>
    </article>
  );
}
