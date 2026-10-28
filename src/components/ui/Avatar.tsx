import type { CSSProperties } from 'react';

import { hueFromTitle } from '@/lib/hue';

export function Avatar({ name, pfp, size = 40 }: { name: string; pfp?: string | null; size?: number }) {
  const style = { '--h': hueFromTitle(name), width: size, height: size, fontSize: size * 0.4 } as CSSProperties;
  return (
    <span className={pfp ? 'avatar' : 'avatar art'} style={style}>
      {pfp ? <img src={pfp} alt={name} /> : (name[0] ?? '?').toUpperCase()}
    </span>
  );
}
