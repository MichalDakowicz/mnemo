type Action = 'minimize' | 'maximize' | 'close';

// Desktop only: the Electron preload exposes window.mnemo. On the web this renders nothing.
export const isDesktop = typeof window !== 'undefined' && !!window.mnemo;

// Same glyphs as Matro's window buttons.
const BUTTONS: { action: Action; label: string; icon: React.ReactNode }[] = [
  { action: 'minimize', label: 'Minimize', icon: <path d="M6.5 12h11" /> },
  { action: 'maximize', label: 'Maximize', icon: <rect x="6.5" y="6.5" width="11" height="11" rx="2.5" /> },
  { action: 'close', label: 'Close', icon: <path d="m7.5 7.5 9 9M16.5 7.5l-9 9" /> },
];

// Hidden until the top-right corner is hovered or focused, then slides in beside the brand.
export function WindowControls() {
  if (!isDesktop) return null;
  return (
    <div className="window-actions">
      <div className="window-buttons" role="group" aria-label="Window">
        {BUTTONS.map(({ action, label, icon }) => (
          <button key={action} type="button" aria-label={label} onClick={() => window.mnemo?.window(action)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icon}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
