import { Link, useLocalSearchParams } from 'expo-router';

import { colors } from '@/theme/colors';

import { Screen } from '@/components/layout/Screen';
import { EmptyState } from '@/components/ui/EmptyState';
import { PersonView } from '@/features/person/PersonView';

// /person/<tmdbId>: the person view; the back button lives in the dock.
export default function PersonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);

  if (!Number.isInteger(personId) || personId <= 0) {
    return (
      <Screen>
        <EmptyState tone="warn" body="That is not a person Mnemo can open." />
        <Link href="/" style={{ textAlign: 'center', color: colors.text }}>
          Back to library
        </Link>
      </Screen>
    );
  }
  return <PersonView key={personId} personId={personId} />;
}
