type Props = { value: number; label: string; onChange: (v: number) => void };

/** 0-5 in 0.1 steps: a real range input under a styled track, as in the artboard. */
export function PreciseSlider({ value, label, onChange }: Props) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <label className="ti-precise">
      <span className="sr">{label}</span>
      <span className="ti-p-track">
        <span className="ti-p-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="ti-p-knob" style={{ left: `${pct}%` }} />
      <input type="range" min={0} max={5} step={0.1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
