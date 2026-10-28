import { IDLE, MAX_SPEED, releaseSpeed, stepMotion, type Motion, type Sample } from './reelPhysics';

/** Friction of a Random spin: gentler than a hand throw, so the whirl lasts a couple of seconds. */
const SPIN_FRICTION = 1.3;

/** Frame-driven reel motion (Matro's `reel` object), kept out of React; a subscriber is told after every state change. */
export class ReelEngine {
  m: Motion = IDLE;
  private onChange: () => void = () => {};
  private samples: Sample[] = [];
  private raf = 0;
  private last = 0;

  constructor(private reduced: () => boolean = () => false) {}

  /** Call `fn` after every state change; returns the unsubscribe. */
  subscribe(fn: () => void) {
    this.onChange = fn;
    return () => {
      this.onChange = () => {};
    };
  }

  /** The poster a new move starts from: where a spring is heading, else the nearest one. */
  get base() {
    return this.m.mode === 'spring' ? this.m.target : Math.round(this.m.pos);
  }

  advance(dt: number) {
    this.m = stepMotion(this.m, dt);
    this.onChange();
  }

  private tick = (now: number) => {
    this.raf = 0;
    const dt = Math.min(1 / 30, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.advance(dt);
    if (this.m.mode === 'free' || this.m.mode === 'spring') this.raf = requestAnimationFrame(this.tick);
  };

  private run() {
    if (this.raf || typeof requestAnimationFrame === 'undefined') return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.m = { ...this.m, vel: 0 };
  }

  reset() {
    this.stop();
    this.m = IDLE;
    this.samples = [];
    this.onChange();
  }

  springTo(target: number) {
    if (this.reduced()) {
      this.stop();
      this.m = { ...IDLE, pos: target, target };
    } else {
      this.m = { ...this.m, target, mode: 'spring', friction: IDLE.friction };
      this.run();
    }
    this.onChange();
  }

  fling(velocity: number) {
    if (this.reduced()) return this.springTo(Math.round(this.m.pos));
    const vel = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocity));
    this.m = { ...this.m, vel, mode: 'free', friction: IDLE.friction };
    this.run();
    this.onChange();
  }

  /** Throw the reel `distance` posters (a whole number) so it coasts and settles exactly there. */
  launch(distance: number) {
    if (this.reduced()) return this.springTo(Math.round(this.m.pos) + distance);
    this.m = { ...this.m, vel: distance * SPIN_FRICTION, mode: 'free', friction: SPIN_FRICTION };
    this.run();
    this.onChange();
  }

  /** A finger or cursor takes hold; true when it caught a moving reel. */
  grab() {
    const caught = this.m.mode !== 'idle';
    this.stop();
    if (caught) this.m = { ...this.m, mode: 'drag' };
    this.samples = [];
    this.sample();
    this.onChange();
    return caught;
  }

  dragTo(pos: number) {
    this.m = { ...this.m, pos, vel: 0, mode: 'drag' };
    this.sample();
    this.onChange();
  }

  wheelBy(posters: number) {
    this.stop();
    this.m = { ...this.m, pos: this.m.pos + posters, mode: 'wheel' };
    this.sample();
    this.onChange();
  }

  /** Let go of a drag or wheel: throw at the speed of the last 100 ms. */
  release() {
    const speed = releaseSpeed(this.samples, performance.now());
    this.samples = [];
    this.fling(speed);
  }

  private sample() {
    const now = performance.now();
    this.samples.push({ t: now, pos: this.m.pos });
    while (this.samples.length > 2 && now - this.samples[0].t > 100) this.samples.shift();
  }
}
