import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

export default function RecentActivity({ show, setShowTab }: { show?: boolean, setShowTab?: (tab: string) => void }) {
  const { githubActivity, usedAI } = useGithubUser();
  
  // githubActivity: [(repo, #, title, closed_at, type), ...]
  const { activities } = useMemo(() => {
    if (githubActivity && Array.isArray(githubActivity) && githubActivity.length > 0) {
      const allIssues = githubActivity.filter((item) => {
        return item[4] === 'issue' || (!item[4] && !item[2]?.toLowerCase().includes('pull request'));
      });
      
      const recentActivities = allIssues
        .reverse()
        .map((item, idx) => ({
          repo: item[0],
          number: item[1],
          title: item[2],
          closed_at: item[3],
          usedAI: usedAI[idx] || false,
          type: item[4] || 'issue',
        }));

      console.log('Recent activities:', recentActivities);
      
      return {
        activities: recentActivities,
      };
    }
    return { activities: [], totalIssueCount: 0 };
  }, [githubActivity]);

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
    <div className={`w-full p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start overflow-hidden ${show ? 'gap-3.5' : 'gap-0'}`}>
      <div className='flex items-center w-full justify-between'>
        <div
          onClick={() => setShowTab ? setShowTab(show ? '' : 'recent') : null}
          className="justify-center cursor-pointer text-white text-2xl font-bold font-['Work_Sans'] leading-9"
        >
          Recent activity
        </div>
        {setShowTab && (!show ? (
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowTab('recent')}
          >
            View all
          </button>
        ) : (
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowTab('')}
          >
            Hide
          </button>
        ))}
      </div>
      <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
        show ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="flex flex-col gap-3.5">
          {activities.length === 0 ? (
            <div className={`text-gray-400 text-sm transition-all duration-300 ${
              show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
            }`}>No recent issue activity found. Connect your GitHub account or close some issues to see activity here.</div>
          ) : (
            <>
              {activities.length > 5 && (
                <div className={`text-xs text-gray-400 font-['Work_Sans'] transition-all duration-300 ${
                  show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
                }`}>
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
                  <div 
                    key={idx} 
                    className={`self-stretch w-full transition-all duration-300 ${
                      show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
                    }`}
                    style={{ 
                      transitionDelay: show ? `${idx * 70}ms` : '0ms'
                    }}
                  >
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
                        {activity.usedAI && (
                          <span className="text-xs text-yellow-400">AI</span>
                        )}
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
      </div>
    </div>
  )
}
