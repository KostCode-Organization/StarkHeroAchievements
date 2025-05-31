export default function Achievements() {
  return (
    <div className="self-stretch p-5 bg-slate-950 rounded-2xl outline outline-2 outline-offset-[-2px] outline-slate-900 flex flex-col justify-start items-start gap-3.5 overflow-hidden">
      <div className="justify-center text-white text-3xl font-bold font-['Work_Sans'] leading-9">Achievements</div>
      <div className="inline-flex justify-start items-start gap-2.5">
        <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
        <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
        <img className="w-24 h-24 rounded-[20px]" src="https://placehold.co/96x95" />
      </div>
    </div>
  )
}
