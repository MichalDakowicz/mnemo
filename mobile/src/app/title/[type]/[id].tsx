import { useLocalSearchParams } from 'expo-router';

import { TitleState } from '@/features/title/TitleState';
import { TitleView } from '@/features/title/TitleView';

// /title/<movie|tv>/<tmdbId>: the back button comes from the dock.
export default function TitleScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const tmdbId = Number(id);
  const valid = (type === 'movie' || type === 'tv') && Number.isInteger(tmdbId) && tmdbId > 0;
  if (!valid) return <TitleState kind="invalid" />;
  return <TitleView key={`${type}:${tmdbId}`} type={type} tmdbId={tmdbId} />;
}
