
"use client"; 

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await fetch('/api/customers/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/order');
    } else {
      router.push('/signup');
    }
  };

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('token');
    // Refresh the page
    window.location.reload();
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 text-center">
      {isAuthenticated ? (
        <div>
          <p>Welcome back, {user?.name}!</p>
          <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      ) : (
        <p>Please sign up or log in.</p>
      )}
        <h1 className="text-3xl font-bold mb-4">Welcome to CRM by ssg</h1>
        <p className="mb-6">
          Manage your customers and orders seamlessly with our intuitive CRM platform.
        </p>
        <button 
          onClick={handleGetStarted} 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;