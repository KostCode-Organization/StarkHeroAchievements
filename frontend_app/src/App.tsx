import './App.css';
import MetaMaskLogin from './MetaMaskLogin';
import ProfileCard from './ProfileCard';

function App() {
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <MetaMaskLogin />
      <ProfileCard />
    </div>
  );
}

export default App; 
