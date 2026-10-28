import type { ReactNode } from 'react';

type Props = { open: boolean; id?: string; children: ReactNode };

/** Height-animated disclosure: always mounted, `inert` while shut so nothing inside takes focus. */
export function Collapse({ open, id, children }: Props) {
  return (
    <div id={id} className={open ? 'ti-collapse open' : 'ti-collapse'} inert={!open}>
      <div>{children}</div>
    </div>
  );
}
