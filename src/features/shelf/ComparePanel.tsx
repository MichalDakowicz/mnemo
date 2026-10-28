import { Link } from 'react-router-dom';

import type { CompareRow, TasteComparison } from '@/lib/compareTaste';
import { formatScore } from '@/lib/socialFeed';

const RADIUS = 36;
const CIRC = 2 * Math.PI * RADIUS;

function Rows({ title, rows, empty, both = true }: { title: string; rows: (Omit<CompareRow, 'yours' | 'gap'> & { yours?: number })[]; empty: string; both?: boolean }) {
  return (
    <div>
      <h3>{title}</h3>
      {rows.length === 0 ? <p className="cmp-empty">{empty}</p> : null}
      {rows.map((row) => (
        <div className="cmp-row" key={row.key}>
          {row.tmdbId != null ? <Link to={`/title/${row.type}/${row.tmdbId}`}>{row.title}</Link> : <span className="cmp-title">{row.title}</span>}
          <span className="cmp-scores">
            {both && row.yours != null ? `You ★ ${formatScore(row.yours)} · ` : ''}Them ★ {formatScore(row.theirs)}
          </span>
        </div>
      ))}
    </div>
  );
}

type Props = { comparison: TasteComparison; headline: string; subtitle: string };

/** Overlap ring, then where you agree, where you split, and what they love that you have not rated. */
export function ComparePanel({ comparison, headline, subtitle }: Props) {
  const filled = (comparison.overlapPct / 100) * CIRC;
  return (
    <section className="shelf-section panel" aria-label="Compare taste">
      <div className="head"><h2>Compare taste</h2></div>
      <div className="compare">
        <div className="ring">
          <svg width="84" height="84" aria-hidden="true">
            <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="var(--hairline)" strokeWidth="7" />
            <circle cx="42" cy="42" r={RADIUS} fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${filled} ${CIRC}`} />
          </svg>
          <span className="ring-pct">{comparison.overlapPct}%</span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{headline}</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--dim)' }}>{subtitle}</p>
        </div>
      </div>
      <div className="compare-lists">
        <Rows title="You agree on" rows={comparison.agree} empty="Nothing yet." />
        <Rows title="You split on" rows={comparison.split} empty="No big disagreements." />
        <Rows title="They love, you have not rated" rows={comparison.gaps} empty="Nothing waiting for you." both={false} />
      </div>
    </section>
  );
}
