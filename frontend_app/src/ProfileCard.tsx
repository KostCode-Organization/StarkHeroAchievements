import React from 'react'

export default function ProfileCard() {
  return (
    <div className="bg-[#0B1019] border-[2px] border-[#151D2D] text-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs mx-auto">
      <div className="size-[120px] bg-gray-400 rounded-full mb-4 flex items-center justify-center">
        <span className="text-4xl">👤</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">Ava Nakamoto</h3>
      <h3 className="text-xl font-semibold mb-2">@avanakamoto</h3>
      <div className='flex rounded-xl w-full bg-[#151D2D] overflow-hidden'>
        <div className='w-[80%] bg-white h-10'/>
      </div>
      {/* Add more profile details here as needed */}
    </div>
  )
}