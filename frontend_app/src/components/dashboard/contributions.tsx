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
  const { githubActivity, githubContributionDays } = useGithubUser();
  
  // Debug: Log the activity data
  console.log('DEBUG: githubActivity:', githubActivity);
  console.log('DEBUG: githubContributionDays:', githubContributionDays);
  
  // Use contribution days if available, otherwise fall back to parsing activity
  const contributionDaysSet = useMemo(() => {
    if (githubContributionDays && githubContributionDays.length > 0) {
      return new Set(githubContributionDays);
    }
    
    // Fallback: parse from activity data
    const days = new Set<string>();
    if (githubActivity && Array.isArray(githubActivity)) {
      githubActivity.forEach((item: any) => {
        const day = item[3]?.slice(0, 10);  // closed_at date
        if (day) days.add(day);
      });
    }
    return days;
  }, [githubActivity, githubContributionDays]);
  
  // Count contributions per day (for tooltip purposes)
  const dayCounts: Record<string, number> = {};
  if (githubActivity && Array.isArray(githubActivity)) {
    githubActivity.forEach((item: any) => {
      // Only use YYYY-MM-DD for grouping
      const day = item[3]?.slice(0, 10);
      if (day) dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
  }

  console.log('DEBUG: contributionDaysSet:', contributionDaysSet);
  console.log('DEBUG: dayCounts:', dayCounts);

  const daysInWeek = 7;
  const weeksInYear = 52;

  // Build a set of YYYY-MM-DD strings for days with activity
  const activityDays = contributionDaysSet;

  // Build the grid: for each day in the past 52 weeks, mark 1 if activity, 0 if not
  const contributions = useMemo(() => {
    const today = new Date();
    const grid: { count: number; date: string }[][] = [];
    for (let w = 0; w < weeksInYear; w++) {
      const week: { count: number; date: string }[] = [];
      for (let d = 0; d < daysInWeek; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - ((weeksInYear - 1 - w) * 7 + d));
        const iso = date.toISOString().slice(0, 10);
        week.push({ count: activityDays.has(iso) ? 1 : 0, date: iso });
      }
      grid.push(week);
    }
    return grid;
  }, [activityDays, weeksInYear, daysInWeek]);

  function getColor(count: number) {
    if (count === 0) return 'bg-gray-800';
    return 'bg-teal-600';
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Generate month labels aligned with the grid weeks
  const monthLabels = useMemo(() => {
    const today = new Date();
    const labels: { month: string; weekIndex: number }[] = [];
    let currentMonth = -1;
    
    for (let w = 0; w < weeksInYear; w++) {
      const date = new Date(today);
      date.setDate(today.getDate() - ((weeksInYear - 1 - w) * 7));
      const month = date.getMonth();
      
      // Only add label for the first week of each month, and skip if it's too close to the end
      if (month !== currentMonth && w <= weeksInYear - 4) {
        labels.push({
          month: months[month],
          weekIndex: w
        });
        currentMonth = month;
      }
    }
    return labels;
  }, [months, weeksInYear]);

  // Calculate total contributions - should match what we're showing in recent activity (all issues, not just displayed ones)
  const totalContributions = useMemo(() => {
    if (githubActivity && Array.isArray(githubActivity)) {
      return githubActivity.filter(item => 
        item[4] === 'issue' || (!item[4] && !item[2]?.toLowerCase().includes('pull request'))
      ).length;
    }
    return 0;
  }, [githubActivity]);

  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-7">
      <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <div className="text-white text-3xl font-bold font-['Work_Sans'] leading-9">Contribution heatmap</div>
          <div className="text-white text-lg font-medium font-['Work_Sans']">
            {totalContributions} contributions
          </div>
        </div>
        {/* Month labels aligned with weeks */}
        <div className="relative w-full mb-2">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${weeksInYear}, minmax(0, 1fr))`, gap: '4px' }}>
            {Array.from({ length: weeksInYear }, (_, i) => {
              const monthLabel = monthLabels.find(label => label.weekIndex === i);
              return (
                <div key={i} className="text-white text-xs font-semibold font-['Work_Sans'] tracking-wide opacity-80">
                  {monthLabel ? monthLabel.month : ''}
                </div>
              );
            })}
          </div>
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