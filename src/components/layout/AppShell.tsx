import { Link, Outlet } from 'react-router-dom';

import { BrandMark } from './BrandMark';
import { Dock } from './Dock';

// Dock top-left, brand top-right, grain over everything; routes fill the rest.
export function AppShell() {
  return (
    <>
      <div className="chrome">
        <Dock />
        <Link to="/" className="brand" aria-label="Mnemo home">
          <span className="brand-name">Mnemo</span>
          <BrandMark />
        </Link>
      </div>
      <main className="page">
        <Outlet />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
