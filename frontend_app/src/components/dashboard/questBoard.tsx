import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';
import type { ActivityProps } from '../dashboard';

interface AssignedIssue {
  html_url: string;
  title: string;
  repository?: { name?: string };
}

export default function QuestBoard({ show, setShowTab }: ActivityProps) {
  const { githubUser } = useGithubUser();
  // Show assigned issues if available
  const assigned: AssignedIssue[] = useMemo(() => {
    if (!githubUser || !githubUser.assigned_issues) return [];
    return githubUser.assigned_issues;
  }, [githubUser]);

  return (
    <div className={`w-full p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start overflow-hidden ${show.quests ? 'gap-3.5' : 'gap-0'}`}>
      <div className='flex items-center w-full justify-between'>
        <div
          onClick={() => setShowTab ? setShowTab({ ...show, quests: !show.quests }) : null}
          className="justify-center cursor-pointer text-white text-2xl font-bold font-['Work_Sans'] leading-9"
        >
          Quest board
        </div>
        {setShowTab && (!show.quests ? (
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowTab({ ...show, quests: true })}
          >
            View all
          </button>
        ) : (
          <button
            className="text-blue-400 hover:underline text-sm"
            onClick={() => setShowTab({ ...show, quests: false })}
          >
            Hide
          </button>
        ))}
      </div>
      <div className={`w-full transition-all duration-500 ease-in-out overflow-hidden ${
        show.quests ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`flex flex-col ${show.quests ? 'gap-3.5' : 'gap-0'}`}>
          {show.quests && assigned.length > 0 ? assigned.map((issue: AssignedIssue, idx: number) => (
            <div 
              key={idx} 
              className={`self-stretch inline-flex justify-between items-center overflow-hidden transition-all duration-300 ${
                show.quests ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
              }`}
              style={{ 
                transitionDelay: show.quests ? `${idx * 100}ms` : '0ms'
              }}
            >
              <div className="flex justify-start items-center gap-2.5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600 flex-shrink-0" style={{ minWidth: 32, minHeight: 32 }}>
                  <circle cx="12" cy="12" r="12" fill="#334155"/>
                  <circle cx="12" cy="12" r="5" fill="currentColor"/>
                </svg>
                <div className="justify-center text-blue-300 text-lg font-normal font-['Work_Sans'] leading-snug">
                  <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline">{issue.title}</a>
                </div>
              </div>
              <div className="p-1.5 select-none bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">{issue.html_url.split('/').slice(3, 5).join('/')}</div>
              </div>
            </div>
          )) : (
            <div className={`text-white text-base transition-all duration-300 ${
              show.quests ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-0'
            }`}>No assigned issues</div>
          )}
        </div>
      </div>
    </div>
  )
}
