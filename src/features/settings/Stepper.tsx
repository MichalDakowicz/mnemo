type Props = { value: number; min: number; max: number; noun: string; onChange: (next: number) => void };

export function Stepper({ value, min, max, noun, onChange }: Props) {
  return (
    <div className="stepper">
      <button type="button" aria-label={`Fewer ${noun}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label={`More ${noun}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
    </div>
  );
}
