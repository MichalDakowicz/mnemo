import type { RefObject } from 'react';
import { Pressable, StyleSheet, View, type TextInput } from 'react-native';

import { Glass } from '@/components/ui/Glass';
import { SearchField } from '@/components/ui/SearchField';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import type { MediaType } from '@/types/movie';

type Props = {
  inputRef: RefObject<TextInput | null>;
  query: string;
  onQuery: (q: string) => void;
  kind: MediaType;
  onKind: (k: MediaType) => void;
};

const KINDS: { id: MediaType; label: string }[] = [
  { id: 'movie', label: 'Films' },
  { id: 'tv', label: 'Shows' },
];

/** The big search pill plus the Films / Shows switch that drives the reel and the rows. */
export function SearchBar({ inputRef, query, onQuery, kind, onKind }: Props) {
  return (
    <View style={styles.bar}>
      <SearchField ref={inputRef} value={query} onChangeText={onQuery} placeholder="Films, shows, people, genres" style={styles.field} />
      <Glass style={styles.seg}>
        {KINDS.map((k) => {
          const on = kind === k.id;
          return (
            <Pressable
              key={k.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => onKind(k.id)}
              style={[styles.segItem, on && { backgroundColor: colors.active }]}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: on ? colors.textBright : colors.nav }}>{k.label}</Text>
            </Pressable>
          );
        })}
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { gap: 12, marginBottom: 10 },
  field: { height: 48 },
  seg: { alignSelf: 'flex-start', flexDirection: 'row', gap: 2, padding: 4 },
  segItem: { height: 34, paddingHorizontal: 18, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
