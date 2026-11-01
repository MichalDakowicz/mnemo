import { View } from 'react-native';

import { Pill } from '@/components/ui/Pill';

type Props = { label: string; loading: boolean; onPress: () => void };

/** The "Load more" pill under a list; the list also loads on reaching its end. */
export function LoadMoreButton({ label, loading, onPress }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 8, minHeight: 40 }}>
      <Pill label={loading ? 'Loading…' : label} height={40} disabled={loading} onPress={onPress} />
    </View>
  );
}
