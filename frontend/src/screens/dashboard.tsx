import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { RootState } from '../stores/userStore'; // Adjust the path if necessary
import Welcomebar from '../components/welcomebar';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other properties relevant to your user object
}

function Dashboard() {
  const id = useSelector((state: RootState) => state.userId.id);  // Correctly typed selector
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);  // Strongly typed state
  const [loading, setLoading] = useState<boolean>(true);  // Add loading state

  useEffect(() => {
    if (id) {
      GetUser();
    }
  }, [id]);

  async function GetUser() {
    try {
      const response = await fetch(`/api/auth/getuserbyId?id=${id}`, {
        method: 'GET',
      });
      if (response.ok) {
        const fetchedUser = await response.json();
        fetchedUser.password = '';  // Clear sensitive data
        setUser(fetchedUser);
      } else {
        console.error('Failed to fetch user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);  // Loading is complete whether the fetch succeeded or failed
    }
  }

  if (loading) {
    return <div>Loading...</div>;  // Show a loading message while fetching
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      {user ? <Welcomebar user={user}/> : <p>User not found</p>}  {/* Handle case when user is not found */}
    </div>
  );
}

export default Dashboard;
