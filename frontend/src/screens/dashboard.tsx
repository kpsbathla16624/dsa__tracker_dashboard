import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CodeforcesRatingGraph from "../components/codeforcesLinechart";
import CurrentRating from "../components/currentRating";
import DonutChart from "../components/donutChart";
import HeatMap from "../components/heatmap";
import CodechefRatingGraph from "../components/linechart";
import LoadingSpinner from "../components/loading";
import BarChart from "../components/questioncountBarGraph";
import Welcomebar from "../components/welcomebar";
import getUserProfile from "../functions/getuserProfiles";
import User from "../models/userModel";
import { RootState } from "../stores/userStore";
import host from "../consts";




function Dashboard() {
  const id = useSelector((state: RootState) => state.userId.id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<any | null>(null);
  const [cfTagCounts, setCfTagCounts] = useState<Record<string, number>>({});
  const [lcTagCounts, setLcTagCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"Codeforces" | "LeetCode">(
    "Codeforces"
  );
  const [RatingactiveTab, setRatingActiveTab] = useState<"Codeforces" | "CodeChef">(
    "Codeforces"
  );
  const [codechefProfile, setCodechefProfile] = useState<Record<string, any>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);
  const [codeforcesRatingData, setCodeforcesRatingData] = useState<any | null>({})

  useEffect(() => {
    if (id) {
      GetUser();
    }
  }, [id]);
  async function GetUser() {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user with id:", id);
      const response = await fetch(`${host}/api/auth/getuserbyId?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const fetchedUser = await response.json();
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
      if (fetchedUser.codechef == null) {
        fetchedUser.codechef = "kpsbathla";
      }
      if (
        fetchedUser.codechef ||
        fetchedUser.codeforces ||
        fetchedUser.leetcode
      ) {
        const profileData = await getUserProfile(
          fetchedUser.codechef || null,
          fetchedUser.codeforces || null,
          fetchedUser.leetcode || null
        );
        setProfiles(profileData);
      }

      if (fetchedUser.codeforces) {
        console.log("Fetching Codeforces profile for", fetchedUser.codeforces);
        const profileResponse = await fetch(
          `${host}/api/codeforces/getcodeforcesProfile?username=${fetchedUser.codeforces}`
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Codeforces profile:", profileData);
          setCfTagCounts(profileData.tagcount || {});
        } else {
          console.warn("No Codeforces data available.");
        }
        const contestresponse = await fetch(`https://codeforces.com/api/user.rating?handle=${fetchedUser.codeforces}`);
        if (contestresponse.ok) {
          const contestData = await contestresponse.json();
          console.log("Codeforces contest data:", contestData);
          setCodeforcesRatingData(contestData.result);
        } else {
          console.warn("No Codeforces contest data available.");
        }
      } else {
        console.log("No Codeforces username provided");
        setActiveTab("LeetCode");
        setCfTagCounts({});
      }

      if (fetchedUser.leetcode) {
        console.log("Fetching LeetCode data for", fetchedUser.leetcode);
        const leetcodeResponse = await fetch(
          `https://leetcodeapi-bolt.vercel.app/skillStats/${fetchedUser.leetcode}`
        );
        if (leetcodeResponse.ok) {
          const leetcodeData = await leetcodeResponse.json();
          console.log("LeetCode data:", leetcodeData);
          const allTags = [
            ...leetcodeData.data.matchedUser.tagProblemCounts.fundamental,
            ...leetcodeData.data.matchedUser.tagProblemCounts.intermediate,
            ...leetcodeData.data.matchedUser.tagProblemCounts.advanced,
          ];

          const leetcodeTagCounts: Record<string, number> = {};
          allTags.forEach(
            (tag: { tagName: string; problemsSolved: number }) => {
              leetcodeTagCounts[tag.tagName] = tag.problemsSolved;
            }
          );

          setLcTagCounts(leetcodeTagCounts);
        } else {
          console.warn("No LeetCode data available.");
        }
      }

      if (fetchedUser.codechef) {
        console.log("Fetching CodeChef profile for", fetchedUser.codechef);
        const codechefResponse = await fetch(
          `https://codechef-api-five.vercel.app/handle/${fetchedUser.codechef}`
        );
        if (codechefResponse.status === 200) {
          const data = await codechefResponse.json();
          console.log("CodeChef profile:", data);
          setCodechefProfile(data);
        } else {
          console.warn("No CodeChef data available.");
        }
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }
  if (!user?.codechef && !user?.codeforces && !user?.leetcode) {
    return <div>
      <h1 className="text-white">Please add your profiles to see the dashboard</h1>
    </div>
  }

  return (
    <div className=" w-full flex overflow-y-auto hide-scrollbar h-full justify-start items-start">
      <div>
        {user ? (
          <>
            <Welcomebar user={user} />
         
            <div className="pl-5 w-full flex flex-col justify-start items-center">
              {profiles ? (
                <div className="w-full  h-full  space-x-6 grid grid-cols-6">
                  <div className="col-span-2">
                  <BarChart profiles={profiles} />
                  </div>
                  {/* <div className="relative w-full">
                    {codechefProfile.ratingData ? (
                      <CodechefRatingGraph
                        ratingData={codechefProfile.ratingData}
                      />
                    ) : (
                      <div>No Codechef data available</div>
                    )}
                  </div> */}
                  <div className="relative col-span-3    justify-start items-start flex">
                  <div className="absolute  m-2 top-0 left-0 z-10 flex space-x-4 p-2">
                    {codechefProfile.ratingData && (
                      <button
                        className={`px-4 py-2 rounded-md ${
                          RatingactiveTab === "CodeChef"
                            ? "bg-teal-500 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                        onClick={() => setRatingActiveTab("CodeChef")}
                      >
                        CodeChef
                      </button>
                    )}

                    <button
                      className={`px-4 py-2 rounded-md ${
                        RatingactiveTab === "Codeforces"
                          ? "bg-teal-500 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                      onClick={() => setRatingActiveTab("Codeforces")}
                    >
                      Codeforces
                    </button>
                  </div>

                  <div className="relative w-full  ">
                    {RatingactiveTab === "CodeChef" ? (
                     codechefProfile.ratingData ? (
                      <CodechefRatingGraph
                        ratingData={codechefProfile.ratingData}
                      />
                    ) : (
                      <div>No Codechef data available</div>
                    )
                    ) : codeforcesRatingData ? (
                      <CodeforcesRatingGraph
                        ratingData ={codeforcesRatingData}
                      />
                    ) : (
                      <div>No Codechef data available</div>
                    )}
                  </div>
                </div>

                 
                    <CurrentRating profiles={profiles} />
                  
                </div>
              ) : (
                <p>No profiles found</p>
              )}

              <div className="flex w-full  justify-start items-start space-x-4   ">
                <div className="relative justify-start items-start flex w-min">
                  <div className="absolute m-2 top-0 left-0 z-10 flex space-x-4 p-2">
                    {Object.keys(cfTagCounts).length > 0 && (
                      <button
                        className={`px-4 py-2 rounded-md ${
                          activeTab === "Codeforces"
                            ? "bg-teal-500 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                        onClick={() => setActiveTab("Codeforces")}
                      >
                        Codeforces
                      </button>
                    )}

                    <button
                      className={`px-4 py-2 rounded-md ${
                        activeTab === "LeetCode"
                          ? "bg-teal-500 text-white"
                          : "bg-gray-700 text-gray-200"
                      }`}
                      onClick={() => setActiveTab("LeetCode")}
                    >
                      LeetCode
                    </button>
                  </div>

                  <div className="relative">
                    {activeTab === "Codeforces" ? (
                      Object.keys(cfTagCounts).length > 0 ? (
                        <DonutChart data={cfTagCounts} platform="Codeforces" />
                      ) : (
                        <h1>No Codeforces data available</h1>
                      )
                    ) : Object.keys(lcTagCounts).length > 0 ? (
                      <DonutChart data={lcTagCounts} platform="LeetCode" />
                    ) : (
                      <h1>No LeetCode data available</h1>
                    )}
                  </div>
                </div>
               <div className="w-full flex  flex-col justify-start items-start   h-full">
                <HeatMap codechefId={user.codechef ||""} codeforcesId={user.codeforces||""} leetcodeId={user.leetcode||""}/>
                {/* <div className="w-full">

              <LeetcodeQuestionCount leetcodedata={profiles.leetCode}/>
               </div> */}
               </div>
               

              </div>
            </div>
          </>
        ) : (
          <p>User not found</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
