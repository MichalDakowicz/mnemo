import { reelGlow } from '@/lib/reelGlow';

// Ambient glow behind the reel (Matro's posterPalette): the centre poster is shrunk to 24×36 pixels and eight
// edge regions (corners and edge midpoints) are averaged; each colour glows from the matching side of the poster.
export const GLOW_SPOTS = ['39% 35%', '50% 33%', '61% 35%', '38% 50%', '62% 50%', '39% 65%', '50% 67%', '61% 65%'];
const CELLS: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
const W = 24;
const H = 36;

/** Lift dull, dark regions just enough to read as light on the near-black page. r, g, b in 0–1. */
export function vivid(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
  const h = !d ? 0 : max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return `hsl(${Math.round((h + 360) % 360)} ${Math.round(Math.min(1, s * 1.3 + 0.08) * 100)}% ${Math.round(Math.min(0.6, Math.max(0.32, l)) * 100)}%)`;
}

export function glowBackground(colours: string[]): string {
  return colours.map((c, i) => `radial-gradient(circle 320px at ${GLOW_SPOTS[i]}, ${c}, transparent)`).join(', ');
}

function averageCells(data: Uint8ClampedArray): string[] {
  return CELLS.map(([cx, cy]) => {
    let r = 0;
    let g = 0;
    let b = 0;
    for (let y = cy * 12; y < cy * 12 + 12; y++) {
      for (let x = cx * 8; x < cx * 8 + 8; x++) {
        const p = (y * W + x) * 4;
        r += data[p];
        g += data[p + 1];
        b += data[p + 2];
      }
    }
    return vivid(r / 96 / 255, g / 96 / 255, b / 96 / 255);
  });
}

const cache = new Map<string, Promise<string>>();

/** The glow wash for a poster; falls back to a hue from the title when the image cannot be read. */
export function posterGlow(url: string | null, title: string): Promise<string> {
  if (!url) return Promise.resolve(reelGlow(title));
  let hit = cache.get(url);
  if (!hit) {
    hit = new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const ctx = Object.assign(document.createElement('canvas'), { width: W, height: H }).getContext('2d', { willReadFrequently: true });
          if (!ctx) throw new Error('no canvas');
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, W, H);
          resolve(glowBackground(averageCells(ctx.getImageData(0, 0, W, H).data)));
        } catch {
          resolve(reelGlow(title));
        }
      };
      img.onerror = () => resolve(reelGlow(title));
      img.src = url;
    });
    cache.set(url, hit);
  }
  return hit;
}
