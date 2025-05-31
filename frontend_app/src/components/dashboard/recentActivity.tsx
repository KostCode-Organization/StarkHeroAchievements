export default function RecentActivity() {
  const activities = [
    { title: 'Open source sprint', xp: 148, time: '4d ago' },
    { title: 'Bug bounty', xp: 200, time: '2d ago' },
    { title: 'Code review', xp: 120, time: '1d ago' },
    { title: 'Write docs', xp: 100, time: '6h ago' },
  ];

  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Recent activity</div>
      {activities.map((activity, idx) => (
        <div key={idx} className="self-stretch inline-flex justify-between items-center overflow-hidden">
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
            <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">{activity.title}</div>
            <div className="justify-center text-neutral-600 text-sm font-normal font-['Work_Sans'] leading-none">{activity.time}</div>
          </div>
          <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
            <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">{activity.xp} XP</div>
          </div>
        </div>
      ))}
    </div>
  )
}
