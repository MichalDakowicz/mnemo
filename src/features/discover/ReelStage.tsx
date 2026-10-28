/* eslint-disable react-hooks/refs -- the lint rule mistakes the reel hook's result for a ref; its handlers only read refs inside events */
import type { CSSProperties } from 'react';

import { Art } from '@/components/media/Art';
import { reelSlot, slotOffset } from '@/lib/discoverReel';
import { artVariant } from '@/lib/artVariant';

import { ReelLines } from './ReelLines';
import type { ReelItem, useReel } from './useReel';

type Props<T extends ReelItem> = {
  items: T[];
  reel: ReturnType<typeof useReel>;
  label: string;
  onOpen: (item: T) => void;
};

/** The coverflow: every poster is placed from its slot distance to the centre (lib/discoverReel). */
export function ReelStage<T extends ReelItem>({ items, reel, label, onOpen }: Props<T>) {
  const n = items.length;
  const { frame, pos, slots, hover } = reel;
  const classes = ['reel', reel.moving ? 'animating' : '', reel.dragging ? 'dragging' : ''].filter(Boolean).join(' ');
  return (
    <>
      <div
        ref={reel.bind}
        className={classes}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        {...reel.handlers}
        onKeyDown={(e) => {
          reel.handlers.onKeyDown(e);
          if (e.key === 'Enter' && e.target === e.currentTarget && items[reel.centre]) {
            e.preventDefault();
            onOpen(items[reel.centre]);
          }
        }}
      >
        <div className={hover ? 'reel-glow hot' : 'reel-glow'} aria-hidden="true" style={{ transform: `translate(-50%, -50%) scale(${frame.k.toFixed(3)})` }}>
          <span className={reel.glowOn === 0 ? 'on' : ''} style={{ background: reel.glow[0] }} />
          <span className={reel.glowOn === 1 ? 'on' : ''} style={{ background: reel.glow[1] }} />
        </div>
        {Array.from({ length: slots }, (_, slot) => {
          const item = items[slot % n];
          const off = slotOffset(slot, pos, slots);
          const s = reelSlot(off, slots / 2, frame);
          const tilt = hover && hover.slot === slot ? hover : null;
          const style = {
            transform: `translate(-50%, -50%) translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) perspective(900px) rotateX(${tilt ? tilt.rx.toFixed(2) : 0}deg) rotateY(${tilt ? tilt.ry.toFixed(2) : 0}deg) rotate(${s.rotate.toFixed(2)}deg) scale(${(s.scale * (tilt ? 1.05 : 1)).toFixed(3)})`,
            zIndex: s.zIndex,
            opacity: s.opacity.toFixed(3),
            filter: `brightness(${s.brightness.toFixed(3)}) saturate(${s.saturate.toFixed(3)})`,
            visibility: s.opacity < 0.01 ? 'hidden' : 'visible',
            pointerEvents: s.opacity < 0.5 ? 'none' : 'auto',
            ...(tilt ? { '--gx': `${tilt.gx}%`, '--gy': `${tilt.gy}%` } : {}),
          } as CSSProperties;
          return (
            <button
              key={slot}
              type="button"
              tabIndex={-1}
              data-slot={slot}
              className={`reel-poster ${artVariant(item.title)}${tilt ? ' tilting' : ''}`}
              style={style}
              aria-hidden={slot >= n ? true : undefined}
              aria-label={`${item.title}, ${off === 0 ? 'open' : 'show'}`}
              onClick={() => {
                if (reel.pick(slot)) onOpen(item);
              }}
            >
              {item.coverUrl ? <img src={item.coverUrl} alt="" draggable={false} /> : <Art title={item.title} />}
              <span className="glare" />
            </button>
          );
        })}
      </div>
      <ReelLines reel={reel} hover={hover} />
    </>
  );
}
