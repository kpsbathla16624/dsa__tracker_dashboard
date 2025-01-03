// import { useEffect, useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import CodeforcesRatingGraph from "../components/codeforcesLinechart";
// import CurrentRating from "../components/currentRating";
// import DonutChart from "../components/donutChart";
// import HeatMap from "../components/heatmap";
// import CodechefRatingGraph from "../components/linechart";
// import LoadingSpinner from "../components/loading";
// import BarChart from "../components/questioncountBarGraph";
// import Welcomebar from "../components/welcomebar";
// import getUserProfile from "../functions/getuserProfiles";
// import User from "../models/userModel";
// import { RootState } from "../stores/userStore";
// import host from "../consts";
// import { useNavigate } from "react-router-dom";
// import { setid } from "../stores/slices/userslice";
// import LeetcodeTags from "../components/codeforcesLinechart";

// function Dashboard() {
//   const id = useSelector((state: RootState) => state.userId.id);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [profiles, setProfiles] = useState<any | null>(null);
//   const [cfTagCounts, setCfTagCounts] = useState<Record<string, number>>({});
//   const [lcTagCounts, setLcTagCounts] = useState<Record<string, number>>({});
//   const [activeTab, setActiveTab] = useState<"Codeforces" | "LeetCode">(
//     "Codeforces"
//   );
//   const [RatingactiveTab, setRatingActiveTab] = useState<"Codeforces" | "CodeChef">(
//     "Codeforces"
//   );
//   const [codechefProfile, setCodechefProfile] = useState<Record<string, any>>(
//     {}
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [codeforcesRatingData, setCodeforcesRatingData] = useState<any | null>({});
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Memoized authentication check to prevent re-renders from triggering it multiple times
//   const checkAuthentication = useCallback(async () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     try {
//       const response = await fetch(`${host}/api/auth/authenticate`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Protected data:", data);

//         // Avoid redundant updates
//         if (id !== data.user.id) {
//           dispatch(setid(data.user.id));
//         }

//         if (!isAuthenticated) {
//           setIsAuthenticated(true);
//         }
//       } else {
//         console.error("Authentication failed");
//         navigate("/login");
//       }
//     } catch (error) {
//       console.error("Error during authentication:", error);
//       navigate("/login");
//     }
//   }, [id, isAuthenticated, dispatch, navigate]);

//   // Fetch user data by ID
//   const getUser = useCallback(async () => {
//     if (!id || !isAuthenticated) return;

//     try {
//       setLoading(true);
//       setError(null);

//       console.log("Fetching user with ID:", id);
//       const response = await fetch(`${host}/api/auth/getuserbyId?id=${id}`);
//       if (!response.ok) throw new Error("Failed to fetch user");

//       const fetchedUser = await response.json();
//       console.log("Fetched user:", fetchedUser);
//       setUser(fetchedUser);

//       if (!fetchedUser.codechef) {
//         fetchedUser.codechef = "kpsbathla";
//       }

//       if (
//         fetchedUser.codechef ||
//         fetchedUser.codeforces ||
//         fetchedUser.leetcode
//       ) {
//         const profileData = await getUserProfile(
//           fetchedUser.codechef || "kpsbathla",
//           fetchedUser.codeforces || null,
//           fetchedUser.leetcode || null
//         );
//         setProfiles(profileData);
//       }

//       if (fetchedUser.codeforces) {
//         console.log("Fetching Codeforces profile for", fetchedUser.codeforces);

//         const profileResponse = await fetch(
//           `${host}/api/codeforces/getcodeforcesProfile?username=${fetchedUser.codeforces}`
//         );
//         if (profileResponse.ok) {
//           const profileData = await profileResponse.json();
//           setCfTagCounts(profileData.tagcount || {});
//         }

//         const contestResponse = await fetch(
//           `https://codeforces.com/api/user.rating?handle=${fetchedUser.codeforces}`
//         );
//         if (contestResponse.ok) {
//           const contestData = await contestResponse.json();
//           setCodeforcesRatingData(contestData.result);
//         }
//       } else {
//         setActiveTab("LeetCode");
//         setCfTagCounts({});
//       }

