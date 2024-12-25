
import React, { useEffect, useState } from "react";
import getUserProfile from "../functions/getuserProfiles";

function RatingBox() {
  const [leetcodeContestData, setLeetcodeData] = useState<Record<string, any>>(
    {}
  );
  const [profiles, setProfiles] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchProfiles = async () => {
    setLoading(true);
    const data = await getUserProfile(
      "kps_bathla",
      "kpsbathla",
      "kamalpreet6198"
    );
    setProfiles(data);
    await GetLeetcodeContestData("kamalpreet6198");
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function GetLeetcodeContestData(userid: string) {
    setLoading(true);
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
    setLoading(false);
  }
  if (loading) {
    return (
      <div className=" border-white rounded-lg border-2 p-4 w-full h-full">
        <div className="w-full h-full animate-pulse shimmer-effect ">
        {" "}
      </div>
      </div>
    );
  }

  return (
    <div className=" h-full  max-h-[350px] flex flex-col justify-start items-center    px-3 py-2  border rounded-lg shadow-lg bg-transparent bg-blur-xl">
      <h1 className="text-white font-bold text-2xl ">Ratings</h1>
      <hr className="text-white border-white w-full" />
      <div className="flex flex-col my-0 justify-start w-full  items-start">
        <h2 className="text-teal-400 text-lg font-bold">
          CodeForces 
        </h2>
        <h1 className="text-white">
          {" "}
          Current Rating: {profiles.codeForces.rating ?? ""}
        </h1>
        <h1 className="text-white">
          {" "}
          Max Rating: {profiles.codeForces.maxRating}
        </h1>
      </div>
      <div className="flex flex-col my-2 justify-start w-full  items-start">
        <h2 className="text-teal-400 text-lg font-bold">
          CodeChef ({profiles.codeChef.stars})
        </h2>

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
          <h2 className="text-teal-400 text-lg font-bold">LeetCode</h2>
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
}

export default RatingBox;
