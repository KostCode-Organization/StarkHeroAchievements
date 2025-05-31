import { useState, useEffect } from 'react';
import { useGithubUser } from '../context/githubUserContext';

// Global context for GitHub user data
const BACKEND_URL = 'http://localhost:8000';

interface ConnectButtons {
  inlineHeader?: boolean;
}

const ConnectButtons = ({ inlineHeader }: ConnectButtons) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { githubUser, setGithubUser, setGithubActivity, setGithubStreak, setGithubMaxStreak } = useGithubUser();

  const connectWallet = async () => {
    setError(null);
    if (!(window as any).ethereum) {
      setError('MetaMask is not installed.');
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to connect');
    }
  };

  // On mount, check for github_data param in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const githubKey = url.searchParams.get('github_key');
    if (githubKey) {
      fetch(`http://localhost:8000/api/github/data?key=${githubKey}`)
        .then(res => res.json())
        .then(decoded => {
          setGithubUser(decoded.user);
          setGithubActivity(decoded.closed);
          setGithubStreak(decoded.streak);
          setGithubMaxStreak(decoded.max_streak);
        })
        .catch(() => setError('Failed to fetch GitHub data'));
      url.searchParams.delete('github_key');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [setGithubUser, setGithubActivity, setGithubStreak, setGithubMaxStreak]);

  const handleGitHubLogin = () => {
    const redirectUri = window.location.origin + window.location.pathname;
    window.location.href = `${BACKEND_URL}/api/github/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  if (inlineHeader) {
    return (
      <div className="flex gap-2 ml-auto">
        {wallet ? (
          <span className="text-green-400 font-medium px-3 py-1 bg-gray-800 rounded-lg text-sm">
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow transition-colors"
          >
            Connect Wallet
          </button>
        )}
        <button
          onClick={handleGitHubLogin}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium shadow transition-colors"
        >
          {githubUser && githubUser.login ? githubUser.login : 'Connect GitHub'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <h2>Login</h2>
      <div style={{ marginBottom: 24 }}>
        {wallet ? (
          <div>
            <p>Connected wallet:</p>
            <code>{wallet}</code>
          </div>
        ) : (
          <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: 16, marginRight: 12 }}>
            Connect MetaMask
          </button>
        )}
      </div>
      <button
        onClick={handleGitHubLogin}
        style={{
          padding: '10px 20px',
          fontSize: 16,
          background: '#24292f',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        {githubUser && githubUser.login ? githubUser.login : 'Login with GitHub'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ConnectButtons;

// Usage in other components:
// import { useGithubUser } from '../context/githubUserContext';
// const { githubUser, githubActivity } = useGithubUser();
// Now you can use githubUser and githubActivity anywhere in your app.