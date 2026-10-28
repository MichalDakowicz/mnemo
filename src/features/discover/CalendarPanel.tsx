import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Art } from '@/components/media/Art';
import type { CalendarEvent } from '@/lib/calendarEvents';

import type { CardActions } from './useCardActions';
import type { CalendarPanelModel } from './useCalendarPanel';

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Cover({ event, className }: { event: CalendarEvent; className: string }) {
  const { movie } = event;
  return (
    <span className={className} aria-hidden="true">
      {movie.coverUrl ? <img src={movie.coverUrl} alt="" loading="lazy" /> : <Art title={movie.title} showTitle={false} />}
    </span>
  );
}

/** A month grid with thumbnails per day and the picked day's titles listed underneath. */
export function CalendarPanel({ panel, actions }: { panel: CalendarPanelModel; actions: CardActions }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div className="cal-head">
        <div>
          <h2>{panel.title}</h2>
          <p>{panel.sub}</p>
        </div>
        <div className="cal-nav">
          <button type="button" className="chip" aria-pressed={panel.onlyOwned} onClick={panel.toggleOwned}>
            On my watchlist
          </button>
          <button type="button" className="icon-button" disabled={panel.prevOff} aria-label="Previous month" onClick={() => panel.shift(-1)}>
            <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
          </button>
          <span className="cal-month" aria-live="polite">
            {panel.monthLabel}
          </span>
          <button type="button" className="icon-button" disabled={panel.nextOff} aria-label="Next month" onClick={() => panel.shift(1)}>
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="cal-week" aria-hidden="true">
        {WEEK.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-grid">
        {panel.cells.map((cell, i) => {
          if (!cell) return <span key={`blank-${i}`} />;
          const n = cell.events.length;
          const warn = panel.which === 'leaving' && cell.events.some((e) => e.warning);
          return (
            <button
              key={cell.key}
              type="button"
              className="day"
              disabled={n === 0}
              aria-pressed={panel.selected === cell.key}
              aria-label={`${cell.day} ${panel.monthName}${n ? `, ${n} ${n === 1 ? 'title' : 'titles'}` : ''}`}
              data-past={cell.past}
              data-today={cell.today}
              onClick={() => panel.pick(cell.key)}
            >
              <span className="day-n">{cell.day}</span>
              <span className="day-thumbs">
                {cell.events.slice(0, 3).map((e) => (
                  <Cover key={e.id} event={e} className="thumb" />
                ))}
                {n > 3 ? <span className="day-more">+{n - 3}</span> : null}
              </span>
              {warn ? <span className="day-warn" /> : null}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 18 }}>
        <p className="cal-day-label">{panel.loading ? 'Loading…' : panel.dayLabel}</p>
        {panel.items.map((e) => {
          const target = { tmdbId: e.movie.tmdbId as number, type: e.movie.type, title: e.movie.title };
          const added = actions.isAdded(target);
          return (
            <div className="cal-item" key={e.id}>
              <Link to={`/title/${target.type}/${target.tmdbId}`}>
                <Cover event={e} className="cal-art" />
                <span style={{ minWidth: 0 }}>
                  <strong>{e.movie.title}</strong>
                  <small>{e.meta}</small>
                  {e.warning && added ? <small className="warn">{e.warning}</small> : null}
                </span>
              </Link>
              <button
                type="button"
                className="pill small"
                aria-pressed={added}
                disabled={actions.isPending(target)}
                onClick={() => void actions.toggle(target)}
              >
                {added ? 'On watchlist' : '+ Watchlist'}
              </button>
            </div>
          );
        })}
        {!panel.loading && panel.items.length === 0 ? <p className="cal-empty">{panel.emptyText}</p> : null}
      </div>
    </div>
  );
}
