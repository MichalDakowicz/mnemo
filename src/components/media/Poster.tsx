import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Art } from './Art';

type Props = {
  title: string;
  coverUrl?: string | null;
  /** Internal route; renders a link. Omit for a static poster. */
  to?: string;
  onClick?: () => void;
  children?: ReactNode;
};

// 2:3, 6px radius, soft diagonal sheen, lifts on hover. Missing art -> generated cover.
export function Poster({ title, coverUrl, to, onClick, children }: Props) {
  const inner = (
    <>
      {coverUrl ? <img src={coverUrl} alt={title} loading="lazy" /> : <Art title={title} />}
      {children}
    </>
  );
  if (to) return <Link className="poster" to={to} aria-label={title}>{inner}</Link>;
  if (onClick) return <button type="button" className="poster" onClick={onClick} aria-label={title}>{inner}</button>;
  return <div className="poster">{inner}</div>;
}
