import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

interface AssignedIssue {
  html_url: string;
  title: string;
  repository?: { name?: string };
}

export default function QuestBoard() {
  const { githubUser } = useGithubUser();
  // Show assigned issues if available
  const assigned: AssignedIssue[] = useMemo(() => {
    if (!githubUser || !githubUser.assigned_issues) return [];
    return githubUser.assigned_issues;
  }, [githubUser]);

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Quest board</div>
      {assigned.length > 0 ? assigned.map((issue: AssignedIssue, idx: number) => (
        <div key={idx} className="self-stretch inline-flex justify-between items-center overflow-hidden">
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
        <div className="text-white text-base">No assigned issues</div>
      )}
    </div>
  )
}
