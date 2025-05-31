export default function Leaderboard() {
  const leaderboard = [
    { rank: 1, name: 'avadac00' },
    { rank: 2, name: 'avadac01' },
    { rank: 3, name: 'avadac02' },
    { rank: 4, name: 'hackerman' },
    { rank: 5, name: 'avadac03' },
    { rank: 6, name: 'avadac04' },
    { rank: 7, name: 'avadac05' },
    { rank: 8, name: 'avadac06' },
  ];

  return (
    <div className="flex-1 p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Leaderboard</div>
      {leaderboard.map((entry) => (
        <div key={entry.rank} className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-start items-center gap-5">
            <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">{entry.rank}</div>
            <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">{entry.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
