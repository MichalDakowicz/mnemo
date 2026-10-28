import { useState, type CSSProperties } from 'react';

import { hueFromTitle } from '@/lib/hue';

/** Hero art behind the head: the TMDB backdrop (it settles in once loaded), or the generated cover with the title as a watermark. */
export function TitleBackdrop({ title, url, pending = false }: { title: string; url: string | null; pending?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  if (pending) return <div className="ti-hero" aria-hidden="true"><span className="ti-hero-fade" /></div>;
  const classes = url ? `ti-hero${loaded ? ' ready' : ''}` : 'ti-hero ready art v3';
  return (
    <div className={classes} style={{ '--h': hueFromTitle(title) } as CSSProperties} aria-hidden="true">
      {url ? (
        <img
          src={url}
          alt=""
          ref={(img) => {
            if (img?.complete && img.naturalWidth > 0) setLoaded(true);
          }}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <span className="ti-hero-mark">{title}</span>
      )}
      <span className="ti-hero-fade" />
    </div>
  );
}
