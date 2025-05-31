export default function Leaderboard() {
  const leaderboard = [
    { rank: 1, name: 'vadim-ghostman' },
    { rank: 2, name: 'vadim-ghostman' },
    { rank: 3, name: 'vadim-ghostman' },
  ];

  return (
    <div className="flex-1 p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Leaderboard</div>
      {leaderboard.map((entry) => (
        <div key={entry.rank} className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-start items-center gap-5">
            <div className="justify-center text-white text-xl font-bold font-['Work_Sans'] leading-7">{entry.rank}</div>
            <div className="justify-center text-white text-xl font-normal font-['Work_Sans'] leading-7">{entry.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
