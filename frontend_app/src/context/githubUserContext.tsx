import React, { createContext, useContext, useState } from 'react';

export const GithubUserContext = createContext<{
  githubUser: any;
  githubActivity: any;
  githubStreak: number;
  githubMaxStreak: number;
  setGithubUser: (user: any) => void;
  setGithubActivity: (activity: any) => void;
  setGithubStreak: (streak: number) => void;
  setGithubMaxStreak: (maxStreak: number) => void;
}>({
  githubUser: null,
  githubActivity: null,
  githubStreak: 0,
  githubMaxStreak: 0,
  setGithubUser: () => {},
  setGithubActivity: () => {},
  setGithubStreak: () => {},
  setGithubMaxStreak: () => {},
});

export const useGithubUser = () => useContext(GithubUserContext);

export const GithubUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [githubUser, setGithubUser] = useState<any>(null);
  const [githubActivity, setGithubActivity] = useState<any>(null);
  const [githubStreak, setGithubStreak] = useState<number>(0);
  const [githubMaxStreak, setGithubMaxStreak] = useState<number>(0);
  return (
    <GithubUserContext.Provider value={{ 
      githubUser, 
      githubActivity, 
      githubStreak, 
      githubMaxStreak,
      setGithubUser, 
      setGithubActivity, 
      setGithubStreak,
      setGithubMaxStreak
    }}>
      {children}
    </GithubUserContext.Provider>
  );
};
