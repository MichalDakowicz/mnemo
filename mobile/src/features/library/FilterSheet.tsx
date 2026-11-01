import { StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { Chip } from '@/components/ui/Chip';
import { Pill } from '@/components/ui/Pill';
import { SearchField } from '@/components/ui/SearchField';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { filterFacets, type Facet, type LibraryFacets } from '@/lib/libraryFacets';
import { MY_SERVICES_KEY } from '@/lib/serviceFilter';
import { ALL_SERVICES, OTHER_SERVICE_KEY } from '@/lib/services';
import { colors } from '@/theme/colors';
import { useLibraryPrefs, type TypeFilter } from '@/store/libraryPrefs';

const SHOWN = 24;
const TYPES: [TypeFilter, string][] = [['all', 'All'], ['movie', 'Films'], ['tv', 'Shows']];

type GroupProps = { title: string; facets: Facet[]; selected: string[]; onToggle: (v: string) => void; find: string };

function FacetGroup({ title, facets, selected, onToggle, find }: GroupProps) {
  // Selected values stay visible even when the find box would hide them.
  const visible = filterFacets(facets, find);
  const shown = [...facets.filter((f) => selected.includes(f.value) && !visible.includes(f)), ...visible].slice(0, SHOWN);
  if (shown.length === 0) return null;
  return (
    <View style={styles.facet}>
      <Text style={styles.legend}>{title}</Text>
      <View style={styles.chips}>
        {shown.map((f) => (
          <Chip key={f.value} label={f.value} count={f.count} active={selected.includes(f.value)} onPress={() => onToggle(f.value)} />
        ))}
      </View>
    </View>
  );
}

type Props = { open: boolean; onClose: () => void; facets: LibraryFacets; activeCount: number; hasOwnedServices: boolean; matching: number };

/** Everything that narrows the library: type first, then the facet groups. Opened from the bar's filter icon. */
export function FilterSheet({ open, onClose, facets, activeCount, hasOwnedServices, matching }: Props) {
  const [find, setFind] = useState('');
  const p = useLibraryPrefs();
  const services: string[] = [...(hasOwnedServices ? [MY_SERVICES_KEY] : []), ...ALL_SERVICES, OTHER_SERVICE_KEY];
  return (
    <Sheet open={open} onClose={onClose} title="Filters">
      <View style={styles.body}>
        <View style={styles.facet}>
          <Text style={styles.legend}>Type</Text>
          <View style={styles.chips}>
            {TYPES.map(([v, label]) => (
              <Chip key={v} label={label} active={p.typeFilter === v} onPress={() => p.setTypeFilter(v)} />
            ))}
          </View>
        </View>
        <SearchField value={find} onChangeText={setFind} placeholder="Find a genre, director, year" />
        <View style={styles.facet}>
          <Text style={styles.legend}>Streaming service</Text>
          <View style={styles.chips}>
            {services.map((s) => (
              <Chip key={s} label={s === MY_SERVICES_KEY ? 'My services' : s} active={p.selectedServices.includes(s)} onPress={() => p.toggleService(s)} />
            ))}
          </View>
        </View>
        <FacetGroup title="Genre" facets={facets.genres} selected={p.selectedGenres} onToggle={p.toggleGenre} find={find} />
        <FacetGroup title="Director" facets={facets.directors} selected={p.selectedDirectors} onToggle={p.toggleDirector} find={find} />
        <FacetGroup title="Release year" facets={facets.years} selected={p.selectedYears} onToggle={p.toggleYear} find={find} />
        <View style={styles.foot}>
          <Pill variant="ghost" label={activeCount > 0 ? `Clear (${activeCount})` : 'Clear'} disabled={activeCount === 0} onPress={p.clearFilters} />
          <Pill variant="primary" label={`Show ${matching.toLocaleString('en-US')} ${matching === 1 ? 'title' : 'titles'}`} height={42} onPress={onClose} />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { gap: 16, paddingHorizontal: 8, paddingBottom: 8 },
  facet: { gap: 8 },
  legend: { fontSize: 11, fontWeight: '600', letterSpacing: 0.66, textTransform: 'uppercase', color: colors.dim },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
});
