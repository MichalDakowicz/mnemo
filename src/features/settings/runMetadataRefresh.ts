import { metadataPatch, selectRefreshQueue, toRefreshCandidate, type RefreshCandidate, type RefreshCandidateRow } from '@/lib/metadataRefresh';
import { toMovieRow } from '@/lib/normalizeMovie';
import { stripUndefined } from '@/lib/stripUndefined';
import { supabase } from '@/lib/supabase';
import { fetchMediaMetadata } from '@/lib/tmdb';

// Web version of Radar's manual "refresh all": plan with lib/metadataRefresh, then
// re-fetch each title from TMDB and write only the TMDB columns back. There is no
// background task on the web, so a stopped or closed tab just leaves the rest for next time.

const PACE_MS = 100;

export type RefreshResult = { ok: number; failed: number; total: number; stopped: boolean };

export async function runMetadataRefresh(
  userId: string,
  opts: { onProgress: (done: number, total: number) => void; isStopped: () => boolean },
): Promise<RefreshResult> {
  const { data: settings } = await supabase.from('user_settings').select('watch_provider_country').eq('user_id', userId).maybeSingle();
  const country: string = settings?.watch_provider_country ?? 'US';

  const { data, error } = await supabase
    .from('movies')
    .select('id,tmdb_id,type,title,tmdb_status,release_date,metadata_synced_at')
    .eq('user_id', userId)
    .not('tmdb_id', 'is', null)
    .limit(2000);
  if (error) throw error;
  const candidates = (data as RefreshCandidateRow[]).map(toRefreshCandidate).filter((c): c is RefreshCandidate => c !== null);

  // A manual run refreshes everything, so staleness is ignored: anything synced before now is due.
  const startedAt = Date.now();
  const queue = selectRefreshQueue(candidates, { now: startedAt, limit: 5000, fullRefreshSince: new Date(startedAt).toISOString() });

  let ok = 0;
  let failed = 0;
  let stopped = false;
  for (let i = 0; i < queue.length; i++) {
    if (opts.isStopped()) {
      stopped = true;
      break;
    }
    const candidate = queue[i];
    try {
      const fresh = await fetchMediaMetadata(candidate.tmdbId, candidate.type, country);
      if (!fresh) throw new Error('No TMDB answer');
      const row = stripUndefined(toMovieRow(metadataPatch(fresh)));
      const { error: updateError } = await supabase
        .from('movies')
        .update({ ...row, metadata_synced_at: new Date().toISOString() })
        .eq('id', candidate.id);
      if (updateError) throw updateError;
      ok++;
    } catch (e) {
      console.error(`Metadata refresh failed for ${candidate.title}`, e);
      failed++;
    }
    opts.onProgress(i + 1, queue.length);
    await new Promise((resolve) => setTimeout(resolve, PACE_MS));
  }
  return { ok, failed, total: queue.length, stopped };
}
