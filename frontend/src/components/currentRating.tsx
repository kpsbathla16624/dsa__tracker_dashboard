import React, { useEffect, useState } from "react";
import userprops from "../models/profilesmodel";

const CurrentRating: React.FC<userprops> = ({ profiles }) => {
  const [leetcodeContestData, setLeetcodeData] = useState<Record<string, any>>(
    {}
  );
  async function GetLeetcodeContestData(userid: String) {
    const contestResponse = await fetch(
      `https://leetcodeapi-bolt.vercel.app/${userid}/contest`
    );
    if (contestResponse.ok) {
      const contestdata = await contestResponse.json();
      console.log(contestdata);
      setLeetcodeData(contestdata);
    } else {
      console.log("leetcodedata not availble");
    }
  }
  useEffect(() => {
    if (profiles.leetCode.username) {
      GetLeetcodeContestData(profiles.leetCode.username);
    }
  }, [profiles.leetCode.username]);

  return (
    <div className=" h-[350px]  flex flex-col justify-start items-center  my-2  p-4 border rounded-lg shadow-lg backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-800 via-black to-gray-800 bg-blur-xl">
      <h1 className="text-white font-bold text-xl ">Ratings</h1>
      <hr className="text-white border-white w-full" />
      <div className="flex flex-col my-0 justify-start w-full  items-start">
        <h2 className="text-teal-500 text-lg font-bold">CodeForces{" "}({profiles.codeForces.rank})</h2>
        <h1 className="text-white">
          {" "}
          Current Rating: {profiles.codeForces.rating}
        </h1>
        <h1 className="text-white">
          {" "}
          Max Rating: {profiles.codeForces.maxRating}
        </h1>
      </div>
      <div className="flex flex-col my-2 justify-start w-full  items-start">
        <h2 className="text-teal-500 text-lg font-bold">CodeChef ({profiles.codeChef.stars})</h2>
        
        <h1 className="text-white">
          {" "}
          Current Rating: {profiles.codeChef.currentRating}
        </h1>
        <h1 className="text-white">
          {" "}
          Max Rating: {profiles.codeChef.highestRating}
        </h1>
      </div>
      {Object.keys(leetcodeContestData).length > 0 ? (
        <div className="flex flex-col my-2 justify-start w-full  items-start">
          <h2 className="text-teal-500 text-lg font-bold">LeetCode</h2>
          <h1 className="text-white">
            Current Rating: {parseInt(leetcodeContestData.contestRating) || 0}
          </h1>

          <h1 className="text-white">
            {" "}
            Max Rating: {leetcodeContestData.contestGlobalRanking || 0}/
            {leetcodeContestData.totalParticipants || 0}
          </h1>
        </div>
      ) : (
        <div className="text-white">Leetcode data not available </div>
      )}
    </div>
  );
};

export default CurrentRating;
