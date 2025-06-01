import { useState } from "react";
import Achievements from "./dashboard/achievements";
import AIScore from "./dashboard/aiScore";
import Contributions from "./dashboard/contributions";
import Leaderboard from "./dashboard/leaderboard";
import ProfileCard from "./dashboard/profileCard";
import QuestBoard from "./dashboard/questBoard";
import RecentActivity from "./dashboard/recentActivity";

export interface ActivityProps {
  show: { quests: boolean, recent: boolean };
  setShowTab: React.Dispatch<React.SetStateAction<{ quests: boolean; recent: boolean }>>;
}

export default function Dashboard() {
  const [showTab, setShowTab] = useState({ recent: true, quests: true });

  return (
    <div className="w-full px-40 py-14 bg-zinc-950 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-end gap-10">
        <div className="self-stretch inline-flex justify-start items-start gap-7">
          <div className="w-fit inline-flex flex-col justify-start items-start gap-7">
            <ProfileCard />
            <AIScore />
            <Leaderboard />
          </div>
          <div className="w-full inline-flex flex-col justify-start items-start gap-7">
            <Contributions />
            <div className="self-stretch flex flex-col items-center gap-5">
              <Achievements />
              <div className="flex w-full items-start gap-5">
                <RecentActivity show={showTab} setShowTab={setShowTab} />
                <QuestBoard show={showTab} setShowTab={setShowTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}