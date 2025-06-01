import { GithubUserProvider, useGithubUser } from './context/githubUserContext';
import ConnectButtons from './components/connectButtons';
import Dashboard from './components/dashboard';

function AppContent() {
  const { githubUser } = useGithubUser();
  
  // Show connect screen when GitHub is not connected
  if (!githubUser || !githubUser.login) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-zinc-950 items-center">
        <main className="flex-1 flex flex-col justify-center w-[100vw] items-center">
          <div className="text-center text-white space-y-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold">Welcome</h1>
            <p className="text-gray-400 text-lg">
              Connect your GitHub account to track your achievements and contributions
            </p>
            <div className="mt-8 flex justify-center">
              <ConnectButtons withoutWallet/>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show dashboard when GitHub is connected
  return (
    <div className="min-h-screen w-full flex flex-col bg-zinc-950">
      <header className="flex items-center px-40 py-4 bg-zinc-950">
        <div className="flex-1" />
        <div className="flex gap-4 justify-end items-center">
          <ConnectButtons />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center w-full mx-auto">
        <Dashboard />
      </main>
    </div>
  );
}

function App() {
  return (
    <GithubUserProvider>
      <AppContent />
    </GithubUserProvider>
  );
}

export default App;
