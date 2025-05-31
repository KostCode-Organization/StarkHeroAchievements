export default function ProfileCard() {
  return (
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
  )
}
