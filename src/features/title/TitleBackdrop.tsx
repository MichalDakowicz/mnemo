import type { CSSProperties } from 'react';

import { hueFromTitle } from '@/lib/hue';

/** Hero art behind the head: the TMDB backdrop, or the generated cover with the title as a watermark. */
export function TitleBackdrop({ title, url }: { title: string; url: string | null }) {
  return (
    <div className={url ? 'ti-hero' : 'ti-hero art v3'} style={{ '--h': hueFromTitle(title) } as CSSProperties} aria-hidden="true">
      {url ? <img src={url} alt="" /> : <span className="ti-hero-mark">{title}</span>}
      <span className="ti-hero-fade" />
    </div>
  );
}
