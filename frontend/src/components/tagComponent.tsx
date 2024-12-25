import React from 'react'

interface TagComponentProps {
  tag: string;
  count: number;
}

function TagComponent({ tag, count }: TagComponentProps) {
  return (
    <div className='h-7  font-bold text-sm flex space-x-1 justify-center items-center m-1 '>
    <div className='bg-teal-400 bg-opacity-70 py-1 px-3  rounded-2xl'><h1>{tag}</h1></div>
      <h1>X</h1>
    <h1>{count}</h1>
    </div>
  )
}

export default TagComponent
