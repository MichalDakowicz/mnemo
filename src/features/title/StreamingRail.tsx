import type { CSSProperties } from 'react';

import { getServiceStyle, isPopularService, normalizeAvailability, onDarkColor, POPULAR_SERVICES } from '@/lib/services';

/** Icons for where it streams: only the services most people have (lib/services POPULAR_SERVICES), in their usual order. */
export function StreamingRail({ availability, logos }: { availability: string[]; logos: Record<string, string> }) {
  const have = new Set(normalizeAvailability(availability).filter(isPopularService));
  const shown = POPULAR_SERVICES.filter((s) => have.has(s));
  if (shown.length === 0) return null;
  return (
    <ul className="ti-rail" aria-label="Streaming on">
      {shown.map((name) => {
        const st = getServiceStyle(name);
        return (
          <li key={name} title={name} style={{ '--svc': onDarkColor(st.color), '--svc-ink': st.textColor } as CSSProperties}>
            {logos[name] ? <img src={logos[name]} alt="" loading="lazy" /> : <span aria-hidden="true">{st.short}</span>}
            <span className="sr">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
