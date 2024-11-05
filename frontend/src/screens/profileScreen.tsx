import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../stores/userStore";
import User from "../models/userModel";
import { BsFillPersonFill, BsPersonCircle } from "react-icons/bs";
import LoadingSpinner from "../components/loading";
import { useNavigate } from "react-router-dom";

function ProfileScreen() {
  const id = useSelector((state: RootState) => state.userId.id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      console.log("Fetching user with id:", id);
      const response = await fetch(`/api/auth/getuserbyId?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const fetchedUser = await response.json();
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
      setLoading(false);
    };
    fetchUser();
  }, [id]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Navigate to the login page after logout
  };
  return (
    <div>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        user && (
          <div className="w-full h-full flex flex-col p-10 justify-start items-start">
             {/* name and email section */}
            <div className="flex w-full justify-between items-center">
              <div className=" w-full flex justify-start  space-x-6 items-center">
                <div className="w-32 h-32 rounded-full bg-teal-50 flex justify-center items-center">
                  <BsFillPersonFill className="text-8xl" />
                </div>

                <div className="flex flex-col text-white space-y-3 justify-start items-start">
                  <h1 className="text-3xl text-teal-400"> {user.name}</h1>
                  <h1 className="text-lg text-amber-100 "> {user.email}</h1>
                </div>
              </div>

              <div className="">
                {" "}
                <button
                  onClick={handleLogout}
                  className="ml-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
            {/* leetcode, codeforces, codechef section */}
          <div className="mt-10 w-full flex flex-col space-y-6">
            <div className="flex flex-col space-y-2">
            <label className="text-white text-lg">LeetCode Username</label>
            <input
              type="text"
              value={user.leetcode ?? ''}
              onChange={(e) => setUser({ ...user, leetcode: e.target.value })}
              className="p-2 rounded bg-gray-800 text-white"
            />
            </div>
            <div className="flex flex-col space-y-2">
            <label className="text-white text-lg">Codeforces Username</label>
            <input
              type="text"
              value={user.codeforces ??""}
              onChange={(e) => setUser({ ...user, codeforces: e.target.value })}
              className="p-2 rounded bg-gray-800 text-white"
            />
            </div>
            <div className="flex flex-col space-y-2">
            <label className="text-white text-lg">CodeChef Username</label>
            <input
              type="text"
              value={user.codechef??""}
              onChange={(e) => setUser({ ...user, codechef: e.target.value })}
              className="p-2 rounded bg-gray-800 text-white"
            />
            </div>
            <button
            onClick={async () => {
              setLoading(true);
              const body = {
                leetcode: user.leetcode,
                codeforces: user.codeforces,

                codechef: user.codechef,
              }
              
              const response = await fetch(`/api/auth/updateUser?id=${user._id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
              });
              console.log("update response:", response);
              if (!response.ok) throw new Error("Failed to update user");
              setLoading(false);
            }}
            className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
            >
            Update
            </button>
          </div>
            
          </div>
        )
      )}
    </div>
  );
}

export default ProfileScreen;
