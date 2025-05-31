import ConnectButtons from './components/connectButtons';
import Dashboard from './components/dashboard';

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-950">
      <header className="flex items-center px-40 py-4 bg-zinc-950">
        <div className="flex-1" />
        <div className="flex gap-4 justify-end items-center">
          <ConnectButtons inlineHeader />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center w-full mx-auto">
        <div>
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
