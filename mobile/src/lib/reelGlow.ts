import { hueFromTitle } from '@/lib/hue';

const SPOTS = ['39% 35%', '50% 33%', '61% 35%', '38% 50%', '62% 50%', '39% 65%', '50% 67%', '61% 65%'];

/** The soft coloured wash behind the Discover reel; its hue follows the centre title. */
export function reelGlow(title: string): string {
  const h = hueFromTitle(title);
  return SPOTS.map(
    (s, i) => `radial-gradient(circle 320px at ${s}, hsl(${(h + i * 12) % 360} 55% ${i < 3 ? 52 : 38}%), transparent)`,
  ).join(', ');
}
