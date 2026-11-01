import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Pill } from '@/components/ui/Pill';
import { Text } from '@/components/ui/Text';
import { REACTIONS, relativeTime, type ReactionKind } from '@/lib/socialFeed';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

import type { ActivitySocial } from './useActivitySocial';

type Props = {
  social: ActivitySocial | undefined;
  onReact: (kind: ReactionKind) => void;
  onComment: (body: string) => Promise<void>;
};

/** Reaction chips plus an expandable comment thread under one activity row. */
export function ActivitySocialBar({ social, onReact, onComment }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const comments = social?.comments ?? [];

  const submit = async () => {
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      await onComment(draft);
      setDraft('');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <View style={styles.social}>
        {REACTIONS.map((reaction) => {
          const count = social?.counts[reaction.kind] ?? 0;
          const on = social?.mine.includes(reaction.kind) ?? false;
          return (
            <Pressable
              key={reaction.kind}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`React with ${reaction.label}`}
              onPress={() => onReact(reaction.kind)}
              style={[styles.react, on && styles.reactOn]}>
              <Text style={{ fontSize: 12 }}>{reaction.emoji}</Text>
              {count > 0 ? <Text style={{ fontSize: 12, color: on ? colors.onPrimary : colors.soft }}>{count}</Text> : null}
            </Pressable>
          );
        })}
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} hitSlop={8} onPress={() => setOpen((v) => !v)}>
          <Text style={styles.toggle}>{comments.length > 0 ? `Comments (${comments.length})` : 'Comment'}</Text>
        </Pressable>
      </View>
      {open ? (
        <View style={styles.comments}>
          {comments.map((comment) => {
            const name = comment.author?.displayName || comment.author?.username || 'Someone';
            return (
              <View style={styles.comment} key={comment.id}>
                <Avatar name={name} pfp={comment.author?.pfp} size={24} />
                <Text style={styles.commentText}>
                  <Text style={styles.commentName}>{`${name}  `}</Text>
                  {comment.body}
                  <Text style={styles.when}>{`  ${relativeTime(comment.createdAt)}`}</Text>
                </Text>
              </View>
            );
          })}
          <View style={styles.form}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              maxLength={500}
              placeholder="Write a comment"
              placeholderTextColor={colors.dim}
              selectionColor={colors.primary}
              accessibilityLabel="Write a comment"
              onSubmitEditing={() => void submit()}
              returnKeyType="send"
              style={styles.input}
            />
            <Pill label="Post" height={36} disabled={!draft.trim() || sending} onPress={() => void submit()} />
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  social: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 8, marginLeft: 42 },
  react: { height: 28, paddingHorizontal: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.chipBorder, flexDirection: 'row', alignItems: 'center', gap: 5 },
  reactOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggle: { fontSize: 12.5, color: colors.muted, paddingHorizontal: 6 },
  comments: { marginTop: 10, marginLeft: 42, gap: 8 },
  comment: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  commentText: { flex: 1, minWidth: 0, fontSize: 13, lineHeight: 18, color: colors.soft },
  commentName: { fontSize: 13, fontWeight: '600', color: colors.text },
  when: { fontSize: 12, color: colors.dim },
  form: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: {
    flex: 1,
    minWidth: 0,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    backgroundColor: colors.inputFill,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text,
  },
});
