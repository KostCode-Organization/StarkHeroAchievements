export default function QuestBoard() {
  const quests = [
    { title: 'Open source sprint', xp: 148 },
    { title: 'Bug bounty', xp: 200 },
    { title: 'Write documentation', xp: 100 },
    { title: 'Code review marathon', xp: 175 },
  ];

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Quest board</div>
      {quests.map((quest, idx) => (
        <div key={idx} className="self-stretch inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
            <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">{quest.title}</div>
          </div>
          <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
            <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">{quest.xp} XP</div>
          </div>
        </div>
      ))}
    </div>
  )
}
