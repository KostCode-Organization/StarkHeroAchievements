import { useState } from 'react';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <h2>Login with MetaMask</h2>
      {wallet ? (
        <div>
          <p>Connected wallet:</p>
          <code>{wallet}</code>
        </div>
      ) : (
        <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: 16 }}>
          Connect MetaMask
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MetaMaskLogin; 