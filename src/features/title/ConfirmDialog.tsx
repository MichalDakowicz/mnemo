import { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Native modal <dialog>: focus is trapped and Escape cancels without extra code. */
export function ConfirmDialog({ open, title, description, confirmLabel, destructive, busy, onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className="ti-dialog" onCancel={(e) => { e.preventDefault(); onCancel(); }} aria-labelledby="ti-dlg-title">
      <h2 id="ti-dlg-title">{title}</h2>
      <p>{description}</p>
      <div className="btns">
        <button type="button" className="pill" onClick={onCancel}>Cancel</button>
        <button type="button" className={`pill ${destructive ? 'danger' : 'primary'}`} onClick={onConfirm} disabled={busy}>
          {confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
