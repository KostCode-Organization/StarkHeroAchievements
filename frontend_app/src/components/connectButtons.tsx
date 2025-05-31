import { useState, useEffect } from 'react';
import { useGithubUser } from '../context/githubUserContext';

// Global context for GitHub user data
const BACKEND_URL = 'http://localhost:8000';

interface ConnectButtons {
  withoutWallet?: boolean;
}

const ConnectButtons = ({ withoutWallet }: ConnectButtons) => {
  const [error, setError] = useState<string | null>(null);
  const { githubUser, setGithubUser, setGithubActivity, setGithubContributionDays, wallet, setWallet } = useGithubUser();

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

  // Check for existing wallet connection on mount
  // useEffect(() => {
  //   const checkWalletConnection = async () => {
  //     if ((window as any).ethereum) {
  //       try {
  //         const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
  //         if (accounts.length > 0) {
  //           setWallet(accounts[0]);
  //         }
  //       } catch (err) {
  //         console.log('Error checking wallet connection:', err);
  //       }
  //     }
  //   };
  //   // checkWalletConnection();
  // }, [setWallet]);

  // On mount, check for github_data param in URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const githubKey = url.searchParams.get('github_key');
    if (githubKey) {
      fetch(`http://localhost:8000/api/github/data?key=${githubKey}`)
        .then(res => res.json())
        .then(decoded => {
          setGithubUser(decoded.user);
          setGithubActivity(decoded.activity);  // Changed from decoded.closed to decoded.activity
          setGithubContributionDays(decoded.contribution_days || []);
        })
        .catch(() => setError('Failed to fetch GitHub data'));
      url.searchParams.delete('github_key');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [setGithubUser, setGithubActivity, setGithubContributionDays]);

  const handleGitHubLogin = () => {
    const redirectUri = window.location.origin + window.location.pathname;
    window.location.href = `${BACKEND_URL}/api/github/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="flex gap-2 ml-auto">
      {wallet ? (
        <span className="text-green-400 flex items-center justify-center font-medium px-3 py-1 bg-gray-800 rounded-lg text-sm">
          {wallet.slice(0, 6)}...{wallet.slice(-4)}
        </span>
      ) : (!withoutWallet ? (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow transition-colors"
        >
          Connect Wallet
        </button>
      ) : null)}
      <button
        onClick={handleGitHubLogin}
        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium shadow transition-colors"
      >
        {githubUser && githubUser.login ? githubUser.login : 'Connect GitHub'}
      </button>
    </div>
  );
};

export default ConnectButtons;

// Usage in other components:
// import { useGithubUser } from '../context/githubUserContext';
// const { githubUser, githubActivity } = useGithubUser();
// Now you can use githubUser and githubActivity anywhere in your app.