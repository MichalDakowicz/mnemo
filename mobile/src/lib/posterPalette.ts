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
