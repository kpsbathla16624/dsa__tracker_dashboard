import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";

import LoginScreen from "./screens/loginscreen";
import ProtectedRoute from "./protectedroute";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";
import RegisterScreen from "./screens/RegisterScreen";
import MyNavbar from "./components/navbar";

function App() {
  return (
    <Router>
      <ConditionalNavbar />
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
      <ToastContainer />
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  
  // Define paths where the navbar should not be displayed
  const noNavbarPaths = ["/login", "/register"];
  
  // Check if the current path is one of those
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return showNavbar ? <MyNavbar /> : null;
}

export default App;
