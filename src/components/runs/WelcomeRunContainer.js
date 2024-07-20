import React, { useCallback, useContext, useState, useEffect } from 'react';

import RunList from './WelcomeRunList';
import LoadingSpinner from '../UI/LoadingSpinner';
import NoRunsFound from './NoRunsFound';
import useAuthRequest from '../../hooks/use-http';
import { getRunsByUserId } from '../../lib/resource-server-api';
import { KeycloakContext } from '../../App';

const WelcomeRunContainer = () => {
  const { profile } = useContext(KeycloakContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    console.log('Profile value:' + profile);
    console.log('Profile ID value:' + profile.id);
    if (profile && profile.id) {
      console.log('Setting user ID' + profile.id);
      setUserId(profile.id);
    }
  }, [profile]);


  const fetchRunsByUserId = useCallback(async (token, userId) => {
    console.log('Fetching runs for user: ' + userId);
    return getRunsByUserId(token, userId);
  }, []);

  const { status, data: loadedRuns, error } = useAuthRequest(fetchRunsByUserId);

  if (status === 'pending') {
    return (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className='centered focused'>{error}</p>;
  }

  if (status === 'completed' && (!loadedRuns || loadedRuns.length === 0)) {
    return <NoRunsFound />;
  }

  return loadedRuns ? <RunList runs={loadedRuns} /> : null;
};

export default WelcomeRunContainer;