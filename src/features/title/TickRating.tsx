type Props = { label: string; value: number; onChange: (v: number) => void };

/** Ten tap segments (0.5 steps). Tapping the current one clears it, as in Radar. */
export function TickRating({ label, value, onChange }: Props) {
  return (
    <div>
      <div className="ti-rate-row">
        <span className="ti-rate-label">{label}</span>
        <span className="ti-rate-val">{value.toFixed(1)} / 5</span>
      </div>
      <div className="ti-ticks" role="group" aria-label={label}>
        {Array.from({ length: 10 }, (_, i) => {
          const v = (i + 1) / 2;
          return (
            <button
              key={v}
              type="button"
              className="ti-tick"
              aria-pressed={value >= v}
              aria-label={`${label} ${v.toFixed(1)} of 5`}
              onClick={() => onChange(value === v ? 0 : v)}
            >
              <span />
            </button>
          );
        })}
      </div>
    </div>
  );
}
