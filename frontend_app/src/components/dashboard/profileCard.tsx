import { useGithubUser } from '../../context/githubUserContext';

export default function ProfileCard() {
  const { githubUser, githubStreak } = useGithubUser();

  return (
    <div className="self-stretch px-14 py-12 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-center gap-7 overflow-hidden">
      <div className="flex flex-col justify-start items-center gap-3.5">
        <div className="flex flex-col justify-start items-center gap-3.5">
          {githubUser && githubUser.avatar_url ? (
            <img src={githubUser.avatar_url} alt="avatar" className="w-28 h-28 rounded-full" />
          ) : (
            <div className="w-28 h-28 bg-zinc-300 rounded-full" />
          )}
          <div className="text-center justify-center text-white text-2xl font-bold font-['Inter'] leading-7">
            {githubUser && githubUser.name ? githubUser.name : 'Ava Nakamoto'}
          </div>
        </div>
        <div className="justify-center text-white text-lg font-normal font-['Inter'] underline leading-snug">
          {githubUser && githubUser.html_url ? (
            <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">
              github.com/{githubUser.login}
            </a>
          ) : (
            'github.com/avanakamoto'
          )}
        </div>
      </div>
      {/* Progress bar: Contribution streak toward 30-day goal */}
      <div className="self-stretch h-3.5 bg-gray-900 rounded-[20px] inline-flex justify-start items-start overflow-hidden">
        <div className="bg-blue-900 rounded-[20px] transition-all duration-300" style={{ width: `${Math.min(100, (githubStreak / 30) * 100)}%`, height: '100%' }} />
      </div>
      <div className="text-white text-xs mt-1">{githubStreak} day contribution streak (out of 30)</div>
    </div>
  );
}
