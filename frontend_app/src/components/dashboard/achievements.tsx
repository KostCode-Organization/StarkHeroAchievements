import { useGithubUser } from '../../context/githubUserContext';
import { NFTService } from '../../services/nftService';
import output from "./output.json";
import { useState, useEffect } from 'react';

type AchievementProps = {
  id: number;
  name: string;
  icon: string,
  status: string
};

function Achievement({ achievement, onMint, isMinting }: { 
  achievement: AchievementProps; 
  onMint: (achievement: AchievementProps) => void;
  isMinting?: boolean;
}) {
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
          <button 
            onClick={() => onMint(achievement)}
            disabled={isMinting}
            className={`text-white text-sm w-full py-1 rounded-md flex justify-center items-center transition-colors ${
              isMinting 
                ? 'bg-slate-700 cursor-not-allowed' 
                : 'bg-slate-900 hover:bg-slate-800 cursor-pointer'
            }`}
          >
            <span className="text-white select-none text-base font-bold">
              {isMinting ? 'Minting...' : 'Mint'}
            </span>
          </button>
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
  const [mintingStates, setMintingStates] = useState<Record<number, boolean>>({});
  const [mintedNFTs, setMintedNFTs] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const statusOrder: Record<string, number> = { locked: 0, unlocked: 1, minted: 2 };

  // Fetch minted NFTs when wallet changes
  useEffect(() => {
    const fetchMintedNFTs = async () => {
      if (!wallet) {
        setMintedNFTs([]);
        return;
      }

      setLoading(true);
      try {
        const nfts = await NFTService.fetchMintedNFTs(wallet);
        setMintedNFTs(nfts);
      } catch (error) {
        console.error('Failed to fetch minted NFTs:', error);
        setMintedNFTs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMintedNFTs();
  }, [wallet]);

  const handleMint = async (achievement: AchievementProps) => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }

    // Get the achievement ID from the NFTService
    const achievementId = NFTService.getAchievementId(achievement.name);
    if (!achievementId) {
      alert(`Unknown achievement: ${achievement.name}`);
      return;
    }

    // Set minting state
    setMintingStates(prev => ({ ...prev, [achievement.id]: true }));

    try {
      const result = await NFTService.mintAchievement({
        wallet_address: wallet,
        achievement_id: achievementId,
        amount: 1
      });

      if (result.success) {
        alert(`Successfully minted ${achievement.name}! Transaction: ${result.transaction_hash}`);
        // Refresh minted NFTs data
        if (wallet) {
          const updatedNFTs = await NFTService.fetchMintedNFTs(wallet);
          setMintedNFTs(updatedNFTs);
        }
      } else {
        alert('Minting failed');
      }
    } catch (error) {
      console.error('Minting error:', error);
      alert(`Minting failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setMintingStates(prev => ({ ...prev, [achievement.id]: false }));
    }
  };

  const achievements = output.map((item: any, idx) => {
    const achievementId = idx + 1;
    console.log('Achievement item:', item);
    const achievementName = item.file.split('.')[0].split('_').join(' ');
    
    // Determine status based on:
    // 1. If it's in the last 10 (idx >= 10) -> locked
    // 2. If it's minted (based on fetched NFT data) -> minted  
    // 3. Otherwise -> unlocked
    let status = 'unlocked';
    
    if (idx >= 10) {
      // Last 10 achievements are locked
      status = 'locked';
    } else if (mintedNFTs.includes(achievementId)) {
      // Achievement is minted
      status = 'minted';
    }
    
    return {
      id: achievementId,
      name: achievementName,
      icon: `https://ipfs.io/ipfs/${item.imageCid}`,
      status
    };
  }).sort((a, b) => {
    return -(statusOrder[a.status] - statusOrder[b.status]);
  });

  console.log('Achievements:', achievements);

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-2xl font-bold font-['Work_Sans'] leading-9">Achievements</div>
      {wallet ? (
        loading ? (
          <div className="w-full px-4 py-16 text-center">
            <p className="text-gray-400 text-lg">Loading your achievements...</p>
          </div>
        ) : (
          <div
            className="grid w-full gap-4 gap-y-8"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center">
                <Achievement 
                  achievement={achievement} 
                  onMint={handleMint} 
                  isMinting={mintingStates[achievement.id] || false}
                />
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="text-gray-400 text-lg">No achievements yet</div>
            )}
          </div>
        )
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
