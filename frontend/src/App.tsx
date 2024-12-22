import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginScreen from "./screens/loginscreen";
import ProtectedRoute from "./protectedroute";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";
import RegisterScreen from "./screens/RegisterScreen";
import MyNavbar, { SidebarItem } from "./components/sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";
import { useState } from "react";
import ProfileScreen from "./screens/profileScreen";

function App() {
  return (
    <Router>
      <div className="flex h-screen z-50 backdrop-blur-lg bg-opacity-75 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        <ConditionalSidebar />
        <div className="flex-1 overflow-y-auto hide-scrollbar glass-container">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/dashboard"
              element={
                <div className="  hide-scrollbar -z-50  w-full h-full">
                  <Dashboard />
                </div>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route
              path="*"
              element={
                <div className="text-white w-full h-full flex justify-center items-center text-2xl">
                  <h1>This Section is Under Devlopment</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
      <ToastContainer />
    </Router>
  );
}

function ConditionalSidebar() {
  const location = useLocation();
  const noNavbarPaths = ["/login", "/register"];
  const showNavbar = !noNavbarPaths.includes(location.pathname);
  const [activetab, setActivetab] = useState(0);
  const navigate = useNavigate();

  const handleTabClick = (index: number) => {
    setActivetab(index);
    if (index == 0) {
      navigate("/dashboard");
    } else if (index == 1) {
      navigate("/leetcode");
    } else if (index == 2) {
      navigate("/codeforces");
    } else if (index == 3) {
      navigate("/codechef");
    } else if (index == 4) {
      navigate("/profile");
    }
  };

  return showNavbar ? (
    <MyNavbar>
      <SidebarItem
        icon={<LuLayoutDashboard size={20} />}
        text="Dashboard"
        active={activetab === 0}
        onClick={() => handleTabClick(0)}
      />
      <SidebarItem
        icon={<SiLeetcode size={20} />}
        text="Leetcode"
        active={activetab === 1}
        onClick={() => handleTabClick(1)}
      />
      <SidebarItem
        icon={<SiCodeforces size={20} />}
        text="Codeforces"
        active={activetab === 2}
        onClick={() => handleTabClick(2)}
      />
      <SidebarItem
        icon={<SiCodechef size={20} />}
        text="Codechef"
        active={activetab === 3}
        onClick={() => handleTabClick(3)}
      />
      <SidebarItem
        icon={<LuLayoutDashboard size={20} />}
        text="Profile"
        active={activetab === 4}
        onClick={() => handleTabClick(4)}
      />
    </MyNavbar>
  ) : null;
}

export default App;
