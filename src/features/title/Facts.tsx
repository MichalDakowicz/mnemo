import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { NamedRef } from '@/types/movie';

export type Fact = { label: string; value: ReactNode; sub?: ReactNode };

/** Facts with nothing to say are dropped rather than shown as dashes. */
export function FactGrid({ facts }: { facts: (Fact | boolean | string | null | undefined)[] }) {
  const shown = facts.filter((f): f is Fact => typeof f === 'object' && f !== null && f.value !== '' && f.value != null);
  return (
    <div className="ti-facts">
      {shown.map((f) => (
        <div key={f.label}>
          <p>{f.label}</p>
          <strong>{f.value}</strong>
          {f.sub ? <small>{f.sub}</small> : null}
        </div>
      ))}
    </div>
  );
}

/** Names that link to a route when they carry an id, comma separated. */
export function NameLinks({ items, to }: { items: NamedRef[]; to: (id: number) => string }) {
  return (
    <>
      {items.map((p, i) => (
        <span key={`${p.id ?? p.name}-${i}`}>
          {i > 0 ? ', ' : ''}
          {p.id ? <Link to={to(p.id)}>{p.name}</Link> : p.name}
        </span>
      ))}
    </>
  );
}

export const personTo = (id: number) => `/person/${id}`;
export const studioTo = (id: number) => `/studio/${id}`;
