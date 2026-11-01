import {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import { GeistMono_400Regular, GeistMono_500Medium } from '@expo-google-fonts/geist-mono';

/** Bundled Geist and Geist Mono, no network fonts. Registered once in the root layout. */
export const fontAssets = {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  GeistMono_400Regular,
  GeistMono_500Medium,
};

export const fonts = {
  light: 'Geist_300Light',
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
} as const;

/** CSS font-weight → the bundled family that carries it (React Native has no variable weights). */
export function familyForWeight(weight: string | number | undefined, mono = false): string {
  const w = typeof weight === 'string' ? (weight === 'bold' ? 700 : weight === 'normal' ? 400 : parseInt(weight, 10)) : (weight ?? 400);
  if (mono) return w >= 500 ? fonts.monoMedium : fonts.mono;
  if (w <= 300) return fonts.light;
  if (w <= 400) return fonts.regular;
  if (w <= 500) return fonts.medium;
  if (w <= 600) return fonts.semibold;
  return fonts.bold;
}
