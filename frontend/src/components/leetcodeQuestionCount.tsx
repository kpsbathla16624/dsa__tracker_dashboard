import React from 'react'

function LeetcodeQuestionCount(leetcodedata:any) {
    const data = leetcodedata.leetcodedata;
  return (
    <div className='w-full max-w-96 h-full flex flex-col my-2 p-4 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-800 via-black to-gray-800 bg-blur-xl'>
        <h1 className="text-white font-bold text-md ">Leetcode Difficulty Count</h1>
        <hr className="text-white border-white w-full" />
       <div className='flex text-white p-2' >
        <h1>Easy:{" "}</h1>
        <h1 className='text-white'>
        {data.easySolved }

        </h1>
       </div>
       <div className='flex text-white p-2' >
        <h1>Meduim:{" "}</h1>
        <h1 className='text-white'>
        {data.mediumSolved }

        </h1>
       </div>
       <div className='flex text-white p-2' >
        <h1>Hard:{" "}</h1>
        <h1 className='text-white'>
        {data.hardSolved }

        </h1>
       </div>
    </div>
  )
}

export default LeetcodeQuestionCount
