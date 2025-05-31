import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

export default function RecentActivity() {
  const { githubActivity } = useGithubUser();
  
  // githubActivity: [(repo, #, title, closed_at, type), ...]
  const { activities, totalIssueCount } = useMemo(() => {
    if (githubActivity && Array.isArray(githubActivity) && githubActivity.length > 0) {
      const allIssues = githubActivity.filter((item) => {
        return item[4] === 'issue' || (!item[4] && !item[2]?.toLowerCase().includes('pull request'));
      });
      
      const recentActivities = allIssues
        .reverse()
        .map((item) => ({
          repo: item[0],
          number: item[1],
          title: item[2],
          closed_at: item[3],
          type: item[4] || 'issue',
        }));
      
      return {
        activities: recentActivities,
        totalIssueCount: allIssues.length
      };
    }
    return { activities: [], totalIssueCount: 0 };
  }, [githubActivity]);

  const isLoading = githubActivity === null;

  function formatTime(iso: string) {
    if (!iso) return '';
    const date = new Date(iso);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;
    if (diff < 60 * 60) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 60 * 60 * 24) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  function cutTitle(title: string, max = 30) {
    if (!title) return '';
    return title.length > max ? title.slice(0, max - 1) + '…' : title;
  }

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Recent activity</div>
      
      {isLoading ? (
        <div className="flex flex-col gap-3 w-full">
          <div className="text-gray-400 text-sm">Loading GitHub activity...</div>
          {/* Loading skeleton */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-1"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-gray-400 text-sm">No recent issue activity found. Connect your GitHub account or close some issues to see activity here.</div>
      ) : (
        <>
          {activities.length > 5 && (
            <div className="text-xs text-gray-400 font-['Work_Sans']">
              Scroll to see all {activities.length} activities
            </div>
          )}
      <div 
        className={`flex flex-col gap-3.5 w-full ${activities.length > 5 ? 'max-h-80 overflow-y-auto pr-2' : ''}`}
        style={{ 
          scrollbarWidth: 'thin', 
          scrollbarColor: '#475569 #1e293b'
        }}
      >
        {activities.map((activity, idx) => (
          <div key={idx} className="self-stretch w-full">
            <div className="flex justify-between items-center w-full">
              <div className='flex w-full gap-2.5 items-center'>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-blue-400 flex-shrink-0" style={{ minWidth: 32, minHeight: 32 }}>
                  <circle cx="16" cy="16" r="16" fill="#334155"/>
                  <circle cx="16" cy="16" r="4" fill="currentColor"/>
                </svg>
                <div className="flex justify-center items-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">
                  <a
                    href={`https://github.com/${activity.repo}/issues/${activity.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-300 text-nowrap"
                  >
                    {cutTitle(activity.title)}
                  </a>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <a
                  href={`https://github.com/${activity.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline text-nowrap"
                >
                  {activity.repo}
                </a>
                <div className="justify-center text-neutral-600 text-nowrap text-sm font-normal font-['Work_Sans'] leading-none">
                  {formatTime(activity.closed_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
      )}
    </div>
  )
}
