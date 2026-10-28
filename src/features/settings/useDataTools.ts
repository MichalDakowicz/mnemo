import { useState } from 'react';

import { useMovies } from '@/hooks/useMovies';
import type { Movie } from '@/types/movie';
import { isDuplicate, parseImport, serializeExport } from '@/lib/dataTransfer';

/** JSON export (download) and import (file picker) of the whole library. */
export function useDataTools() {
  const { movies, addMovie } = useMovies();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const exportJson = () => {
    const json = serializeExport(movies, new Date().toISOString());
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `mnemo_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${movies.length} titles`);
  };

  const importFile = async (file: File) => {
    setBusy(true);
    setMessage(null);
    try {
      const { movies: parsed, errors } = parseImport(await file.text());
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

  return { exportJson, importFile, message, busy };
}
