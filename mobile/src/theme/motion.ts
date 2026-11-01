import { Easing } from 'react-native-reanimated';

// Matro's one curve, cubic-bezier(.2,.75,.15,1), ~.35–.45s.
export const ease = Easing.bezier(0.2, 0.75, 0.15, 1);
export const DURATION = 400;
