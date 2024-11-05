import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setid } from "./stores/slices/userslice";
import host from "./consts";

interface ProtectedRouteProps {
  children: ReactNode; 

}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await fetch(`${host}/api/auth/authenticate`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Protected data:', data); 
            dispatch(setid(data.user.id));

       

            
            setIsAuthenticated(true); 
          } else {
            const errorData = await response.json();
            console.error('Failed to fetch protected data:', response.status, errorData);
            navigate("/login"); 
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          navigate("/login"); 
        }
      }
    };

    checkAuthentication(); // Call the async function

  }, []);

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default ProtectedRoute;
