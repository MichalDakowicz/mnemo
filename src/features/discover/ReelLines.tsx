import { reelSlot, slotOffset } from '@/lib/discoverReel';

import type { ReelHover, useReel } from './useReel';

// Hand-drawn strokes around the hovered poster, three sets (Matro's LINES); one is drawn per hover.
const LINES = [
  ['M 92 52 C 220 14, 388 18, 438 128 C 468 206, 458 336, 432 426', 'M 452 96 C 464 118, 470 146, 466 176', 'M 38 258 C 24 290, 24 330, 40 362', 'M 18 280 C 10 310, 12 338, 24 362'],
  ['M 30 300 C 12 420, 40 566, 152 618 C 224 646, 306 640, 368 624', 'M 384 34 C 404 38, 424 48, 436 64', 'M 400 16 C 422 22, 442 36, 454 54'],
  ['M 126 30 C 266 2, 428 34, 446 204', 'M 454 236 C 468 336, 446 476, 386 566', 'M 32 118 C 20 150, 18 182, 26 212'],
];

type Props = { reel: ReturnType<typeof useReel>; hover: ReelHover | null };

/** Sits above the posters and follows the hovered one; remounting per hover restarts the draw-in. */
export function ReelLines({ reel, hover }: Props) {
  let style;
  if (hover) {
    const s = reelSlot(slotOffset(hover.slot, reel.pos, reel.slots), reel.slots / 2, reel.frame);
    style = { transform: `translate(-50%, -50%) translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) rotate(${s.rotate.toFixed(2)}deg) scale(${(s.scale * 1.035).toFixed(3)})` };
  }
  return (
    <div className="reel-top" aria-hidden="true">
      <svg key={hover?.run ?? 0} className={hover ? 'reel-lines draw' : 'reel-lines'} viewBox="0 0 470 650" style={{ ...style, opacity: hover ? 1 : 0 }}>
        {(hover ? LINES[hover.variant] : []).map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </div>
  );
}
