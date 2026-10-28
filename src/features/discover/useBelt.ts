import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';

import { beltFrame, beltOffset, beltSlot, beltSlotCount } from '@/lib/belt';
import { ReelEngine } from '@/lib/reelEngine';

/** Card width: a little narrower on small screens. */
export function useCardWidth() {
  const [w, setW] = useState(() => (window.innerWidth <= 820 ? 148 : 188));
  useEffect(() => {
    const onResize = () => setW(window.innerWidth <= 820 ? 148 : 188);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A conveyor belt of `count` cards `cardWidth` wide. It carries on without end: wheel / trackpad /
 * drag / arrow keys move it with the same momentum and soft spring as the Discover reel, and cards
 * near either end sink to the back (lib/belt). Positions are written straight to the cards on every
 * frame, so a belt moving costs no React renders.
 */
export function useBelt(count: number, cardWidth: number, gap = 22) {
  const pitch = cardWidth + gap;
  const [engine] = useState(() => new ReelEngine(reduced));
  const [view, setView] = useState({ width: window.innerWidth, inset: 0 });
  const slots = beltSlotCount(count, view.width, view.inset, pitch);
  const stage = useRef<HTMLDivElement | null>(null);
  const live = useRef({ view, slots, pitch, cardWidth, count });
  const drag = useRef<{ x: number; pos: number; moved: boolean; caught: boolean } | null>(null);
  const justDragged = useRef(false);
  const wheelTimer = useRef(0);
  const unbind = useRef<() => void>(() => {});
  const [dragging, setDragging] = useState(false);

  /** Put every card where the belt's position says; called each frame and whenever the geometry changes. */
  const place = useCallback(() => {
    const el = stage.current;
    const { view: v, slots: total, pitch: step, cardWidth: w } = live.current;
    if (!el || !total) return;
    const lead = v.inset / step + 1;
    const pos = engine.m.pos;
    for (const child of Array.from(el.children) as HTMLElement[]) {
      const slot = Number(child.dataset.slot);
      const even = v.inset + beltOffset(slot, pos, total, lead) * step;
      const p = beltSlot(even + w / 2, beltFrame(v.width, v.inset, w));
      const x = even + p.dx;
      const hidden = p.opacity < 0.01;
      child.style.transform = `translate3d(${x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) perspective(1100px) rotateY(${p.rotate.toFixed(2)}deg) scale(${p.scale.toFixed(3)})`;
      child.style.opacity = p.opacity.toFixed(3);
      child.style.zIndex = String(p.zIndex);
      child.style.filter = p.brightness < 0.999 ? `brightness(${p.brightness.toFixed(3)})` : '';
      child.style.visibility = hidden ? 'hidden' : 'visible';
      child.style.pointerEvents = p.opacity < 0.5 ? 'none' : 'auto';
    }
  }, [engine]);

  useLayoutEffect(() => {
    live.current = { view, slots, pitch, cardWidth, count };
    place();
  });

  useEffect(() => {
    const off = engine.subscribe(() => {
      place();
      setDragging(engine.m.mode === 'drag');
    });
    return () => {
      off();
      engine.stop();
    };
  }, [engine, place]);

  // Sideways wheel needs preventDefault (it must not navigate back), which React's passive listener cannot do.
  const bind = useCallback(
    (el: HTMLDivElement | null) => {
      unbind.current();
      unbind.current = () => {};
      stage.current = el;
      if (!el) return;
      // The flat run is exactly the section's width. The belt reaches out past it into the page margins, as far as they allow, for the fall.
      const sync = () => {
        const parent = el.parentElement;
        if (!parent) return;
        const box = parent.getBoundingClientRect();
        const room = Math.min(box.left, document.documentElement.clientWidth - box.right);
        const fall = Math.max(0, Math.min(Math.floor(room) - 4, 320));
        const width = box.width + fall * 2;
        el.style.marginLeft = `${-fall}px`;
        el.style.width = `${width}px`;
        setView((v) => (Math.abs(v.width - width) < 1 && Math.abs(v.inset - fall) < 1 ? v : { width, inset: fall }));
      };
      sync();
      const onWheel = (e: WheelEvent) => {
        const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const d = horizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
        if (!d || live.current.count < 2) return;
        e.preventDefault();
        // A mouse-wheel notch steps two cards; trackpad deltas move the belt directly and ride the OS's own inertia.
        if (e.deltaMode === 1 || (Math.abs(d) >= 50 && Number.isInteger(d))) return engine.springTo(engine.base + 2 * Math.sign(d));
        engine.wheelBy(d / live.current.pitch);
        window.clearTimeout(wheelTimer.current);
        wheelTimer.current = window.setTimeout(() => {
          if (engine.m.mode === 'wheel') engine.release();
        }, 90);
      };
      const onDragStart = (e: Event) => e.preventDefault();
      el.addEventListener('wheel', onWheel, { passive: false });
      el.addEventListener('dragstart', onDragStart);
      const observer = new ResizeObserver(sync);
      observer.observe(el);
      if (el.parentElement) observer.observe(el.parentElement);
      unbind.current = () => {
        el.removeEventListener('wheel', onWheel);
        el.removeEventListener('dragstart', onDragStart);
        observer.disconnect();
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

  /** How many cards fit across the window, for the arrow buttons' step. */
  const step = Math.max(2, Math.floor(view.width / pitch) - 2);

  return {
    slots,
    dragging,
    bind,
    prev: () => engine.springTo(engine.base - step),
    next: () => engine.springTo(engine.base + step),
    handlers: {
      onKeyDown: (e: KeyboardEvent) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        engine.springTo(engine.base + (e.key === 'ArrowRight' ? 1 : -1));
      },
      onPointerDown: (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        drag.current = { x: e.clientX, pos: engine.m.pos, moved: false, caught: engine.grab() };
      },
      onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (!d.moved && Math.abs(dx) < 6) return;
        if (!d.moved) {
          d.moved = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* Capture is optional. */
          }
        }
        engine.dragTo(d.pos - dx / pitch);
      },
      onPointerUp: end,
      onPointerCancel: end,
      // A drag ends in a click on whatever card is under the cursor: swallow it.
      onClickCapture: (e: MouseEvent) => {
        if (justDragged.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      // Tabbing to a card that is off screen carries the belt round to it.
      onFocusCapture: (e: React.FocusEvent<HTMLElement>) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>('[data-slot]');
        if (!card || !slots || !(e.target as HTMLElement).matches(':focus-visible')) return;
        const x = card.getBoundingClientRect().left - (stage.current?.getBoundingClientRect().left ?? 0);
        if (x < view.inset - 4 || x + cardWidth > view.width * 0.7) engine.springTo(engine.base + Math.round((x - view.inset) / pitch));
      },
    },
  };
}
