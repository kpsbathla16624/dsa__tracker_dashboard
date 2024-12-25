"use client";
import React, { useState, useEffect } from "react";
import QuestionCountGraph from "../components/questioncountBarGraph";
import RatingBox from "../components/currentRating";
import HeatMap from "../components/heatmap";
import Ratingcharts from "../components/ratingchart";
import TagWiseCount from "../components/tagwisecount";


function StatsPage() {
  const [calendarSize, setCalendarSize] = useState({ blockSize: 12, blockMargin: 4 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
     if (width<900) {
      
       setCalendarSize({ blockSize: 8, blockMargin: 3 }); // For medium screens
     }
       else if (width < 1500 && width > 1024 ) {
        setCalendarSize({ blockSize: 10, blockMargin: 3 }); // For medium screens
      } 
      else {
        setCalendarSize({ blockSize: 12, blockMargin: 4 }); // For larger screens
      }
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="stats" className="z-50 px-5 lg:px-10 relative mt-20 text-white">
      
      <div className="grid grid-cols-1 md:grid-cols-10 gap-y-10 gap-x-4 grid-flow-row-dense auto-rows-auto">
        {/* QuestionCountGraph */}
        <div className="col-span-1 md:col-span-3 flex items-center justify-center flex-col max-h-[320px] overflow-y-hidden">
          <QuestionCountGraph />
        </div>

        {/* LeetcodeTags */}
        <div className="col-span-1 md:col-span-7 lg:col-span-5 flex items-center justify-center flex-col max-h-[400px] overflow-y-auto">
         <TagWiseCount/>
        </div>

        {/* RatingBox */}
        <div className="lg:col-span-2 col-span-3 flex items-center justify-center">
          <RatingBox />
        </div>

        {/* HeatMap */}
        <div className="col-span-1 md:col-span-10 lg:col-span-6 flex items-start justify-start flex-col bg-transparent">
          <HeatMap
            codechefId="kps_bathla"
            codeforcesId="kpsbathla"
            leetcodeId="kamalpreet6198"
          />
        </div>

        <div className="col-span-7 lg:col-span-4">
          <Ratingcharts />
        </div>

       
      </div>
    </div>
  );
}

export default StatsPage;
