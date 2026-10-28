import { describe, expect, it } from 'vitest';

import { ReelEngine } from './reelEngine';
import { releaseSpeed, tiltAt } from './reelPhysics';
import { vivid } from './posterPalette';

function settle(engine: ReelEngine, maxFrames = 2000) {
  for (let i = 0; i < maxFrames && engine.m.mode !== 'idle'; i++) engine.advance(1 / 60);
}

describe('ReelEngine', () => {
  it('a launch coasts and settles exactly on the poster it was aimed at', () => {
    for (const distance of [7, 30, 41, -12]) {
      const engine = new ReelEngine();
      engine.launch(distance);
      settle(engine);
      expect(engine.m.mode).toBe('idle');
      expect(engine.m.pos).toBe(distance);
    }
  });

  it('springTo settles on the target', () => {
    const engine = new ReelEngine();
    engine.springTo(3);
    settle(engine);
    expect(engine.m.pos).toBe(3);
  });

  it('a throw keeps its direction and ends on a whole poster', () => {
    const engine = new ReelEngine();
    engine.fling(10);
    settle(engine);
    expect(engine.m.pos).toBeGreaterThan(0);
    expect(Number.isInteger(engine.m.pos)).toBe(true);
  });

  it('reduced motion jumps straight there', () => {
    const engine = new ReelEngine(() => true);
    engine.launch(25);
    expect(engine.m).toMatchObject({ pos: 25, mode: 'idle' });
  });

  it('grabbing a moving reel catches it; grabbing a resting one does not', () => {
    const engine = new ReelEngine();
    expect(engine.grab()).toBe(false);
    engine.launch(10);
    engine.advance(1 / 60);
    expect(engine.grab()).toBe(true);
    expect(engine.m.mode).toBe('drag');
  });

  it('base is where a spring is heading', () => {
    const engine = new ReelEngine();
    engine.springTo(5);
    expect(engine.base).toBe(5);
  });
});

describe('releaseSpeed', () => {
  it('is the slope of recent movement, in posters per second', () => {
    const samples = [0, 20, 40, 60, 80, 100].map((t) => ({ t: 1000 + t, pos: t / 100 }));
    expect(releaseSpeed(samples, 1100)).toBeCloseTo(10, 5);
  });
  it('is zero when the pointer paused before release', () => {
    expect(releaseSpeed([{ t: 0, pos: 0 }, { t: 40, pos: 3 }], 1000)).toBe(0);
  });
});

describe('tiltAt', () => {
  it('tips the edge under the cursor toward the viewer', () => {
    expect(tiltAt(0.5, 0.5)).toEqual({ rx: 0, ry: 0, gx: 50, gy: 50 });
    expect(tiltAt(1, 0)).toMatchObject({ rx: 9, ry: 13 });
    expect(tiltAt(2, -1)).toMatchObject({ gx: 100, gy: 0 });
  });
});

describe('vivid', () => {
  it('lifts near-black into a readable light', () => {
    expect(vivid(0, 0, 0)).toBe('hsl(0 8% 32%)');
  });
  it('keeps the hue', () => {
    expect(vivid(0.1, 0.1, 0.9)).toMatch(/^hsl\(240 /);
  });
});
