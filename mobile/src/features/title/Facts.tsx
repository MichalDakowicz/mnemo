import { useRouter } from 'expo-router';
import { Fragment, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { NamedRef } from '@/types/movie';

export type Fact = { label: string; value: ReactNode; sub?: ReactNode };

/** Facts with nothing to say are dropped rather than shown as dashes. */
export function FactGrid({ facts }: { facts: (Fact | boolean | string | null | undefined)[] }) {
  const shown = facts.filter((f): f is Fact => typeof f === 'object' && f !== null && f.value !== '' && f.value != null);
  return (
    <View style={styles.grid}>
      {shown.map((f) => (
        <View key={f.label} style={styles.cell}>
          <Text style={styles.label}>{f.label}</Text>
          <Text style={styles.value}>{f.value}</Text>
          {f.sub ? <Text style={styles.sub}>{f.sub}</Text> : null}
        </View>
      ))}
    </View>
  );
}

/** Names that open a route when they carry an id, comma separated. Renders inline inside a parent Text. */
export function NameLinks({ items, to, color = colors.textBright, size = 14 }: { items: NamedRef[]; to: (id: number) => string; color?: string; size?: number }) {
  const router = useRouter();
  return (
    <>
      {items.map((p, i) => (
        <Fragment key={`${p.id ?? p.name}-${i}`}>
          {i > 0 ? ', ' : ''}
          {p.id ? (
            <Text accessibilityRole="link" onPress={() => router.push(to(p.id as number))} style={{ color, fontSize: size, fontWeight: '600' }}>
              {p.name}
            </Text>
          ) : (
            p.name
          )}
        </Fragment>
      ))}
    </>
  );
}

export const personTo = (id: number) => `/person/${id}`;
export const studioTo = (id: number) => `/studio/${id}`;

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 18, columnGap: 16 },
  cell: { width: '47%', flexGrow: 1, minWidth: 0 },
  label: { fontSize: 11, color: colors.dim, marginBottom: 5 },
  value: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  sub: { fontSize: 12, color: colors.dim, marginTop: 3 },
});
