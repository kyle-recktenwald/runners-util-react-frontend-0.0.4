import { useState, useEffect } from 'react';
import { getAllUserIds } from '../lib/keycloak-server-api';
import { getRoutesByUserId } from '../lib/resource-server-api'

const useUserData = (profile) => {
  const [userIds, setUserIds] = useState([]);
  const [userRoutes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userIdsData = await getAllUserIds(profile.token);
        setUserIds(userIdsData);

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

  return { userIds, userRoutes, loading };
};

export default useUserData;