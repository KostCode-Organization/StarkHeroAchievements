export default function Leaderboard() {
  const leaderboard = [
    { rank: 1, name: 'vadim-ghostman', achievements: 3 },
    { rank: 2, name: 'faurdent', achievements: 2 },
    { rank: 3, name: 'waterscape03', achievements: 2 },
    { rank: 4, name: 'djeck1432', achievements: 1 },
    { rank: 5, name: 'zimaexe', achievements: 1 },
  ];

  return (
    <div className="w-full p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-2xl font-bold font-['Work_Sans'] leading-9">Leaderboard</div>
      {leaderboard.map((entry) => (
        <div key={entry.rank} className="self-stretch px-5 py-3 bg-gray-900 rounded-[10px] inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-start items-center gap-5">
            <div className="justify-center text-white text-xl font-bold font-['Work_Sans'] leading-7">{entry.rank}</div>
            <a className="justify-center text-white text-[18px] font-normal font-['Work_Sans'] leading-7 hover:text-blue-300" href={"https://github.com/" + entry.name}>{entry.name}</a>
          </div>
          <p className="text-slate-300 text-xs">{entry.achievements} minted NFTs</p>
        </div>
      ))}
    </div>
  )
}
