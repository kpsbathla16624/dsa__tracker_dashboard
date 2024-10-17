import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";

import LoginScreen from "./screens/loginscreen";
import ProtectedRoute from "./protectedroute";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";
import RegisterScreen from "./screens/RegisterScreen";
import MyNavbar, { SidebarItem } from "./components/sidebar";
import { LuLayoutDashboard } from "react-icons/lu";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-black bg-opacity-70">
        <ConditionalSidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
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

  // Define paths where the navbar should not be displayed
  const noNavbarPaths = ["/login", "/register"];

  // Check if the current path is one of those
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return showNavbar ? (
    <MyNavbar>
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Dashboard" active alert />
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Analytics" />
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Reports" />
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Settings" />
      <SidebarItem icon={<LuLayoutDashboard size={20} />} text="Help" />
    </MyNavbar>
  ) : null;
}

export default App;
