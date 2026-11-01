import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Share } from 'react-native';

import { useMovies } from '@/hooks/useMovies';
import { isDuplicate, parseImport, serializeExport } from '@/lib/dataTransfer';
import type { Movie } from '@/types/movie';

/**
 * JSON export (system share sheet) and import (JSON copied to the clipboard) of the whole library.
 * No file picker or file-system module is installed, so a phone moves the backup as text.
 */
export function useDataTools() {
  const { movies, addMovie } = useMovies();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const exportJson = async () => {
    const json = serializeExport(movies, new Date().toISOString());
    try {
      const result = await Share.share({
        title: `mnemo_backup_${new Date().toISOString().slice(0, 10)}.json`,
        message: json,
      });
      if (result.action === Share.sharedAction) setMessage(`Exported ${movies.length} titles`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not export');
    }
  };

  const importText = async (text: string) => {
    setBusy(true);
    setMessage(null);
    try {
      const { movies: parsed, errors } = parseImport(text);
      if (parsed.length === 0) {
        setMessage(errors[0] ?? 'No importable titles found');
        return;
      }
      let added = 0;
      let skipped = 0;
      let failed = 0;
      const seen = [...movies];
      for (const item of parsed) {
        if (isDuplicate(item, seen)) {
          skipped++;
          continue;
        }
        try {
          await addMovie(item);
          added++;
          seen.push(item as unknown as Movie);
        } catch {
          failed++;
        }
      }
      setMessage(`Imported ${added} · skipped ${skipped}${failed ? ` · ${failed} failed` : ''}${errors.length ? ` · ${errors.length} unreadable` : ''}`);
    } finally {
      setBusy(false);
    }
  };

  const importClipboard = async () => importText(await Clipboard.getStringAsync());

  return { exportJson, importClipboard, message, busy };
}
