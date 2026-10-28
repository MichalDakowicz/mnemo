import { useState, type FormEvent } from 'react';

import { BrandMark } from '@/components/layout/BrandMark';

import { signInWithEmail, signInWithGoogle } from './authActions';

// Not covered by the design artboards: built from the same tokens. See docs/DESIGN-GAPS.md.
export function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    void run(() => signInWithEmail(email, password));
  };

  return (
    <div className="signin">
      <form className="signin-card glass" onSubmit={submit}>
        <div className="signin-brand">
          <BrandMark />
          <h1>Mnemo</h1>
        </div>
        <p>Your memory of what you watched. Sign in with the account you use in Radar.</p>
        <button type="button" className="pill primary signin-btn" disabled={busy} onClick={() => run(signInWithGoogle)}>
          Continue with Google
        </button>
        <span className="signin-or">or</span>
        <label className="sr" htmlFor="email">Email</label>
        <input id="email" className="signin-input" type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="sr" htmlFor="password">Password</label>
        <input id="password" className="signin-input" type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="pill signin-btn" disabled={busy || !email || !password}>Sign in</button>
        {error ? <p className="signin-error" role="alert">{error}</p> : null}
      </form>
    </div>
  );
}
