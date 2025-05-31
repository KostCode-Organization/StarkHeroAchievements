export default function Contributions() {
  // Example: 52 weeks x 7 days = 364 days (GitHub style)
  // Each value is number of contributions for that day
  const daysInWeek = 7;
  const weeksInYear = 52;
  // Generate random data for demo; replace with real data as needed
  const contributions: number[][] = Array.from({ length: weeksInYear }, () =>
    Array.from({ length: daysInWeek }, () => Math.floor(Math.random() * 10))
  );

  // Color scale for contributions (0 = gray-800, 1-2 = teal-900, 3-5 = teal-800, 6+
  function getColor(count: number) {
    if (count === 0) return 'bg-gray-800';
    if (count < 3) return 'bg-teal-900';
    if (count < 6) return 'bg-teal-800';
    return 'bg-teal-600';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-7">
      <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
        <div className="text-white text-3xl font-bold font-['Work_Sans'] leading-9 mb-4">Contribution heatmap</div>
        {/* Month labels */}
        <div className="grid grid-cols-12 w-full mb-2 px-2">
          {months.map((month) => (
            <div key={month} className="text-white text-xs font-semibold font-['Work_Sans'] text-center tracking-wide opacity-80">
              {month}
            </div>
          ))}
        </div>
        {/* Grid heatmap */}
        <div className="w-full overflow-x-auto">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${weeksInYear}, minmax(0, 1fr))`, gap: '4px' }}>
            {contributions.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((count, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`w-full aspect-square rounded ${getColor(count)}`}
                    title={`${dayNames[dayIdx]}, Week ${weekIdx + 1}: ${count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}