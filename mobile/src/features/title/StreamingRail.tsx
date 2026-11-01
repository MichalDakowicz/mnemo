import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { getServiceStyle, isPopularService, normalizeAvailability, onDarkColor, POPULAR_SERVICES } from '@/lib/services';

const SIZE = 38;

/** Icons for where it streams: only the services most people have (lib/services POPULAR_SERVICES), in their usual order. */
export function StreamingRail({ availability, logos }: { availability: string[]; logos: Record<string, string> }) {
  const have = new Set(normalizeAvailability(availability).filter(isPopularService));
  const shown = POPULAR_SERVICES.filter((s) => have.has(s));
  if (shown.length === 0) return null;
  return (
    <View style={styles.rail} accessibilityLabel="Streaming on">
      {shown.map((name) => {
        const st = getServiceStyle(name);
        return (
          <View key={name} accessible accessibilityLabel={name} style={[styles.badge, { backgroundColor: onDarkColor(st.color) }]}>
            {logos[name] ? (
              <Image source={{ uri: logos[name] }} contentFit="cover" style={StyleSheet.absoluteFill} />
            ) : (
              <Text style={{ fontSize: 12, fontWeight: '700', color: st.textColor }}>{st.short}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 },
  badge: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px #0006' },
});
