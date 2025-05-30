import { useState } from 'react';

const GITHUB_CLIENT_ID = 'Iv23li1AVKQvMqMjDO7p'; // Replace with your actual GitHub client ID
const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo%20read:user`;
// If you have a backend endpoint for GitHub OAuth, use that instead of the direct GitHub URL above.

const MetaMaskLogin = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    window.location.href = GITHUB_OAUTH_URL;
    // Or redirect to your backend: window.location.href = 'http://localhost:8000/api/auth/github/login';
  };

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
      <button onClick={handleGitHubLogin} style={{ padding: '10px 20px', fontSize: 16, background: '#24292f', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Login with GitHub
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MetaMaskLogin; 