//       if (fetchedUser.leetcode) {
//         console.log("Fetching LeetCode data for", fetchedUser.leetcode);
//         const leetcodeResponse = await fetch(
//           `https://leetcodeapi-bolt.vercel.app/skillStats/${fetchedUser.leetcode}`
//         );
//         if (leetcodeResponse.ok) {
//           const leetcodeData = await leetcodeResponse.json();
//           const allTags = [
//             ...leetcodeData.data.matchedUser.tagProblemCounts.fundamental,
//             ...leetcodeData.data.matchedUser.tagProblemCounts.intermediate,
//             ...leetcodeData.data.matchedUser.tagProblemCounts.advanced,
//           ];

//           const leetcodeTagCounts: Record<string, number> = {};
//           allTags.forEach(
//             (tag: { tagName: string; problemsSolved: number }) => {
//               leetcodeTagCounts[tag.tagName] = tag.problemsSolved;
//             }
//           );

//           setLcTagCounts(leetcodeTagCounts);
//         }
//       }

//       if (fetchedUser.codechef) {
//         console.log("Fetching CodeChef profile for", fetchedUser.codechef);
//         const codechefResponse = await fetch(
//           `https://codechef-api-five.vercel.app/handle/${fetchedUser.codechef}`
//         );
//         if (codechefResponse.status === 200) {
//           const data = await codechefResponse.json();
//           setCodechefProfile(data);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setError("An error occurred while fetching data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id, isAuthenticated]);

//   // Run authentication check on mount
//   useEffect(() => {
//     checkAuthentication();
//   }, [checkAuthentication]);

//   // Fetch user data when `id` or `isAuthenticated` changes
//   useEffect(() => {
//     getUser();
//   }, [id, isAuthenticated, getUser]);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <div className="text-white">{error}</div>;
//   }

//   if (!user?.codechef && !user?.codeforces && !user?.leetcode) {
//     return (
//       <div>
//         <h1 className="text-white">Please add your profiles to see the dashboard</h1>
//       </div>
//     );
//   }

//   return (
//     <div className=" w-full flex overflow-y-auto hide-scrollbar h-full justify-start items-start">
//       <div>
//         {user ? (
//           <>
//             <Welcomebar user={user} />
         
//             <div className="pl-5 w-full flex flex-col justify-start items-center">
//               {profiles ? (
//                 <div className="w-full  h-full  space-x-6 grid grid-cols-6">
//                   <div className="col-span-2">
//                   <BarChart  />
//                   </div>
//                   <LeetcodeTags/>
                  

                 
//                     <CurrentRating profiles={profiles} />
                  
//                 </div>
//               ) : (
//                 <p>No profiles found</p>
//               )}

//               <div className="flex w-full  justify-start items-start space-x-4   ">
//                 <div className="relative justify-start items-start flex w-min">
//                   <div className="absolute m-2 top-0 left-0 z-10 flex space-x-4 p-2">
//                     {Object.keys(cfTagCounts).length > 0 && (
//                       <button
//                         className={`px-4 py-2 rounded-md ${
//                           activeTab === "Codeforces"
//                             ? "bg-teal-500 text-white"
//                             : "bg-gray-700 text-gray-200"
//                         }`}
//                         onClick={() => setActiveTab("Codeforces")}
//                       >
//                         Codeforces
//                       </button>
//                     )}

//                     <button
//                       className={`px-4 py-2 rounded-md ${
//                         activeTab === "LeetCode"
//                           ? "bg-teal-500 text-white"
//                           : "bg-gray-700 text-gray-200"
//                       }`}
//                       onClick={() => setActiveTab("LeetCode")}
//                     >
//                       LeetCode
//                     </button>
//                   </div>

