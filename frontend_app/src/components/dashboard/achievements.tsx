import { useGithubUser } from '../../context/githubUserContext';
import output from "./output.json";

type AchievementProps = {
  id: number;
  name: string;
  icon: string,
  status: string
};

function Achievement({ achievement }: { achievement: AchievementProps }) {
  return (
    <div title={achievement.name} className="flex flex-col justify-center items-center relative gap-2">
      {achievement.status === 'locked' && (
        <>
          <p className='text-[18px] text-white'>{achievement.name}</p>
          <img className="size-[200px] rounded-[15px]" src={achievement.icon} alt="Locked Achievement Icon" />
          <div className="absolute bottom-0 left-0 rounded-[15px] bg-black/60 backdrop-blur-[2px] size-[200px] text-white text-sm px-2 py-1 flex justify-center items-center">
            <img src='/padlock-icon.png' alt='lock icon' className='size-[80px]' />
          </div>
        </>
      )}
      {achievement.status === 'unlocked' && (
        <>
          <p className='text-[18px] text-white'>{achievement.name}</p>
          <img className="size-[200px] rounded-[15px]" src={achievement.icon} alt="Locked Achievement Icon" />
          <div className="text-white text-sm w-full py-1 rounded-md bg-slate-900 flex justify-center items-center">
            <span className="text-white select-none text-base font-bold">Mint</span>
          </div>
        </>
      )}
      {achievement.status === 'minted' && (
        <>
          <p className='text-[18px] font-bold text-blue-400'>{achievement.name}</p>
          <img className="border-[2px] border-blue-300 size-[200px] rounded-[15px]" src={achievement.icon} alt="Locked Achievement Icon" />
        </>
      )}
    </div>
  );
}

export default function Achievements() {
  const { wallet } = useGithubUser();
  const statusOrder: Record<string, number> = { locked: 0, unlocked: 1, minted: 2 };

  const achievements = output.map((item: any, idx) => ({
    id: idx + 1,
    name: item.file.split('.')[0].split('_').join(' '),
    icon: `https://ipfs.io/ipfs/${item.imageCid}`,
    status: idx < 3 ? 'minted' : (idx < 9 ? 'unlocked' : 'locked')
  })).sort((a, b) => {
    return -(statusOrder[a.status] - statusOrder[b.status]);
  });

  console.log('Achievements:', achievements);

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-2xl font-bold font-['Work_Sans'] leading-9">Achievements</div>
      {wallet ? (
        <div
          className="grid w-full gap-4 gap-y-8"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
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
        <div className="w-full px-4 py-16 bg-slate-800 rounded-lg border-2 border-dashed border-slate-600 text-center">
          <p className="text-gray-400 text-lg">Connect your wallet to view achievements</p>
          <p className="text-gray-500 text-sm mt-2">
            Your on-chain achievements will appear here once you connect a wallet
          </p>
        </div>
      )}
    </div>
  )
}
