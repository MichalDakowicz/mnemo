import { hueFromTitle } from '@/lib/hue';

/** The generated-cover variant class Art uses for a title: '' (plain), 'v1', 'v2' or 'v3'. */
export function artVariant(title: string): '' | 'v1' | 'v2' | 'v3' {
  return (['', 'v1', 'v2', 'v3'] as const)[hueFromTitle(title + '!') % 4];
}
