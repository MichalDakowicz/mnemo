import { useRef } from 'react';

import { SettingRow, SettingsSection } from './SettingsSection';
import { useDataTools } from './useDataTools';
import { useMetadataRefresh } from './useMetadataRefresh';

export function DataSection() {
  const refresh = useMetadataRefresh();
  const data = useDataTools();
  const fileRef = useRef<HTMLInputElement>(null);
  const { progress } = refresh;
  const pct = progress && progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  let note = refresh.note ?? `Posters, cast and episode lists for all ${refresh.withTmdb} titles`;
  if (progress) note = `Updating ${progress.done} of ${progress.total} titles from TMDB. You can keep using Mnemo.`;

  return (
    <SettingsSection id="data" title="Data" hint="Metadata comes from TMDB; your data is yours">
      <SettingRow
        label="Refresh metadata"
        hint={
          <>
            {note}
            {progress ? (
              <div className="bar" role="progressbar" aria-label="Refresh progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <span style={{ width: `${pct}%` }} />
              </div>
            ) : null}
          </>
        }
      >
        {refresh.refreshing ? (
          <button type="button" className="pill" onClick={refresh.stop}>Stop</button>
        ) : (
          <button type="button" className="pill" disabled={refresh.withTmdb === 0} onClick={() => void refresh.start()}>Refresh all</button>
        )}
      </SettingRow>
      <SettingRow label="Import and export" hint={data.message ?? 'Library, episodes, ratings and notes as one JSON file'}>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr"
          tabIndex={-1}
          aria-label="Choose a JSON file to import"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void data.importFile(file);
          }}
        />
        <button type="button" className="pill" disabled={data.busy} onClick={() => fileRef.current?.click()}>
          {data.busy ? 'Importing…' : 'Import JSON'}
        </button>
        <button type="button" className="pill" onClick={data.exportJson}>Export JSON</button>
      </SettingRow>
    </SettingsSection>
  );
}
