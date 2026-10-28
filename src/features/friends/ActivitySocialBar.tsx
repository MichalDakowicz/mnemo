import { useId, useState } from 'react';

import { Avatar } from '@/components/ui/Avatar';
import { REACTIONS, relativeTime, type ReactionKind } from '@/lib/socialFeed';

import type { ActivitySocial } from './useActivitySocial';

type Props = {
  social: ActivitySocial | undefined;
  onReact: (kind: ReactionKind) => void;
  onComment: (body: string) => Promise<void>;
};

/** Reaction chips plus an expandable comment thread under one activity row. */
export function ActivitySocialBar({ social, onReact, onComment }: Props) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const comments = social?.comments ?? [];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      <div className="feed-social">
        {REACTIONS.map((reaction) => {
          const count = social?.counts[reaction.kind] ?? 0;
          return (
            <button
              key={reaction.kind}
              type="button"
              className="react"
              aria-pressed={social?.mine.includes(reaction.kind) ?? false}
              aria-label={`React with ${reaction.label}`}
              onClick={() => onReact(reaction.kind)}
            >
              <span aria-hidden="true">{reaction.emoji}</span>
              {count > 0 ? count : null}
            </button>
          );
        })}
        <button type="button" className="text-button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {comments.length > 0 ? `Comments (${comments.length})` : 'Comment'}
        </button>
      </div>
      {open ? (
        <div className="comments">
          {comments.map((comment) => {
            const name = comment.author?.displayName || comment.author?.username || 'Someone';
            return (
              <div className="comment" key={comment.id}>
                <Avatar name={name} pfp={comment.author?.pfp} size={24} />
                <span>
                  <b>{name}</b>
                  {comment.body} <span className="req-meta">{relativeTime(comment.createdAt)}</span>
                </span>
              </div>
            );
          })}
          <form className="comment-form" onSubmit={submit}>
            <label className="sr" htmlFor={inputId}>Write a comment</label>
            <input
              id={inputId}
              value={draft}
              maxLength={500}
              placeholder="Write a comment"
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="pill" disabled={!draft.trim() || sending}>Post</button>
          </form>
        </div>
      ) : null}
    </>
  );
}
