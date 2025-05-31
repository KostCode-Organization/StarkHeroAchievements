import { useGithubUser } from '../../context/githubUserContext';

export default function ProfileCard() {
  const { githubUser, githubStreak, githubMaxStreak } = useGithubUser();

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
        <div className="justify-center text-white text-lg font-normal font-['Inter'] underline leading-snug text-nowrap">
          {githubUser && githubUser.html_url ? (
            <a href={githubUser.html_url} target="_blank" rel="noopener noreferrer">
              github.com/{githubUser.login}
            </a>
          ) : (
            'github.com/avanakamoto'
          )}
        </div>
      </div>
      {/* Streak Status Bar */}
      <div className="self-stretch flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-white text-sm font-medium">Contribution Streak</span>
          <span className="text-teal-400 text-sm font-bold">{githubStreak} / {githubMaxStreak} days</span>
        </div>
        <div className="self-stretch h-2 bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-300" 
            style={{ 
              width: `${githubMaxStreak > 0 ? Math.min(100, (githubStreak / githubMaxStreak) * 100) : 0}%`, 
              height: '100%' 
            }} 
          />
        </div>
        <div className="text-center text-gray-400 text-xs">
          Current: {githubStreak} days • Best: {githubMaxStreak} days
        </div>
      </div>
    </div>
  );
}
