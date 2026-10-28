/** Hue (0-359) derived from a title, so generated art is stable per title. */
export function hueFromTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) % 360;
  return h;
}
