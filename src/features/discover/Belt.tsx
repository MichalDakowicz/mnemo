/* eslint-disable react-hooks/refs -- the lint rule mistakes the belt hook's result for a ref; its handlers only read refs inside events */
import type { ReactNode } from 'react';

import './belt.css';
import { useBelt } from './useBelt';

type Props<T> = {
  items: T[];
  keyOf: (item: T) => string;
  render: (item: T) => ReactNode;
  cardWidth: number;
  label: string;
  /** Lets the owner put arrow buttons elsewhere (the row heading). */
  belt: ReturnType<typeof useBelt>;
  /** Px tall; the default suits Discover's cards, which carry buttons under the poster. */
  height?: number;
};

/** The belt itself: one card per slot, repeated until the loop is longer than the screen (a belt with ends has one slot per card). Positions come from useBelt. */
export function Belt<T>({ items, keyOf, render, cardWidth, label, belt, height }: Props<T>) {
  const n = items.length;
  return (
    <div
      ref={belt.bind}
      className={belt.dragging ? 'belt dragging' : 'belt'}
      style={height ? { height } : undefined}
      tabIndex={-1}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      {...belt.handlers}
    >
      {Array.from({ length: belt.slots }, (_, slot) => {
        const item = items[slot % n];
        const copy = slot >= n;
        return (
          <div key={`${keyOf(item)}-${slot}`} className="belt-card" data-slot={slot} style={{ width: cardWidth }} inert={copy} aria-hidden={copy ? true : undefined}>
            {render(item)}
          </div>
        );
      })}
    </div>
  );
}
