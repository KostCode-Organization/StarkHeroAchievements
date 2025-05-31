import React, { createContext, useContext, useState } from 'react';

// Function to calculate streaks from contribution days
function calculateStreaks(contributionDays: string[]): { currentStreak: number; maxStreak: number } {
  if (!contributionDays || contributionDays.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Convert to sorted list of date objects (chronological order)
  const dates = contributionDays
    .map(day => new Date(day + 'T00:00:00'))
    .sort((a, b) => a.getTime() - b.getTime());

  // Calculate maximum streak by finding longest consecutive sequence
  let maxStreak = 1;
  let currentStreakInHistory = 1;

  for (let i = 1; i < dates.length; i++) {
    const daysDiff = Math.floor((dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) { // Consecutive days
      currentStreakInHistory += 1;
      maxStreak = Math.max(maxStreak, currentStreakInHistory);
    } else {
      currentStreakInHistory = 1;
    }
  }

  // Calculate current active streak (from most recent activity)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0;

  if (dates.length > 0) {
    const mostRecentDate = dates[dates.length - 1];
    const daysSinceLastActivity = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24));

    // Only count as current streak if activity was within the last 1 day
    if (daysSinceLastActivity <= 1) {
      currentStreak = 1;

      // Count backwards from most recent date to find consecutive days
      for (let i = dates.length - 2; i >= 0; i--) {
        const daysDiff = Math.floor((dates[i + 1].getTime() - dates[i].getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) { // Consecutive days
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  return { currentStreak, maxStreak };
}

export const GithubUserContext = createContext<{
  githubUser: any;
  githubActivity: any;
  githubStreak: number;
  githubMaxStreak: number;
  githubContributionDays: string[];
  wallet: string | null;
  setGithubUser: (user: any) => void;
  setGithubActivity: (activity: any) => void;
  setGithubContributionDays: (days: string[]) => void;
  setWallet: (wallet: string | null) => void;
}>({
  githubUser: null,
  githubActivity: null,
  githubStreak: 0,
  githubMaxStreak: 0,
  githubContributionDays: [],
  wallet: null,
  setGithubUser: () => {},
  setGithubActivity: () => {},
  setGithubContributionDays: () => {},
  setWallet: () => {},
});

export const useGithubUser = () => useContext(GithubUserContext);

export const GithubUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [githubUser, setGithubUser] = useState<any>(null);
  const [githubActivity, setGithubActivity] = useState<any>(null);
  const [githubContributionDays, setGithubContributionDaysState] = useState<string[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);
  
  // Calculate streaks whenever contribution days change
  const streaks = calculateStreaks(githubContributionDays);
  
  const setGithubContributionDays = (days: string[]) => {
    setGithubContributionDaysState(days);
  };
  
  return (
    <GithubUserContext.Provider value={{ 
      githubUser, 
      githubActivity, 
      githubStreak: streaks.currentStreak,
      githubMaxStreak: streaks.maxStreak,
      githubContributionDays,
      wallet,
      setGithubUser, 
      setGithubActivity, 
      setGithubContributionDays,
      setWallet
    }}>
      {children}
    </GithubUserContext.Provider>
  );
};
