import { describe, expect, it } from 'vitest';

import { BELT_DROP, beltEdge, beltFrame, beltOffset, beltSlot, beltSlotCount } from './belt';

// A 1180px section with 200px of fall beside it, cards 188px wide.
const F = beltFrame(1580, 200, 188);

describe('beltFrame', () => {
  it('keeps the flat run across the section and the fall beside it', () => {
    expect(F).toEqual({ left: 294, right: 1286, spanLeft: 294, spanRight: 294 });
  });
});

describe('beltSlot', () => {
  it('keeps every card across the section flat and evenly spaced', () => {
    for (const c of [294, 500, 800, 1286]) {
      expect(beltSlot(c, F)).toEqual({ dx: 0, y: 0, scale: 1, rotate: 0, zIndex: 100, brightness: 1, opacity: 1 });
    }
  });

  it('sinks, shrinks, dims and fades beyond the right end of the section', () => {
    const near = beltSlot(1380, F);
    const far = beltSlot(1520, F);
    expect(near.y).toBeGreaterThan(0);
    expect(far.y).toBeGreaterThan(near.y);
    expect(far.scale).toBeLessThan(near.scale);
    expect(far.brightness).toBeLessThan(near.brightness);
    expect(far.zIndex).toBeLessThan(near.zIndex);
    expect(far.y).toBeLessThanOrEqual(BELT_DROP);
  });

  it('squeezes cards together as they fall until they stack', () => {
    const pitch = 210;
    const gap = (c: number) => c + pitch + beltSlot(c + pitch, F).dx - (c + beltSlot(c, F).dx);
    expect(gap(900)).toBeCloseTo(pitch, 6);
    expect(gap(1300)).toBeLessThan(pitch);
    expect(gap(1400)).toBeLessThan(gap(1300));
    expect(gap(1450)).toBeLessThan(pitch * 0.6);
  });

  it('does the same on the left, turning the other way', () => {
    const left = beltSlot(100, F);
    const right = beltSlot(1480, F);
    expect(left.y).toBeGreaterThan(0);
    expect(left.dx).toBeGreaterThan(0);
    expect(right.dx).toBeLessThan(0);
    expect(Math.sign(left.rotate)).toBe(-Math.sign(right.rotate));
  });

  it('is gone by the time it reaches either end of the belt', () => {
    expect(beltSlot(1580, F).opacity).toBeCloseTo(0, 6);
    expect(beltSlot(0, F).opacity).toBeCloseTo(0, 6);
  });

  it('with no room beside the section, the fall is a short last step at its edges', () => {
    const tight = beltFrame(1180, 0, 188);
    expect(beltSlot(1150, tight).y).toBeGreaterThan(0);
    expect(beltSlot(500, tight).y).toBe(0);
  });

  it('reports which end a card is nearing', () => {
    expect(beltEdge(800, F).edge).toBe(0);
    expect(beltEdge(1450, F).side).toBe(1);
    expect(beltEdge(50, F).side).toBe(-1);
  });
});

describe('beltSlotCount', () => {
  it('covers the screen with spare cards at both ends', () => {
    expect(beltSlotCount(40, 1400, 56, 190)).toBe(40);
  });
  it('repeats a short list until the screen is covered', () => {
    const slots = beltSlotCount(5, 1400, 56, 190);
    expect(slots % 5).toBe(0);
    expect(slots * 190).toBeGreaterThanOrEqual(1400 + 56);
  });
  it('has nothing to place for an empty list', () => {
    expect(beltSlotCount(0, 1400, 56, 190)).toBe(0);
  });
});

describe('beltOffset', () => {
  it('counts cards from the first position', () => {
    expect(beltOffset(3, 0, 20, 2)).toBe(3);
    expect(beltOffset(3, 1.5, 20, 2)).toBe(1.5);
  });
  it('wraps a card that has left on the left round to the far right', () => {
    expect(beltOffset(0, 5, 20, 2)).toBe(15);
    expect(beltOffset(4, 5, 20, 2)).toBe(-1);
  });
  it('keeps every offset in one cycle', () => {
    for (let slot = 0; slot < 20; slot++) {
      const off = beltOffset(slot, 7.3, 20, 2);
      expect(off).toBeGreaterThanOrEqual(-2);
      expect(off).toBeLessThan(18);
    }
  });
});
