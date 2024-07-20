import React, { useCallback } from 'react';

import RunList from '../components/runs/WelcomeRunList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NoRunsFound from '../components/runs/NoRunsFound';
import useAuthRequest from '../hooks/use-http';
import { getAllRuns } from '../lib/resource-server-api';

const AllRuns = () => {
  const fetchAllRuns = useCallback(async (token) => {
    return getAllRuns(token);
  }, []);

  const { status, data: loadedRuns, error } = useAuthRequest(fetchAllRuns);

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

export default AllRuns;