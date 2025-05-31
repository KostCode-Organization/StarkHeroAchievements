import { useGithubUser } from '../../context/githubUserContext';

type AchievementProps = {
  id: number;
  name: string;
  icon: string,
  status: string
};

function Achievement({ achievement }: { achievement: AchievementProps }) {
  return (
    <div title={achievement.name} className="size-[100px] bg-gray-800 rounded-[20px] flex justify-center items-center overflow-hidden relative">
      <img className="size-[100px]" src={achievement.icon} alt="Locked Achievement Icon" />
      {achievement.status === 'locked' && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded flex justify-center items-center">
          <span className="text-gray-500 text-sm">Locked</span>
        </div>
      )}
      {achievement.status === 'unlocked' && (
        <div className="absolute top-0 left-0 w-full h-full bg-green-500 bg-opacity-50 text-white text-sm px-2 py-1 rounded flex justify-center items-center">
          <span className="text-green-200 text-sm">Mint</span>
        </div>
      )}
    </div>
  );
}

export default function Achievements() {
  const { wallet } = useGithubUser();
  const achievements = [
    { id: 1, name: 'First task completed', icon: 'https://ipfs.io/ipfs/Qmb5CuL1G95RWbNpqiawSg4SAo2mBbj7gVkeWK5jCwAGaY', status: 'locked' },
    { id: 2, name: 'Month contributor', icon: 'https://ipfs.io/ipfs/QmNoRyj4ko99CD1hyTuDNkk2t8zhqkzf8qUHvCdTTb7278', status: 'unlocked' },
    { id: 3, name: '50 tasks completed', icon: 'https://ipfs.io/ipfs/QmddmrGqEGpg2uHSVNe99WQP4zisbSkjuv2bxJBq36Ci9F', status: 'minted' },
  ];

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Achievements</div>
      {wallet ? (
        <div className="inline-flex justify-start items-start gap-2.5">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="flex flex-col items-center">
              <Achievement achievement={achievement} />
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="text-gray-400 text-lg">No achievements yet</div>
          )}
        </div>
      ) : (
        <div className="w-full p-4 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 text-center">
          <p className="text-gray-400 text-lg">Connect your wallet to view achievements</p>
          <p className="text-gray-500 text-sm mt-2">
            Your on-chain achievements will appear here once you connect a wallet
          </p>
        </div>
      )}
    </div>
  )
}