//                   <div className="relative">
//                     {activeTab === "Codeforces" ? (
//                       Object.keys(cfTagCounts).length > 0 ? (
//                         <DonutChart data={cfTagCounts} platform="Codeforces" />
//                       ) : (
//                         <h1>No Codeforces data available</h1>
//                       )
//                     ) : Object.keys(lcTagCounts).length > 0 ? (
//                       <DonutChart data={lcTagCounts} platform="LeetCode" />
//                     ) : (
//                       <h1>No LeetCode data available</h1>
//                     )}
//                   </div>
//                 </div>
//                <div className="w-full flex  flex-col justify-start items-start   h-full">
//                 <HeatMap codechefId={user.codechef ||""} codeforcesId={user.codeforces||""} leetcodeId={user.leetcode||""}/>
//                 {/* <div className="w-full">

//               <LeetcodeQuestionCount leetcodedata={profiles.leetCode}/>
//                </div> */}
//                </div>
               

//               </div>
//             </div>
//           </>
//         ) : (
//           <p>User not found</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useState, useEffect, useCallback } from "react";
import QuestionCountGraph from "../components/questioncountBarGraph";
import RatingBox from "../components/currentRating";
import HeatMap from "../components/heatmap";
import Ratingcharts from "../components/ratingchart";
import TagWiseCount from "../components/tagwisecount";
import User from "../models/userModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/userStore";
import { useNavigate } from "react-router-dom";
import host from "../consts";
import { setid } from "../stores/slices/userslice";
import LoadingSpinner from "../components/loading";
import Welcomebar from "../components/welcomebar";


function StatsPage() {
  const id = useSelector((state: RootState) => state.userId.id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoized authentication check to prevent re-renders from triggering it multiple times
  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${host}/api/auth/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Protected data:", data);

        // Avoid redundant updates
        if (id !== data.user.id) {
          dispatch(setid(data.user.id));
        }

        if (!isAuthenticated) {
          setIsAuthenticated(true);
        }
      } else {
        console.error("Authentication failed");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      navigate("/login");
    }
  }, [id, isAuthenticated, dispatch, navigate]);

  // Fetch user data by ID
  const getUser = useCallback(async () => {
    if (!id || !isAuthenticated) return;

    try {
      setLoading(true);
 

      console.log("Fetching user with ID:", id);
      const response = await fetch(`${host}/api/auth/getuserbyId?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const fetchedUser = await response.json();
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);

      if (!fetchedUser.codechef) {
        fetchedUser.codechef = "kpsbathla";
      }

     
    } catch (error) {
      console.error("Error fetching user data:", error);
     
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  // Run authentication check on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  // Fetch user data when `id` or `isAuthenticated` changes
  useEffect(() => {
    getUser();
  }, [id, isAuthenticated, getUser]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // if (error) {
  //   return <div className="text-white">{error}</div>;
  // }

  if (!user?.codechef && !user?.codeforces && !user?.leetcode) {
    return (
      <div>
        <h1 className="text-white">Please add your profiles to see the dashboard</h1>
      </div>
    );
  }
 
  return (
    <div id="stats" className="z-50 px-5 lg:px-10 relative  text-white">
      <Welcomebar user={user}/>
   
      <div className="grid grid-cols-1 md:grid-cols-10 gap-y-10 gap-x-4 grid-flow-row-dense auto-rows-auto">
        {/* QuestionCountGraph */}
        <div className="col-span-1 md:col-span-3 flex items-center justify-center flex-col max-h-[320px] overflow-y-hidden">
          <QuestionCountGraph user={user} />
        </div>

        {/* LeetcodeTags */}
        <div className="col-span-1 md:col-span-7 lg:col-span-5 flex items-center justify-center flex-col max-h-[400px] overflow-y-auto">
         <TagWiseCount user={user}/>
        </div>

        {/* RatingBox */}
        <div className="lg:col-span-2 col-span-3 flex items-center justify-center">
          <RatingBox user={user} />
        </div>

        {/* HeatMap */}
        <div className="col-span-1 md:col-span-10 lg:col-span-6 flex items-start justify-start flex-col bg-transparent">
          <HeatMap
            codechefId= {user.codechef||"kpsbathla"}
            codeforcesId={user.codeforces||""}
            leetcodeId={user.leetcode||""}
          />
        </div>

        <div className="col-span-7 lg:col-span-4">
          <Ratingcharts user={user} />
        </div>

       
      </div>
    </div>
  );
}

export default StatsPage;
