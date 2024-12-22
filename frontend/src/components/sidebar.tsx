import React, { createContext, useContext, useEffect, useState } from "react";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { RootState } from "../stores/userStore";
import User from "../models/userModel";
import host from "../consts";

interface SidebarContextType {
  expanded: boolean;
}

const sidebarcontext = createContext<SidebarContextType>({ expanded: true });

interface MyNavbarProps {
  children: React.ReactNode; 
}

const MyNavbar: React.FC<MyNavbarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate(); // Initialize navigate
  const id = useSelector((state: RootState) => state.userId.id);
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
      if (id) {
        GetUser();
      }
    }, [id]);

     
  async function GetUser() {
      const response = await fetch(`${host}/api/auth/getuserbyId?id=${id}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const fetchedUser = await response.json();
      console.log("Fetched user:", fetchedUser);
      setUser(fetchedUser);
    }

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Navigate to the login page after logout
  };

  return (
    <aside className="h-screen w-min z-50 ">
 <nav className="h-full flex flex-col bg-gray-900 bg-opacity-80 backdrop-blur-xl border-r border-gray-200 shadow-md">
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1 className={`overflow-hidden transition-all font-serif text-teal-400 text-3xl font-bold ${expanded ? "w-48" : "w-0"}`}>
            DSA Hub
          </h1>
          <button onClick={() => setExpanded((curr) => !curr)} className="p-2 rounded-xl bg-teal-50 hover:bg-gray-100">
            {expanded ? <TbLayoutSidebarLeftCollapseFilled className="text-2xl" /> : <TbLayoutSidebarLeftExpandFilled className="text-2xl" />}
          </button>
        </div>
        <sidebarcontext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </sidebarcontext.Provider>
        <div className="border-t flex p-3 items-center">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="Profile"
            className="w-10 h-10 rounded-lg"
          />
          <div className={`flex justify-between items-center overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
            <div className="leading-4">
              <h4 className="font-sans text-white">{user?.name}</h4>
              <span className="text-xs text-white text-opacity-80" >{user?.email}</span>
            </div>
            <button
              onClick={handleLogout} 
              className="ml-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default MyNavbar;

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, alert, onClick }) => {
  const { expanded } = useContext(sidebarcontext);

  return (
    <li
      onClick={onClick}
      className={`flex items-center relative py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active ? "bg-gradient-to-r from-teal-200 to-teal-400 text-indigo-800" : "hover:bg-indigo-50 hover:text-black text-white"
      }`}
    >
      {icon}
      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
      {alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}></div>}
      {!expanded && (
        <div className="absolute z-50 left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
          {text}
        </div>
      )}
    </li>
  );
};
