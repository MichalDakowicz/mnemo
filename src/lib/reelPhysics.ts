// Motion of the poster reel, ported from Matro's landing reel (matro/src/app.js stepReel).
// `pos` counts posters. A throw coasts on friction ('free'), then a soft, slightly bouncy
// spring ('spring') settles it on a poster; 'drag' and 'wheel' follow the user directly.

export const FRICTION = 2.4;
export const STIFFNESS = 80;
export const DAMPING = 2 * 0.8 * Math.sqrt(80);
/** Fastest throw, in posters per second. */
export const MAX_SPEED = 26;
/** Below this speed a coast hands over to the spring. */
const HAND_OVER = 3.5;

export type ReelMode = 'idle' | 'drag' | 'wheel' | 'free' | 'spring';
export type Motion = { pos: number; vel: number; target: number; mode: ReelMode; friction: number };
export type Sample = { t: number; pos: number };

export const IDLE: Motion = { pos: 0, vel: 0, target: 0, mode: 'idle', friction: FRICTION };

/** One frame. The coast is integrated exactly, so `pos + vel / friction` stays put and a throw lands where it was aimed. */
export function stepMotion(m: Motion, dt: number): Motion {
  if (m.mode === 'free') {
    const decay = Math.exp(-m.friction * dt);
    const pos = m.pos + (m.vel * (1 - decay)) / m.friction;
    const vel = m.vel * decay;
    // Aim for where the coast would naturally end, so the spring keeps the throw's direction and energy.
    if (Math.abs(vel) < HAND_OVER) return { ...m, pos, vel, mode: 'spring', target: Math.round(pos + vel / m.friction) };
    return { ...m, pos, vel };
  }
  if (m.mode === 'spring') {
    const vel = m.vel + (-STIFFNESS * (m.pos - m.target) - DAMPING * m.vel) * dt;
    const pos = m.pos + vel * dt;
    if (Math.abs(pos - m.target) < 0.0006 && Math.abs(vel) < 0.01) return { ...m, pos: m.target, vel: 0, mode: 'idle' };
    return { ...m, pos, vel };
  }
  return m;
}

/** Release speed (posters per second): a least-squares slope over the last 100 ms, so one stray sample cannot flip the throw. */
export function releaseSpeed(samples: Sample[], now: number): number {
  const s = samples.filter((p) => now - p.t <= 100);
  if (s.length < 2 || s[s.length - 1].t - s[0].t < 8) return 0;
  const mt = s.reduce((sum, p) => sum + p.t, 0) / s.length;
  const mp = s.reduce((sum, p) => sum + p.pos, 0) / s.length;
  const num = s.reduce((sum, p) => sum + (p.t - mt) * (p.pos - mp), 0);
  const den = s.reduce((sum, p) => sum + (p.t - mt) ** 2, 0);
  return den ? (num / den) * 1000 : 0;
}

/** The hovered edge tips toward the viewer: up to 9° vertically and 13° horizontally; the glare follows the cursor. */
export function tiltAt(px: number, py: number) {
  const x = Math.min(1, Math.max(0, px));
  const y = Math.min(1, Math.max(0, py));
  return { rx: (0.5 - y) * 18, ry: (x - 0.5) * 26, gx: Math.round(x * 100), gy: Math.round(y * 100) };
}
