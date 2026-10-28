// Geometry of Discover's trending reel (port of the artboard's coverflow maths).
// Pure so it can be tested: given a slot offset from the centre and the frame, it
// returns where one poster sits.

export const POSTER_W = 340;
export const POSTER_H = 510;

const scale = (a: number) => 1 / (1 + 0.15 * a + 0.022 * a * a);

const REACH: number[] = [0];
for (let i = 1; i <= 64; i++) {
  const t = i / 4;
  REACH.push(REACH[i - 1] + (POSTER_W * 0.8 * 0.25 * (scale(t - 0.25) + scale(t))) / 2);
}

export function reachAt(a: number) {
  const i = Math.min(63.999, a * 4);
  const lo = Math.floor(i);
  return REACH[lo] + (REACH[lo + 1] - REACH[lo]) * (i - lo);
}

export const mod = (a: number, n: number) => ((a % n) + n) % n;

export type ReelFrame = { W: number; k: number; cx: number; sL: number; sR: number };

/** `centred` puts the middle poster on the screen's centre (no meta column beside it), as the small layout does. */
export function reelFrame(W: number, centred = false): ReelFrame {
  const small = centred || W < 820;
  const start = small ? 0 : W <= 1100 ? 300 : 400;
  const aw = Math.min(W, 1720);
  const al = (W - aw) / 2;
  const k = Math.max(0.62, Math.min(1.1, (aw - start) / 1040)) * 1.08;
  const cx = small ? W / 2 : al + start + (aw - start) / 2;
  return {
    W,
    k,
    cx,
    sL: Math.max(1, (cx - 60) / (reachAt(6) * k)),
    sR: Math.max(1, (W - cx - 60) / (reachAt(6) * k)),
  };
}

export type ReelSlot = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
  brightness: number;
  saturate: number;
  zIndex: number;
};

/** `off` is the signed distance in slots from the centre poster; `half` is slots / 2. */
export function reelSlot(off: number, half: number, f: ReelFrame): ReelSlot {
  const a = Math.abs(off);
  const dir = Math.sign(off);
  const stretch = 1 + ((dir < 0 ? f.sL : f.sR) - 1) * Math.min(1, a / 4);
  const x = dir * reachAt(a) * f.k * stretch;
  const y = (dir < 0 ? 46 : -26) * a * Math.max(0, 1 - a / 14) * f.k;
  const edge = Math.min(f.cx + x, f.W - f.cx - x);
  const opacity = Math.max(0, Math.min(1, (edge - 10) / (f.W * 0.14))) * Math.max(0, Math.min(1, (half - a) / 0.6));
  const b = 1 / (1 + 0.55 * a);
  return {
    x,
    y,
    rotate: -2 + dir * Math.min(15, 4.6 * a),
    scale: scale(a) * f.k,
    opacity,
    brightness: b,
    saturate: Math.min(1, 0.55 + 0.45 * b),
    zIndex: 100 - Math.round(a * 10),
  };
}

/** Signed shortest distance (in slots) from the centre to `slot`. */
export function slotOffset(slot: number, pos: number, slots: number): number {
  return mod(slot - pos + slots / 2, slots) - slots / 2;
}

/** How many slots the reel renders: enough copies of the list to fill both sides. */
export function slotCount(n: number): number {
  return n * Math.ceil(18 / n);
}

/** Pixel distance between neighbouring posters, for drag-to-step. */
export function reelStep(f: ReelFrame): number {
  return reachAt(1) * f.k;
}

export function titleSize(title: string): number {
  return title.length > 22 ? 34 : title.length > 12 ? 44 : title.length > 7 ? 56 : 72;
}
