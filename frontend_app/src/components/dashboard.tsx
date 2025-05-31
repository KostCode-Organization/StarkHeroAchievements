import Achievements from "./dashboard/achievements";
import Contributions from "./dashboard/contributions";
import Leaderboard from "./dashboard/leaderboard";
import ProfileCard from "./dashboard/profileCard";
import QuestBoard from "./dashboard/questBoard";
import RecentActivity from "./dashboard/recentActivity";

export default function Dashboard() {
  return (
    <div className="w-full px-40 py-14 bg-zinc-950 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-end gap-10">
        <div className="self-stretch inline-flex justify-start items-start gap-7">
          <div className="w-fit inline-flex flex-col justify-start items-start gap-7">
            <ProfileCard />
            <Achievements />
          </div>
          <div className="w-full inline-flex flex-col justify-start items-start gap-7">
            <Contributions />
            <div className="self-stretch inline-flex justify-start items-start gap-5">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
                <RecentActivity />
                <QuestBoard />
              </div>
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}