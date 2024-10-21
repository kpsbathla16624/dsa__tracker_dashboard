import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/userStore";
import Welcomebar from "../components/welcomebar";
import getUserProfile from "../functions/getuserProfiles";
import BarChart from "../components/questioncountBarGraph";
import DonutChart from "../components/donutChart";
import CodechefRatingGraph from "../components/linechart";
import CurrentRating from "../components/currentRating";

interface User {
  id: string;
  name: string;
  email: string;
  leetcode: string | null;
  codeforces: string | null;
  codechef: string | null;
  tagCounts: Record<string, number>;
}

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
  const [codechefProfile, setCodechefProfile] = useState<Record<string, any>>(
    {}
  );
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch(`/api/auth/getuserbyId?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const fetchedUser = await response.json();
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
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
          `/api/codeforces/getcodeforcesProfile?username=${fetchedUser.codeforces}`
        );
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log("Codeforces profile:", profileData);
          setCfTagCounts(profileData.tagcount || {});
        } else {
          console.warn("No Codeforces data available.");
        }
      } else {
        console.log("No Codeforces username provided");
        setActiveTab("LeetCode");
        setCfTagCounts({});
      }

      if (fetchedUser.leetcode) {
        console.log("Fetching LeetCode data for", fetchedUser.leetcode);
        const leetcodeResponse = await fetch(
          `http://localhost:4000/skillStats/${fetchedUser.leetcode}`
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
          `https://codechef-api.vercel.app/handle/${fetchedUser.codechef}`
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
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <div className="flex overflow-y-auto hide-scrollbar  h-full justify-start items-start">
      <div>
        {user ? (
          <>
            <Welcomebar user={user} />
            <div className="pl-5 flex flex-col justify-start items-center">
              {profiles ? (
                <div className="w-full h-full -z-50 flex space-x-4 items-start justify-start">
                  <BarChart profiles={profiles} />
                  <div className="relative w-full">
                    {codechefProfile.ratingData ? (
                      <CodechefRatingGraph
                        ratingData={codechefProfile.ratingData}
                      />
                    ) : (
                      <div>No Codechef data available</div>
                    )}
                  </div>
                  <div className="w-[520px] h-56  ">
                    <CurrentRating profiles={profiles} />
                  </div>
                </div>
              ) : (
                <p>No profiles found</p>
              )}

              <div className="flex w-full justify-start items-start ">
                <div className="relative justify-start items-start flex w-full">
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
                <div className=" w-[600px]"></div>
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
