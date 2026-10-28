import type { CSSProperties } from 'react';

import { hueFromTitle } from '@/lib/hue';

/** Generated cover for missing art: hue + layout come from the title, never grey. */
export function Art({ title, showTitle = true }: { title: string; showTitle?: boolean }) {
  const variant = hueFromTitle(title + '!') % 4;
  const cls = variant === 0 ? 'art' : `art v${variant}`;
  return (
    <div className={cls} style={{ '--h': hueFromTitle(title), position: 'absolute', inset: 0 } as CSSProperties}>
      {showTitle ? <span className="cover-title">{title}</span> : null}
    </div>
  );
}
