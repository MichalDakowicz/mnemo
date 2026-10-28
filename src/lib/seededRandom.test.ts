import { mulberry32, seededPick, seededShuffle } from './seededRandom';

describe('seededRandom', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('differs between seeds', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
  it('shuffles deterministically without mutating the input', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const one = seededShuffle(input, mulberry32(7));
    const two = seededShuffle(input, mulberry32(7));
    expect(one).toEqual(two);
    expect(input).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...one].sort()).toEqual(input);
  });
  it('picks nothing from an empty list', () => {
    expect(seededPick([], mulberry32(1))).toBeUndefined();
  });
});
