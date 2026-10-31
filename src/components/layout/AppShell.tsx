import { Link, Outlet } from 'react-router-dom';

import { BackButton } from './BackButton';
import { BrandMark } from './BrandMark';
import { ScrollToTop } from './ScrollToTop';
import { Dock } from './Dock';

// Dock top-left, brand top-right, grain over everything; routes fill the rest.
export function AppShell() {
  return (
    <>
      <div className="chrome">
        <div className="dock-wrap">
          <BackButton />
          <Dock />
        </div>
        <div className="window-zone">
          <div id="title-links" className="title-links" />
          <Link to="/" className="brand" aria-label="Mnemo home">
            <span className="brand-name">Mnemo</span>
            <BrandMark />
          </Link>
        </div>
      </div>
      <ScrollToTop />
      <main className="page">
        <Outlet />
      </main>
      <div className="grain" aria-hidden="true" />
    </>
  );
}
