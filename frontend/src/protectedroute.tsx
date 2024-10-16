import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; // Specify that children should be ReactNode type
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await fetch('/api/auth/authenticate', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Protected data:', data); 

            // Fetch user data using the user ID
            const response2 = await fetch(`/api/auth/getuserbyId?id=${data.user.id}`, {
              method: 'GET',
            });

            if (!response2.ok) {
              throw new Error('Failed to fetch user data');
            }

            const userData = await response2.json(); // Await the response.json()
            console.log('User data:', userData); // Log the user data here

            // Set authentication to true if the request was successful
            setIsAuthenticated(true); 
          } else {
            const errorData = await response.json();
            console.error('Failed to fetch protected data:', response.status, errorData);
            navigate("/login"); // Redirect to login if the request fails
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          navigate("/login"); // Redirect to login on fetch error
        }
      }
    };

    checkAuthentication(); // Call the async function

  }, []);

  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
};

export default ProtectedRoute;
