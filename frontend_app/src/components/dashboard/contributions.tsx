import { useGithubUser } from '../../context/githubUserContext';
import { useMemo } from 'react';

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const suffix = (d: number) => (d > 3 && d < 21) ? 'th' : ['st', 'nd', 'rd'][((d % 10) - 1)] || 'th';
  return `${month} ${day}${suffix(day)}`;
}

export default function Contributions() {
  const { githubActivity } = useGithubUser();
  // Count contributions per day
  const dayCounts: Record<string, number> = {};
  if (githubActivity && Array.isArray(githubActivity)) {
    githubActivity.forEach((item: any) => {
      // Only use YYYY-MM-DD for grouping
      const day = item[3]?.slice(0, 10);
      if (day) dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
  }
  // Sort days descending (most recent first)
  const sortedDays = Object.keys(dayCounts).sort((a, b) => b.localeCompare(a));

  const daysInWeek = 7;
  const weeksInYear = 52;

  // Build a set of YYYY-MM-DD strings for days with activity
  const activityDays = useMemo(() => {
    if (!githubActivity || !Array.isArray(githubActivity)) return new Set();
    return new Set(githubActivity.map((item) => item[3]?.slice(0, 10)));
  }, [githubActivity]);

  // Build the grid: for each day in the past 52 weeks, mark 1 if activity, 0 if not
  const today = new Date();
  const contributions: { count: number; date: string }[][] = [];
  for (let w = 0; w < weeksInYear; w++) {
    const week: { count: number; date: string }[] = [];
    for (let d = 0; d < daysInWeek; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - ((weeksInYear - 1 - w) * 7 + d));
      const iso = date.toISOString().slice(0, 10);
      week.push({ count: activityDays.has(iso) ? 1 : 0, date: iso });
    }
    contributions.push(week);
  }

  function getColor(count: number) {
    if (count === 0) return 'bg-gray-800';
    return 'bg-teal-600';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                {week.map((cell, dayIdx) => {
                  const contributionCount = dayCounts[cell.date] || 0;
                  const dateFormatted = formatDate(cell.date);
                  return (
                    <div
                      key={dayIdx}
                      className={`w-full aspect-square rounded ${getColor(cell.count)}`}
                      title={`${dateFormatted}: ${contributionCount} contribution${contributionCount !== 1 ? 's' : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}