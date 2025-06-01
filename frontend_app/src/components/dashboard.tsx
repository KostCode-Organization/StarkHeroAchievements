import { useState } from "react";
import Achievements from "./dashboard/achievements";
import AIScore from "./dashboard/aiScore";
import Contributions from "./dashboard/contributions";
import Leaderboard from "./dashboard/leaderboard";
import ProfileCard from "./dashboard/profileCard";
import QuestBoard from "./dashboard/questBoard";
import RecentActivity from "./dashboard/recentActivity";

export default function Dashboard() {
  const [showTab, setShowTab] = useState("quests");

  return (
    <div className="w-full px-40 py-14 bg-zinc-950 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-end gap-10">
        <div className="self-stretch inline-flex justify-start items-start gap-7">
          <div className="w-fit inline-flex flex-col justify-start items-start gap-7">
            <ProfileCard />
            <Leaderboard />
          </div>
          <div className="w-full inline-flex flex-col justify-start items-start gap-7">
            <Contributions />
            <div className="self-stretch flex flex-col items-center gap-5">
              <Achievements />
              <div className="flex w-full gap-5">
                <div className="flex flex-col w-full items-start gap-5">
                  <RecentActivity show={showTab === 'recent'} setShowTab={setShowTab} />
                  <QuestBoard show={showTab === 'quests'} setShowTab={setShowTab} />
                </div>
                <AIScore />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}