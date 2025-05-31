import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

export default function RecentActivity() {
  const { githubActivity } = useGithubUser();
  // githubActivity: [(repo, #, title, closed_at), ...]
  const activities = useMemo(() => {
    if (githubActivity && Array.isArray(githubActivity) && githubActivity.length > 0) {
      return githubActivity.slice().reverse().map((item) => ({
        repo: item[0],
        number: item[1],
        title: item[2],
        closed_at: item[3],
      }));
    }
    // fallback demo data
    return [
      { title: 'Open source sprint', repo: 'demo/repo', closed_at: '4d ago', number: 1 },
      { title: 'Bug bounty', repo: 'demo/repo', closed_at: '2d ago', number: 2 },
      { title: 'Code review', repo: 'demo/repo', closed_at: '1d ago', number: 3 },
      { title: 'Write docs', repo: 'demo/repo', closed_at: '6h ago', number: 4 },
      { title: 'Fix critical bug', repo: 'demo/repo', closed_at: '8h ago', number: 5 },
      { title: 'Add unit tests', repo: 'demo/repo', closed_at: '12h ago', number: 6 },
      { title: 'Update dependencies', repo: 'demo/repo', closed_at: '1d ago', number: 7 },
      { title: 'Refactor API endpoints', repo: 'demo/repo', closed_at: '2d ago', number: 8 },
    ];
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
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Recent activity</div>
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
              {/* Item icon instead of rounded rectangle */}
              <div className='flex w-full gap-2.5 items-center'>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-blue-400 flex-shrink-0" style={{ minWidth: 32, minHeight: 32 }}>
                  <circle cx="16" cy="16" r="16" fill="#334155"/>
                  <path d="M16 10V22M10 16H22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <div className="flex justify-center items-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">
                  <a
                    href={`https://github.com/${activity.repo}/issues/${activity.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-blue-300"
                  >
                    {cutTitle(activity.title)}
                  </a>
                  <span className="ml-2 text-xs text-blue-400">
                    [<a href={`https://github.com/${activity.repo}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{activity.repo}</a>]
                  </span>
                </div>
              </div>
              <div className="justify-center text-neutral-600 text-nowrap text-sm font-normal font-['Work_Sans'] leading-none">
                {formatTime(activity.closed_at)}
              </div>
            </div>
            {/* Merged icon for each activity */}
          </div>
        ))}
      </div>
    </div>
  )
}
