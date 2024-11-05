import React, { useEffect, useState } from 'react'

function Trial() {
    const [data ,setData] = useState({});
  async function  getdata(){
    const response = await fetch("https://leetcodeapi-production.up.railway.app/kamalpreet6198");
    if (response.ok) {
        const responsedata = await response.json();
        setData(responsedata);
    }
    console.log(data);
    }
    useEffect(() => {getdata() },[])
  return (
    <div>
        
    </div>
  )
}

export default Trial
