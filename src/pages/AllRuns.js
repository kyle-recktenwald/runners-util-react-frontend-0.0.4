import { useEffect, useContext, useCallback } from 'react';
import { KeycloakContext } from '../App';

import RunList from '../components/runs/RunList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NoRunsFound from '../components/runs/NoRunsFound';
import useHttp from '../hooks/use-http';
import { getAllRuns } from '../lib/api';

const AllRuns = () => {
  const keycloak = useContext(KeycloakContext);

  const fetchAllRuns = useCallback(() => {
    if (!keycloak) {
      console.log('Error: No Keycloak instance');
      return Promise.resolve([]);
    }
    return getAllRuns(keycloak.token);
  }, [keycloak]);

  const { sendRequest, status, data: loadedRuns, error } = useHttp(keycloak ? fetchAllRuns : null, true);

  useEffect(() => {
    sendRequest();
  }, [sendRequest, keycloak]);

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

  return <RunList runs={loadedRuns} />;
};

export default AllRuns;