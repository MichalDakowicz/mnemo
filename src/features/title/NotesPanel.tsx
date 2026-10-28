type Props = { value: string; onChange: (v: string) => void };

export function NotesPanel({ value, onChange }: Props) {
  return (
    <section className="panel ti-notes" aria-label="Your notes">
      <label>
        <span className="lab"><b>Your notes</b><span>Only you see these</span></span>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What stayed with you? Scenes, lines, who you watched it with…"
        />
      </label>
    </section>
  );
}
