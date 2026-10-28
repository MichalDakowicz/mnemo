import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { STATUS_OPTIONS, type StatusKey } from '@/lib/titleStatus';

type Props = { value: StatusKey; isTv: boolean; onPick: (key: StatusKey) => void };

/** The watch-status pill and its radio menu (artboard: .menu glass). */
export function StatusMenu({ value, isTv, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = STATUS_OPTIONS.find((o) => o.key === value) ?? STATUS_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className="ti-menu-wrap" ref={ref}>
      <button type="button" className="pill" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        <span className={`ti-dot${value === 'watched' ? ' good' : ''}`} />
        {current.label}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open ? (
        <div className="ti-menu glass" role="menu" aria-label="Watch status">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitemradio"
              aria-checked={o.key === value}
              onClick={() => { onPick(o.key); setOpen(false); }}
            >
              {o.label}
              <small>{isTv ? o.tvHint : o.hint}</small>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
