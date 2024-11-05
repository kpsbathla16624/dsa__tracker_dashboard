import React from 'react';

interface UserData {
    _id?: string;
    name: string;
    email: string;
  }
  
  interface MyComponentProps {
    user: UserData; // JSON object as a prop
  }
  const Welcomebar: React.FC<MyComponentProps> = ({ user }) => {
  return (
    <div className='w-full h-min flex-col  space-y-2 justify-start  p-1   items-end '>
        <h1 className='text-3xl font-sans font-semibold text-teal-300'>Welcome, {user.name}</h1>
        <h1 className='text-teal-100'>Ready For today's challenges? </h1>
      
      
    </div>
  )
}

export default Welcomebar
