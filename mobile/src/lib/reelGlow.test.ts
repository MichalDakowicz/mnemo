import { reelGlow } from './reelGlow';

describe('reelGlow', () => {
  it('is stable per title and layers eight spots', () => {
    expect(reelGlow('Heat')).toBe(reelGlow('Heat'));
    expect(reelGlow('Heat').split('radial-gradient').length - 1).toBe(8);
  });
  it('changes with the title', () => {
    expect(reelGlow('Heat')).not.toBe(reelGlow('Alien'));
  });
});
