import type { ReactNode } from 'react';
import { CLink } from '@/concepts/concept';

export function Section({ id, kicker, title, lead, more, children, className }: { id?: string; kicker?: string; title: ReactNode; lead?: ReactNode; more?: { to: string; label: string }; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`section ${className ?? ''}`} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="section-head">
        <div>
          {kicker && <p className="section-kicker">{kicker}</p>}
          <h2 id={id ? `${id}-title` : undefined} className="section-title">{title}</h2>
          {lead && <p className="section-lead">{lead}</p>}
        </div>
        {more && <CLink to={more.to} className="section-more">{more.label} →</CLink>}
      </header>
      {children}
    </section>
  );
}
