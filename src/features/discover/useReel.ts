import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

import { mod, reelFrame, reelStep, slotCount } from '@/lib/discoverReel';
import { posterGlow } from '@/lib/posterPalette';
import { ReelEngine } from '@/lib/reelEngine';
import { reelGlow } from '@/lib/reelGlow';
import { tiltAt } from '@/lib/reelPhysics';

/** All the coverflow needs from a title: Discover's trending items and library movies both fit. */
export type ReelItem = { title: string; coverUrl: string | null };

/** The centre poster under the cursor: tilt, glare position and which hand-drawn lines to draw. */
export type ReelHover = { slot: number; rx: number; ry: number; gx: number; gy: number; variant: number; run: number };

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The reel's state, after Matro's landing reel: wheel / trackpad / drag / arrow keys move it with
 * momentum and a soft spring, the centre poster tilts under the cursor, and a glow cross-fades to
 * the colours of the new centre poster.
 */
export function useReel(items: ReelItem[], centred = false) {
  const n = items.length;
  const slots = n ? slotCount(n) : 0;
  const key = items.map((i) => `${i.title}|${i.coverUrl ?? ''}`).join('\n');

  const [engine] = useState(() => new ReelEngine(reduced));
  const [pos, setPos] = useState(0);
  const [mode, setMode] = useState(engine.m.mode);
  const [width, setWidth] = useState(() => window.innerWidth);
  const [hover, setHover] = useState<ReelHover | null>(null);
  const [glow, setGlow] = useState<{ layers: [string, string]; on: 0 | 1 }>(() => ({ layers: [items[0] ? reelGlow(items[0].title) : '', ''], on: 0 }));
  const frame = reelFrame(width, centred);
  const live = useRef({ frame, n, slots });
  const drag = useRef<{ x: number; pos: number; moved: boolean; caught: boolean } | null>(null);
  const justDragged = useRef(false);
  const hoverBox = useRef<DOMRect | null>(null);
  const variant = useRef(0);
  const runs = useRef(0);
  const wheelTimer = useRef(0);
  const unbind = useRef<() => void>(() => {});

  useEffect(() => {
    live.current = { frame, n, slots };
  });
  useEffect(() => {
    const off = engine.subscribe(() => {
      setPos(engine.m.pos);
      setMode(engine.m.mode);
    });
    return () => {
      off();
      engine.stop();
    };
  }, [engine]);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // A new list (tab switch) starts at the first poster, at rest.
  const [seenKey, setSeenKey] = useState(key);
  if (seenKey !== key) {
    setSeenKey(key);
    setPos(0);
    setMode('idle');
    setHover(null);
  }
  useEffect(() => {
    engine.reset();
  }, [engine, key]);

  const centre = n ? mod(Math.round(pos), n) : 0;
  const centreSlot = slots ? mod(Math.round(pos), slots) : 0;
  const centreItem = items[centre];

  useEffect(() => {
    if (!centreItem) return;
    let current = true;
    void posterGlow(centreItem.coverUrl, centreItem.title).then((next) => {
      if (!current) return;
      setGlow((g) => {
        if (g.layers[g.on] === next) return g;
        const on = g.on === 0 ? 1 : 0;
        const layers: [string, string] = [g.layers[0], g.layers[1]];
        layers[on] = next;
        return { layers, on };
      });
    });
    return () => {
      current = false;
    };
  }, [centreItem]);

  const clearHover = () => setHover((h) => (h ? null : h));

  // Wheel needs preventDefault (sideways swipes must not navigate back), which React's passive listener cannot do.
  const bind = useCallback(
    (el: HTMLDivElement | null) => {
      unbind.current();
      unbind.current = () => {};
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const d = horizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
        if (!d || live.current.n < 2) return;
        e.preventDefault();
        // A mouse-wheel notch steps one poster; trackpad deltas move the reel directly and ride the OS's own inertia.
        if (e.deltaMode === 1 || (Math.abs(d) >= 50 && Number.isInteger(d))) return engine.springTo(engine.base + Math.sign(d));
        setHover(null);
        engine.wheelBy(d / reelStep(live.current.frame));
        window.clearTimeout(wheelTimer.current);
        wheelTimer.current = window.setTimeout(() => {
          if (engine.m.mode === 'wheel') engine.release();
        }, 90);
      };
      const onDragStart = (e: Event) => e.preventDefault();
      el.addEventListener('wheel', onWheel, { passive: false });
      el.addEventListener('dragstart', onDragStart);
      unbind.current = () => {
        el.removeEventListener('wheel', onWheel);
        el.removeEventListener('dragstart', onDragStart);
      };
    },
    [engine],
  );

  const end = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      if (d.caught) engine.springTo(Math.round(engine.m.pos));
      return;
    }
    justDragged.current = true;
    setTimeout(() => {
      justDragged.current = false;
    }, 0);
    engine.release();
  };

  return {
    pos,
    centre,
    slots,
    frame,
    hover,
    moving: mode !== 'idle',
    dragging: mode === 'drag',
    glow: glow.layers,
    glowOn: glow.on,
    bind,
    /** Spring to a poster (an absolute position, so `centre + 1` style steps work across the loop). */
    go: (target: number) => engine.springTo(target),
    /** Throw the reel `distance` posters and let it coast to rest there. */
    launch: (distance: number) => engine.launch(distance),
    /** Where the reel is, as a whole poster number; stable between renders. */
    at: () => Math.round(engine.m.pos),
    /** A click on a slot: true when it was the resting centre poster (open it), else the reel moves there. */
    pick: (slot: number) => {
      if (justDragged.current || !slots) return false;
      const base = engine.base;
      const half = Math.floor(slots / 2);
      const delta = mod(slot - mod(base, slots) + half, slots) - half;
      if (delta === 0 && engine.m.mode === 'idle') return true;
      engine.springTo(base + delta);
      return false;
    },
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        engine.springTo(engine.base + (e.key === 'ArrowRight' ? 1 : -1));
      },
      onPointerDown: (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // Grabbing a moving reel catches it where it is.
        drag.current = { x: e.clientX, pos: engine.m.pos, moved: false, caught: engine.grab() };
      },
      onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (d) {
          const dx = e.clientX - d.x;
          if (d.moved || Math.abs(dx) >= 6) {
            if (!d.moved) {
              d.moved = true;
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                /* Capture is optional. */
              }
            }
            setHover(null);
            engine.dragTo(d.pos - (n > 1 ? dx / reelStep(frame) : 0));
            return;
          }
        }
        // Hover effects belong to the resting centre poster only.
        const poster = (e.target as HTMLElement).closest<HTMLElement>('.reel-poster');
        const slot = poster ? Number(poster.dataset.slot) : -1;
        if (engine.m.mode !== 'idle' || !poster || slot !== centreSlot) return clearHover();
        // Entering gives a fresh, randomly chosen set of lines; the resting box is kept so tilting does not feed back into the cursor maths.
        const fresh = !hover;
        if (fresh || !hoverBox.current) {
          variant.current = (variant.current + 1 + Math.floor(Math.random() * 2)) % 3;
          hoverBox.current = poster.getBoundingClientRect();
          runs.current += 1;
        }
        const r = hoverBox.current;
        const tilt = reduced() ? { rx: 0, ry: 0, gx: 50, gy: 30 } : tiltAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
        setHover({ slot, ...tilt, variant: variant.current, run: runs.current });
      },
      onPointerUp: end,
      onPointerCancel: end,
      onPointerLeave: () => {
        if (!drag.current) {
          hoverBox.current = null;
          clearHover();
        }
      },
    },
  };
}
