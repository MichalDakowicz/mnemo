import { ChevronLeft } from 'lucide-react';
import { useMatch, useNavigate } from 'react-router-dom';

/** Matro's dock back button: slides out beside the dock on a title page and folds away elsewhere. */
export function BackButton() {
  const navigate = useNavigate();
  const open = useMatch('/title/*') !== null;
  const goBack = () => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'));
  return (
    <button type="button" className="dock-back glass" data-open={open} onClick={goBack} aria-label="Back" title="Back" tabIndex={open ? 0 : -1} aria-hidden={!open}>
      <ChevronLeft size={20} aria-hidden="true" />
    </button>
  );
}
