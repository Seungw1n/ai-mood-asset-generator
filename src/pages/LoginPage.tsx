import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const ADMIN_USERNAME = 'wm-admin';
const ADMIN_PASSWORD = 'Makewishmood:)';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if API key is configured in environment
  const hasEnvApiKey = typeof import.meta.env.VITE_GEMINI_API_KEY === 'string' &&
                       import.meta.env.VITE_GEMINI_API_KEY.trim() !== '';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-border-default">
        <div>
          <h1 className="text-3xl font-bold text-center text-foreground">
            Nano Banana
          </h1>
          <p className="mt-2 text-center text-sm text-foreground-secondary">
            Sign in to access your workspaces
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-ring-focus focus:border-ring-focus focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password-input" className="sr-only">
                Password
              </label>
              <input
                id="password-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-ring-focus focus:border-ring-focus focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-destructive text-xs text-center">{error}</p>}

          {!hasEnvApiKey && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-destructive text-xs text-center">
                ⚠️ Gemini API key is not configured in environment variables.
                <br />
                Please set <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code> in your <code className="font-mono bg-destructive/20 px-1 py-0.5 rounded">.env.local</code> file.
              </p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-accent-foreground bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-accent"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;