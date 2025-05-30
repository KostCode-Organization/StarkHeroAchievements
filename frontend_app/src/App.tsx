import './App.css';
import MetaMaskLogin from './MetaMaskLogin';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <MetaMaskLogin />
    </div>
  );
}

export default App; 
