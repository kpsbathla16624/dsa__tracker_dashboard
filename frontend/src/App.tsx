import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LoginScreen from "./screens/loginscreen";
import ProtectedRoute from "./protectedroute";
import Dashboard from "./screens/dashboard";
import { ToastContainer } from "react-toastify";

function App() {
  return (<>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
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
    </Router>
    <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
}

export default App;
