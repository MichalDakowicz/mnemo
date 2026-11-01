import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pencil, Settings, Share2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Art } from '@/components/media/Art';
import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { formatScore } from '@/lib/profileFormat';
import type { ShelfStats } from '@/lib/shelfSummary';
import { colors } from '@/theme/colors';
import type { Profile } from '@/types/movie';

type Props = {
  profile: Profile | null;
  name: string;
  handle: string;
  stats: ShelfStats;
  copied: boolean;
  onEdit: () => void;
  onShare: () => void;
};

/** Hero: first favourite's poster as a faded backdrop, avatar, name, three figures and the actions. */
export function ProfileHeader({ profile, name, handle, stats, copied, onEdit, onShare }: Props) {
  const router = useRouter();
  const backdrop = profile?.favorites[0]?.coverUrl ?? null;
  const figures = [
    { value: String(stats.films), label: 'films' },
    { value: String(stats.thisYear), label: 'this year' },
    { value: formatScore(stats.average), label: 'avg' },
  ];
  return (
    <View style={styles.hero}>
      <View style={styles.backdrop} pointerEvents="none">
        {backdrop ? (
          <Image source={{ uri: backdrop }} contentFit="cover" style={StyleSheet.absoluteFill} />
        ) : (
          <Art title={name} showTitle={false} />
        )}
        <LinearGradient
          colors={['rgba(10,10,11,0.15)', colors.ground]}
          locations={[0, 0.92]}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={styles.who}>
        <View style={styles.avatar}>
          <Avatar name={name} pfp={profile?.pfp} size={88} />
        </View>
        <View style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
          <Text accessibilityRole="header" numberOfLines={1} tracking={-0.04} style={styles.name}>
            {name}
          </Text>
          <Text mono numberOfLines={1} style={styles.handle}>
            {handle}
          </Text>
        </View>
      </View>
      <View style={styles.figures}>
        {figures.map((f) => (
          <View key={f.label} style={styles.figure}>
            <Text mono style={styles.value}>
              {f.value}
            </Text>
            <Text style={styles.label}>{f.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Pill
          variant="primary"
          label="Edit profile"
          onPress={onEdit}
          icon={<Pencil size={15} strokeWidth={2} color={colors.onPrimary} />}
        />
        <Pill
          label={copied ? 'Link copied' : 'Share shelf'}
          onPress={onShare}
          icon={<Share2 size={15} strokeWidth={1.8} color={colors.text} />}
        />
        <Pill
          label="Settings"
          onPress={() => router.push('/settings')}
          icon={<Settings size={15} strokeWidth={1.8} color={colors.text} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginHorizontal: -16, paddingHorizontal: 16, paddingTop: 96, gap: 16, marginTop: -16 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, height: 260, opacity: 0.7, overflow: 'hidden' },
  who: { flexDirection: 'row', alignItems: 'flex-end', gap: 14 },
  avatar: { borderRadius: 999, borderWidth: 3, borderColor: colors.ground },
  name: { fontSize: 30, fontWeight: '600', lineHeight: 34 },
  handle: { marginTop: 2, fontSize: 13, color: colors.muted },
  figures: { flexDirection: 'row', gap: 28 },
  figure: { gap: 2 },
  value: { fontSize: 20, fontWeight: '500', color: colors.textBright },
  label: { fontSize: 11, color: colors.dim },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
