import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

interface AssignedIssue {
  html_url: string;
  title: string;
  repository?: { name?: string };
}

export default function QuestBoard({ show, setShowTab }: { show?: boolean, setShowTab?: (tab: string) => void }) {
  const { githubUser } = useGithubUser();
  // Show assigned issues if available
  const assigned: AssignedIssue[] = useMemo(() => {
    if (!githubUser || !githubUser.assigned_issues) return [];
    return githubUser.assigned_issues;
  }, [githubUser]);

  return (
    <div className={`w-full p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start overflow-hidden ${show ? 'gap-3.5' : 'gap-0'}`}>
      <div className='flex items-center w-full justify-between'>
        <div
          onClick={() => setShowTab ? setShowTab(show ? '' : 'quests') : null}
          className="justify-center cursor-pointer text-white text-2xl font-bold font-['Work_Sans'] leading-9"
        >
          Quest board
        </div>
        {setShowTab && (!show ? (
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowTab('quests')}
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
        <div className={`flex flex-col ${show ? 'gap-3.5' : 'gap-0'}`}>
          {show && assigned.length > 0 ? assigned.map((issue: AssignedIssue, idx: number) => (
            <div 
              key={idx} 
              className={`self-stretch inline-flex justify-between items-center overflow-hidden transition-all duration-300 ${
                show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
              }`}
              style={{ 
                transitionDelay: show ? `${idx * 100}ms` : '0ms'
              }}
            >
              <div className="flex justify-start items-center gap-2.5">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-yellow-400"><circle cx="16" cy="16" r="16" fill="#fbbf24"/><path d="M16 10V22M10 16H22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{issue.title}</a>
                </div>
              </div>
              <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">{issue.repository?.name || ''}</div>
              </div>
            </div>
          )) : (
            <div className={`text-white text-base transition-all duration-300 ${
              show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
            }`}>No assigned issues</div>
          )}
        </div>
      </div>
    </div>
  )
}
