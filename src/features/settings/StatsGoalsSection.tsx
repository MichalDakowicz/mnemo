import { useState } from 'react';

import type { ThresholdScope } from '@/lib/streakThresholds';

import { SettingRow, SettingsSection } from './SettingsSection';
import { Stepper } from './Stepper';
import { useStreakThresholds } from './useStreakThresholds';

export function StatsGoalsSection() {
  const t = useStreakThresholds();
  const [error, setError] = useState<string | null>(null);

  const apply = async (scope: ThresholdScope) => {
    setError(null);
    try {
      await t.apply(scope);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    }
  };

  return (
    <SettingsSection id="stats" title="Stats goals" hint="A week counts toward your streak when you reach these">
      <SettingRow label="Films a week"><Stepper value={t.movie} min={1} max={50} noun="films" onChange={t.setMovie} /></SettingRow>
      <SettingRow label="Episodes a week"><Stepper value={t.tv} min={1} max={100} noun="episodes" onChange={t.setTv} /></SettingRow>
      {t.dirty ? (
        <div className="row">
          <div>
            <p className="label">Apply the new goal</p>
            <p className="hint">Weeks you already watched through were measured against the old number. How far back should the new one reach?</p>
            <div className="scope-pick">
              <button type="button" className="pill primary" onClick={() => void apply('from-now')}>From this week on</button>
              <button type="button" className="pill" onClick={() => void apply('whole-history')}>Whole history</button>
              <button type="button" className="text-button" onClick={t.discard}>Undo</button>
            </div>
            {error ? <p className="hint" role="alert" style={{ color: 'var(--warn)' }}>{error}</p> : null}
          </div>
        </div>
      ) : null}
    </SettingsSection>
  );
}
