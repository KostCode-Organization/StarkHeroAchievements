import { useGithubUser } from "../../context/githubUserContext";
import { useMemo } from "react";
import GaugeComponent from "react-gauge-component";


export default function AIScore() {
  const { githubActivity, usedAI } = useGithubUser();
  const contributions = useMemo(() => {
    if (githubActivity && Array.isArray(githubActivity)) {
      const total = githubActivity.filter(item => 
        item[4] === 'issue' || (!item[4] && !item[2]?.toLowerCase().includes('pull request'))
      ).length;

      const aiUsed = usedAI.filter((used) => used).length;

      return { total, aiUsed }
    }
    return { total: 0, aiUsed: 0 };
  }, [githubActivity, usedAI]);

  const score = parseInt((contributions.aiUsed / contributions.total * 100).toFixed(0));

  return (
    <div className="w-[30%] h-fit p-5 bg-blue-500/30 rounded-2xl outline outline-2 outline-offset-[-2px] outline-blue-500 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-2xl font-bold font-['Work_Sans'] leading-9">AI score</div>
      <GaugeComponent
        value={score}
        marginInPercent={{
          top: 0.08,
          bottom: 0.00,
          left: 0.05,
          right: 0.05
        }}
        labels={{
          valueLabel: {
            style: {fontSize: '48px', fontWeight: 'bold'},
            formatTextValue: (value) => value,
            matchColorWithArc: true,
            maxDecimalDigits: 0,
          },
          tickLabels: {
            type: "outer",
            ticks: [
              { value: 0 },
              { value: 30 },
              { value: 60 },
              { value: 100 }
            ],
            defaultTickValueConfig: {
              formatTextValue: (value) => value
            }
          }
        }}
        arc={{
          colorArray: ['#5BE12C', '#FFFF00', '#FF0000'],
          emptyColor: '#10182A',
          subArcs: [{limit: 30}, {limit: 60}, {limit: 100}],
          padding: 0.06,
          width: 0.35,
        }}
      />
      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">
        Detected <span className="font-bold">{contributions.aiUsed}</span> out of <span className="font-bold">{contributions.total}</span> AI-assisted contributions
      </div>
    </div>
  )
}
