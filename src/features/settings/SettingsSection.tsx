import type { ReactNode } from 'react';

type Props = { id: string; title: string; hint: string; children: ReactNode };

export function SettingsSection({ id, title, hint, children }: Props) {
  return (
    <section id={id} className="sect" aria-labelledby={`h-${id}`}>
      <div className="sect-head"><h2 id={`h-${id}`}>{title}</h2><p>{hint}</p></div>
      <div className="sect-body">{children}</div>
    </section>
  );
}

type RowProps = { label: string; hint?: ReactNode; mono?: boolean; children?: ReactNode };

export function SettingRow({ label, hint, mono, children }: RowProps) {
  return (
    <div className="row">
      <div>
        <p className={mono ? 'label mono-label' : 'label'}>{label}</p>
        {hint ? <div className="hint">{hint}</div> : null}
      </div>
      {children ? <div className="row-controls">{children}</div> : null}
    </div>
  );
}
