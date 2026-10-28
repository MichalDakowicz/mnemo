import { useState } from 'react';

import { useUpdateProfile } from '@/hooks/useProfile';
import { pickAvatar } from '@/lib/avatarImage';
import type { Profile } from '@/types/movie';

// The edit-profile panel: draft username / display name / photo, saved to profiles
// through useUpdateProfile (same payload Radar writes: pfp is a 256px JPEG data URI).
export function useProfileEdit(profile: Profile | null) {
  const update = useUpdateProfile();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [pfp, setPfp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    setName(profile?.displayName ?? '');
    setUsername(profile?.username ?? '');
    setPfp(profile?.pfp ?? '');
    setError(null);
    setOpen(true);
  };

  const toggle = () => (open ? setOpen(false) : start());

  const upload = async () => {
    try {
      const picked = await pickAvatar();
      if (picked) setPfp(picked);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not use that photo.');
    }
  };

  const save = async () => {
    setError(null);
    try {
      await update.mutateAsync({ username, displayName: name, pfp });
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your profile.');
    }
  };

  return {
    open,
    toggle,
    close: () => setOpen(false),
    name,
    setName,
    username,
    setUsername,
    pfp,
    clearPfp: () => setPfp(''),
    upload,
    save,
    saving: update.isPending,
    error,
  };
}
