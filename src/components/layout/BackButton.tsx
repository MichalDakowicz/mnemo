import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Pages you arrive at from another page rather than from the dock: they get the back button. */
const DETAIL_PAGE = /^\/(title|person|genre|studio|u)\//;

/** Matro's dock back button: slides out beside the dock on every detail page and folds away on the main ones. */
export function BackButton() {
  const navigate = useNavigate();
  const open = DETAIL_PAGE.test(useLocation().pathname);
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));
  return (
    <button type="button" className="dock-back glass" data-open={open} onClick={goBack} aria-label="Back" title="Back" tabIndex={open ? 0 : -1} aria-hidden={!open}>
      <ChevronLeft size={20} aria-hidden="true" />
    </button>
  );
}
