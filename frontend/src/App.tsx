import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import LoginScreen from "./screens/loginscreen";
import ProtectedRoute from "./protectedroute";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";
import RegisterScreen from "./screens/RegisterScreen";
import MyNavbar, { SidebarItem } from "./components/sidebar";
import { LuLayoutDashboard } from "react-icons/lu";
import { SiCodechef, SiCodeforces, SiLeetcode } from "react-icons/si";

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
                <ProtectedRoute>
                  <div className="flex  hide-scrollbar -z-50 justify-center items-center flex-col w-full h-full">
                  <Dashboard />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
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

  return showNavbar ? (
    <MyNavbar>
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Dashboard" active alert />
      <SidebarItem icon={<SiLeetcode  size={20} />} text="Leetcode" />
      <SidebarItem icon={<SiCodeforces  size={20} />} text="Codeforces" />
      <SidebarItem icon={<SiCodechef size={20} />} text="Codechef" />
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Help" />
    </MyNavbar>
  ) : null;
}

export default App;
