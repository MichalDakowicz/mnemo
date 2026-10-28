// Geometry of Discover's conveyor belts. A belt is a straight strip of cards that carries on
// past both ends of the screen; near either end a card sinks, shrinks and turns away, as if
// riding round the back of the belt, then comes round again at the other end.

export type BeltSlot = {
  /** Pixels to shift the card sideways: cards bunch up as they fall, until they lie on top of each other. */
  dx: number;
  /** Pixels the card has sunk. */
  y: number;
  scale: number;
  /** Degrees of turn about the vertical axis. */
  rotate: number;
  zIndex: number;
  brightness: number;
  opacity: number;
};

/** How far a card sinks at the very end of the belt. */
export const BELT_DROP = 120;

/**
 * Where the flat run ends and the fall begins, as card-centre positions along the belt. The belt is
 * wider than its section: the cards between `left` and `right` ride flat across the section, and
 * each side has `spanLeft` / `spanRight` px beside it for the fall.
 */
export type BeltFrame = { left: number; right: number; spanLeft: number; spanRight: number };

/** The frame of a belt `width` px wide whose section starts `inset` px in, for cards `cardWidth` wide. */
export function beltFrame(width: number, inset: number, cardWidth: number): BeltFrame {
  const half = cardWidth / 2;
  const span = inset + half;
  return { left: span, right: width - span, spanLeft: span, spanRight: span };
}

/** The squeeze flattens out this fraction of the fall away from where it starts. */
const PILE = 0.62;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 in the flat run, 1 at either end of the belt; `side` says which end (-1 left, 1 right). */
export function beltEdge(centre: number, frame: BeltFrame) {
  if (centre > frame.right) return { edge: clamp01((centre - frame.right) / frame.spanRight), side: 1 };
  if (centre < frame.left) return { edge: clamp01((frame.left - centre) / frame.spanLeft), side: -1 };
  return { edge: 0, side: 1 };
}

/**
 * Where one card sits. `centre` is its horizontal centre in px along the belt if the cards were
 * evenly spaced; the result says how far it really moves, sinks, shrinks and turns.
 */
export function beltSlot(centre: number, frame: BeltFrame, drop = BELT_DROP): BeltSlot {
  const { edge, side } = beltEdge(centre, frame);
  if (edge === 0) return { dx: 0, y: 0, scale: 1, rotate: 0, zIndex: 100, brightness: 1, opacity: 1 };
  const span = side > 0 ? frame.spanRight : frame.spanLeft;
  const pile = span * PILE;
  const d = edge * span;
  // pile * (1 - e^(-d / pile)) starts at the same pace as an even belt and flattens out, so far cards land on near ones
  const squeezed = pile * (1 - Math.exp(-d / pile));
  const k = edge ** 1.6;
  return {
    dx: side * (squeezed - d),
    y: drop * k,
    scale: 1 - 0.5 * k,
    rotate: side * -24 * k,
    zIndex: 100 - Math.round(edge * 80),
    brightness: 1 - 0.6 * k,
    opacity: 1 - clamp01((edge - 0.8) / 0.2),
  };
}

/** Slots a belt needs so the wrap-around always happens off screen: the whole screen plus a few cards either side, repeating the list when it is short. */
export function beltSlotCount(items: number, viewport: number, inset: number, pitch: number): number {
  if (items <= 0) return 0;
  const needed = Math.ceil((viewport + inset) / pitch) + 3;
  return items * Math.max(1, Math.ceil(needed / items));
}

/** Signed offset, in cards, of `slot` from the belt's first position; cards further left than `lead` wrap to the far right. */
export function beltOffset(slot: number, pos: number, slots: number, lead: number): number {
  return ((((slot - pos + lead) % slots) + slots) % slots) - lead;
}
