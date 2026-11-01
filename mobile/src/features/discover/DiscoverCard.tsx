import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Poster } from '@/components/media/Poster';
import { Text } from '@/components/ui/Text';
import { discoverMeta } from '@/lib/discoverCardMeta';
import type { DiscoverItem } from '@/lib/toDiscoveryMovie';
import { colors } from '@/theme/colors';

import { AddButton } from './AddButton';
import type { CardActions } from './useCardActions';

type Props = { item: DiscoverItem; actions: CardActions; width: number };

/** One title: cover (or generated art), name, "year · genre · kind", and a quick add / remove. */
export function DiscoverCard({ item, actions, width }: Props) {
  const router = useRouter();
  const target = { tmdbId: item.tmdbId, type: item.type, title: item.title };
  return (
    <View style={{ width }}>
      <Poster title={item.title} coverUrl={item.coverUrl} onPress={() => router.push(`/title/${item.type}/${item.tmdbId}`)}>
        <AddButton
          added={actions.isAdded(item)}
          pending={actions.isPending(item)}
          title={item.title}
          size={width < 110 ? 26 : 30}
          onToggle={() => void actions.toggle(target)}
        />
      </Poster>
      <Text numberOfLines={1} tracking={-0.01} style={styles.title}>
        {item.title}
      </Text>
      <Text numberOfLines={1} style={styles.meta}>
        {discoverMeta(item)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 7, fontSize: 12, fontWeight: '600' },
  meta: { marginTop: 2, fontSize: 11, color: colors.dim },
});
