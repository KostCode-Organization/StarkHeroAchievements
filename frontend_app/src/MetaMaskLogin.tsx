import { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:8000';

interface MetaMaskLoginProps {
  inlineHeader?: boolean;
}

const MetaMaskLogin = ({ inlineHeader }: MetaMaskLoginProps) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);

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

  const handleGitHubLogin = () => {
    window.location.href = `${BACKEND_URL}/api/github/login`;
  };

  // Handle GitHub OAuth callback
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
      setGithubLoading(true);
      fetch(`${BACKEND_URL}/api/github/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch token');
          const data = await res.json();
          setGithubToken(data.access_token || JSON.stringify(data));
        })
        .catch((err) => setError(err.message))
        .finally(() => setGithubLoading(false));
    }
  }, []);

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
          Connect GitHub
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
        Login with GitHub
      </button>
      {githubLoading && <p>Loading GitHub token...</p>}
      {githubToken && (
        <div>
          <p>GitHub Access Token:</p>
          <code style={{ wordBreak: 'break-all' }}>{githubToken}</code>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default MetaMaskLogin;