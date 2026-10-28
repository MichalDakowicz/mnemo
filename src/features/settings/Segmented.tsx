type Props<T extends string> = { options: { value: T; label: string }[]; value: T; label: string; onChange: (next: T) => void };

export function Segmented<T extends string>({ options, value, label, onChange }: Props<T>) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={value === option.value} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
