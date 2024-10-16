import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { RootState } from '../stores/userStore'; // Adjust the path if necessary

function Dashboard() {
  const id = useSelector((state: RootState) => state.userId.id);  // Correctly typed selector
  const navigate = useNavigate();
  const [user, setUser] = useState<{ [key: string]: any }>({});  // Define state for user

  useEffect(() => {
    // Fetch user data when the component mounts or when id changes
    if (id) {
      GetUser();
    }
  }, [id]);

  async function GetUser() {
    const response = await fetch(`/api/auth/getuserbyId?id=${id}`, {
      method: 'GET',
    });
    if (response.ok) {
      const fetchedUser = await response.json();  
      fetchedUser.password = ''; 
      setUser(fetchedUser); 
    } else {
      console.error('Failed to fetch user');
    }
  }

  return (
    <div>
      
      <h2>{user?.name ? `Welcome, User : ${user.name}` : "Loading user data..."}</h2>  {/* Display fetched user name */}
      <button onClick={() => {
        localStorage.clear();
        navigate('/');
      }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
