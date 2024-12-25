"use client";
import React, { useEffect, useState } from 'react'

import CodechefRatingGraph from './codechefLineChart';
import CodeforcesRatingGraph from './codeforcesLinechart copy';
import { userProps } from '../models/profilesmodel';


const Ratingcharts: React.FC<userProps> = ({ user }) => {
    const [codeforcesRatingData, setCodeforcesRatingData] = useState<any | null>({})
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Codeforces" | "CodeChef">(
        "CodeChef"
      );
      const [codechefProfile, setCodechefProfile] = useState<Record<string, any>>(
        {}
      );
    async function  getCodeForcesGraph() {
        setLoading(true);
        const contestresponse = await fetch(`https://codeforces.com/api/user.rating?handle=${user.codeforces}`);
        if (contestresponse.ok) {
          const contestData = await contestresponse.json();
          console.log("Codeforces contest data:", contestData);
          setCodeforcesRatingData(contestData.result);
        } else {
          console.warn("No Codeforces contest data available.");
        }


        
    }
    async function  getCodeChefGraph() {
        setLoading(true);
        
        const codechefResponse = await fetch(
          `https://codechef-api-five.vercel.app/handle/${user.codechef}`
        );
        if (codechefResponse.status === 200) {
          const data = await codechefResponse.json();
          console.log("CodeChef profile:", data);
          setCodechefProfile(data);
        } else {
          console.warn("No CodeChef data available.");
        }
        setLoading(false);
    }

    useEffect(() => {
        getCodeForcesGraph();
        getCodeChefGraph();
    }
    , []);
    if (loading) {
        return (
          <div className="border-white rounded-lg border-2 p-4 w-full h-full">
            <div className="w-full h-full animate-pulse shimmer-effect flex flex-col space-y-4 justify-center">
              <div className="h-6 bg-gray-300 rounded opacity-50 "></div>
              <div className="h-6 bg-gray-300 rounded opacity-50 "></div>
              <div className="h-6 bg-gray-300 rounded opacity-50 "></div>
              <div className="h-6 bg-gray-300 rounded opacity-50 "></div>
              <div className="h-6 bg-gray-300 rounded opacity-50 "></div>
            </div>
          </div>
        );
    }
  return ( 
    <div className='h-full w-full flex flex-col border-white border rounded-xl p-2'>

        <div className='w-full flex justify-between items-center '> 
        <h1 className="text-white font-bold text-xl ">{activeTab} Rating Graph</h1>
       <div className='flex justify-end items-center space-x-5'> <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "Codeforces"
                ? "bg-teal-400 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => {
              setActiveTab("Codeforces");
             
            }}
          >
            Codeforces
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "CodeChef"
                ? "bg-teal-400 text-white"
                : "bg-gray-700 text-gray-200"
            }`}
            onClick={() => {
              setActiveTab("CodeChef");
         
            }}
          >
            CodeChef
          </button></div>
        </div>
        {activeTab === "Codeforces" ? <CodeforcesRatingGraph ratingData={codeforcesRatingData} /> : <CodechefRatingGraph ratingData={codechefProfile.ratingData} />}
      
    </div>
  )
}

export default Ratingcharts
