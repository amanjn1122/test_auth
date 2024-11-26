// pages/index.tsx
import { useState } from 'react';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  //   // Check if the user is authenticated by looking for the JWT in cookies
  //   const token = Cookies.get('token'); // Get token from cookies

  //   if (token) {
  //     // Redirect to the dashboard if the user is authenticated
  //     router.push('/dashboard');
  //   } else {
  //     // Redirect to the login page if not authenticated
  //     router.push('/login');
  //   }
  //   setLoading(false);
  // }, [router]);

  if (loading) {
    // Optionally show a loading screen or spinner while checking authentication
    return <div>Loading...</div>;
  }

  // This will never be reached because of the redirect in useEffect
  return <div>Redirecting...</div>;
};

export default HomePage;
