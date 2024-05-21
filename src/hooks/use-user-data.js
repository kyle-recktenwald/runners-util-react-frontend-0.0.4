import { useState, useEffect } from 'react';
import { getAllUserIds } from '../lib/keycloak-server-api';
import { getRoutesByUserId } from '../lib/resource-server-api' // Assuming you have an API file

const useUserData = (profile) => {
  const [userIds, setUserIds] = useState([]);
  const [userRoutes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user IDs
        const userIdsData = await getAllUserIds(profile.token);
        setUserIds(userIdsData);

        // Fetch routes for the first user ID
        if (userIdsData.length > 0) {
          const routesData = await getRoutesByUserId(profile.token, userIdsData[0]);
          setRoutes(routesData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    if (profile) {
      fetchUserData();
    }
  }, [profile]);

  return { userIds, routes: userRoutes, loading };
};

export default useUserData;