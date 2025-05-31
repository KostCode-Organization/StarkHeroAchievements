export default function Dashboard() {
  return (
    <div className="w-full px-40 py-14 bg-zinc-950 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="self-stretch flex flex-col justify-start items-end gap-10">
        {/* <div className="h-12 px-5 py-2.5 bg-indigo-700 rounded-2xl inline-flex justify-center items-center">
          <div className="justify-center text-white text-xl font-bold font-['Work_Sans'] leading-normal">Connect Wallet</div>
        </div> */}
        <div className="self-stretch inline-flex justify-start items-start gap-7">
          <div className="w-96 inline-flex flex-col justify-start items-start gap-7">
            <div className="self-stretch px-14 py-12 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-center gap-7 overflow-hidden">
              <div className="flex flex-col justify-start items-center gap-3.5">
                <div className="flex flex-col justify-start items-center gap-3.5">
                  <div className="w-28 h-28 bg-zinc-300 rounded-full" />
                  <div className="text-center justify-center text-white text-2xl font-bold font-['Inter'] leading-7">Ava Nakamoto</div>
                </div>
                <div className="justify-center text-white text-lg font-normal font-['Inter'] underline leading-snug">github.com/avanakamoto</div>
              </div>
              <div className="self-stretch h-3.5 bg-gray-900 rounded-[20px] inline-flex justify-start items-start overflow-hidden">
                <div className="w-36 self-stretch bg-blue-900 rounded-[20px]" />
              </div>
            </div>
            <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
              <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Achievements</div>
              <div className="inline-flex justify-start items-start gap-2.5">
                <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
                <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
                <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
              </div>
            </div>
          </div>
          <div className="w-[1170px] inline-flex flex-col justify-start items-start gap-7">
            <div className="self-stretch flex flex-col justify-start items-start gap-7">
              <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
                <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Contribution heatmap</div>
                <div className="self-stretch h-5 relative overflow-hidden">
                  <div className="w-9 left-0 top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Apr</div>
                  <div className="w-9 left-[57.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">May</div>
                  <div className="w-9 left-[115px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Jun</div>
                  <div className="w-9 left-[172.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Jul</div>
                  <div className="w-9 left-[230px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Aug</div>
                  <div className="w-9 left-[287.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Sep</div>
                  <div className="w-9 left-[345px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Oct</div>
                  <div className="w-9 left-[402.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Nov</div>
                  <div className="w-9 left-[460px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Dec</div>
                  <div className="w-9 left-[517.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Jan</div>
                  <div className="w-9 left-[575px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Mar</div>
                  <div className="w-9 left-[632.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Apr</div>
                  <div className="w-9 left-[690px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">May</div>
                  <div className="w-9 left-[747.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Jun</div>
                  <div className="w-9 left-[805px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Jul</div>
                  <div className="w-9 left-[862.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Aug</div>
                  <div className="w-9 left-[920px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Sep</div>
                  <div className="w-9 left-[977.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Oct</div>
                  <div className="w-9 left-[1035px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Nov</div>
                  <div className="w-9 left-[1092.50px] top-0 absolute text-center justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">Dec</div>
                </div>
                <div className="self-stretch h-52 relative overflow-hidden">
                  <div className="w-9 h-9 left-0 top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[57.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[115px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[172.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[230px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[287.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[345px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[402.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[460px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[517.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[575px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[632.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[690px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[747.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[805px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[862.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[920px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[977.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1035px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1092.50px] top-0 absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-0 top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[57.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[115px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[172.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[230px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[287.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[345px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[402.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[460px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[517.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[575px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[632.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[690px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[747.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[805px] top-[56.50px] absolute bg-teal-800 rounded-lg" />
                  <div className="w-9 h-9 left-[862.50px] top-[56.50px] absolute bg-teal-800 rounded-lg" />
                  <div className="w-9 h-9 left-[920px] top-[56.50px] absolute bg-teal-800 rounded-lg" />
                  <div className="w-9 h-9 left-[977.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1035px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1092.50px] top-[56.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-0 top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[57.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[115px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[172.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[230px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[287.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[345px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[402.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[460px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[517.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[575px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[632.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[690px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[747.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[805px] top-[113px] absolute bg-teal-800 rounded-lg" />
                  <div className="w-9 h-9 left-[862.50px] top-[113px] absolute bg-teal-800 rounded-lg" />
                  <div className="w-9 h-9 left-[920px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[977.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1035px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1092.50px] top-[113px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-0 top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[57.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[115px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[172.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[230px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[287.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[345px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[402.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[460px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[517.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[575px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[632.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[690px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[747.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[805px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[862.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[920px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[977.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1035px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                  <div className="w-9 h-9 left-[1092.50px] top-[169.50px] absolute bg-gray-800 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-5">
              <div className="flex-1 inline-flex flex-col justify-center items-start gap-5">
                <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
                  <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Recent activity</div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                      <div className="justify-center text-neutral-600 text-sm font-normal font-['Work_Sans'] leading-none">4d ago</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                      <div className="justify-center text-neutral-600 text-sm font-normal font-['Work_Sans'] leading-none">4d ago</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                      <div className="justify-center text-neutral-600 text-sm font-normal font-['Work_Sans'] leading-none">4d ago</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                </div>
                <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
                  <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Quest board</div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                  <div className="self-stretch inline-flex justify-between items-center overflow-hidden">
                    <div className="flex justify-start items-center gap-2.5">
                      <div className="w-8 h-8 bg-zinc-300 rounded-lg" />
                      <div className="justify-center text-white text-lg font-normal font-['Work_Sans'] leading-snug">Open source sprint</div>
                    </div>
                    <div className="p-1 bg-stone-800 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex justify-center items-center">
                      <div className="justify-center text-white text-sm font-normal font-['Work_Sans'] leading-none">148 XP</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 inline-flex flex-col justify-start items-start gap-3.5 overflow-hidden">
                <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Leaderboard</div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">1</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac00</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">2</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac01</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">3</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac02</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">4</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">hackerman</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">5</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac03</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">6</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac04</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">7</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac05</div>
                  </div>
                </div>
                <div className="self-stretch px-7 py-5 bg-gray-900 rounded-[20px] inline-flex justify-between items-center overflow-hidden">
                  <div className="flex justify-start items-center gap-5">
                    <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">8</div>
                    <div className="justify-center text-white text-3xl font-normal font-['Work_Sans'] leading-9">avadac06</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}