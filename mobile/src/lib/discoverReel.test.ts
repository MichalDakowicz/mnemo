import { mod, reelFrame, reelSlot, slotCount, slotOffset, titleSize } from './discoverReel';

describe('discoverReel', () => {
  it('keeps the centre poster full size and opaque', () => {
    const f = reelFrame(1440);
    const s = reelSlot(0, 9, f);
    expect(s.x).toBe(0);
    expect(s.opacity).toBe(1);
    expect(s.scale).toBeCloseTo(f.k, 5);
  });

  it('shrinks and dims posters away from the centre', () => {
    const f = reelFrame(1440);
    const near = reelSlot(1, 9, f);
    const far = reelSlot(4, 9, f);
    expect(far.scale).toBeLessThan(near.scale);
    expect(far.brightness).toBeLessThan(near.brightness);
    expect(near.x).toBeGreaterThan(0);
    expect(reelSlot(-1, 9, f).x).toBeLessThan(0);
  });

  it('wraps offsets', () => {
    expect(mod(-1, 5)).toBe(4);
    expect(slotOffset(0, 11, 12)).toBe(1);
    expect(slotOffset(11, 0, 12)).toBe(-1);
    expect(slotCount(12)).toBe(24);
    expect(slotCount(20)).toBe(20);
  });

  it('sizes titles', () => {
    expect(titleSize('Up')).toBe(72);
    expect(titleSize('A Very Long Film Title Indeed Yes')).toBe(34);
  });
});
