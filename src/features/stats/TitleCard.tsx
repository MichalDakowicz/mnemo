import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Poster } from '@/components/media/Poster';

import './titleCard.css';

type Props = {
  title: string;
  coverUrl?: string | null;
  meta?: ReactNode;
  /** Route to open; a title without a TMDB id has none and renders static. */
  to?: string | null;
  /** Overlay on the poster (rank badge). */
  badge?: ReactNode;
  /** Shown under the poster in place of the title, which then only names the link for screen readers. */
  caption?: ReactNode;
};

// Poster + title + meta line. Poster is static inside, the card itself is the link.
export function TitleCard({ title, coverUrl, meta, to, badge, caption }: Props) {
  const body = (
    <>
      <Poster title={title} coverUrl={coverUrl}>
        {badge}
      </Poster>
      <span className="t">{caption ?? title}</span>
      {meta ? <span className="m">{meta}</span> : null}
    </>
  );
  if (to) {
    return (
      <Link className="title-card" to={to} aria-label={caption ? `${title}, ${typeof caption === 'string' ? caption : ''}`.replace(/, $/, '') : undefined}>
        {body}
      </Link>
    );
  }
  return <div className="title-card">{body}</div>;
}
