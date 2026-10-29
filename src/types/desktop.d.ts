// Bridge exposed by desktop/preload.js; undefined in the browser.
interface Window {
  mnemo?: {
    authRedirect: string;
    window: (action: 'minimize' | 'maximize' | 'close') => Promise<void>;
    openExternal: (url: string) => Promise<void>;
    onAuthCallback: (callback: (url: string) => void) => () => void;
  };
}
