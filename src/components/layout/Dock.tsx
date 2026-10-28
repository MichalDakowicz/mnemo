import { BarChart3, Compass, Library, Search, UserRound, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/', label: 'Library', Icon: Library, end: true },
  { to: '/discover', label: 'Discover', Icon: Compass, end: false },
  { to: '/stats', label: 'Stats', Icon: BarChart3, end: false },
  { to: '/friends', label: 'Friends', Icon: Users, end: false },
  { to: '/profile', label: 'Profile', Icon: UserRound, end: false },
  { to: '/discover?focus=search', label: 'Search', Icon: Search, end: false },
] as const;

// Floating pill dock: the only navigation. No header bar.
export function Dock() {
  return (
    <nav className="dock glass" aria-label="Sections">
      {ITEMS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={label}
          to={to}
          end={end}
          className="dock-item">
          <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
          <span className="dock-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
