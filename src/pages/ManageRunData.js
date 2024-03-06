import { React, useEffect, useContext, useCallback } from 'react';
import ManageRunDataMenu from '../components/manage-data/ManageRunDataMenu'
import { KeycloakContext } from '../App';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NoRunsFound from '../components/runs/NoRunsFound';
import useHttp from '../hooks/use-http';
import { getAllRuns } from '../lib/api';

const ManageRunData = () => {
  const { keycloak } = useContext(KeycloakContext);

  const fetchAllRuns = useCallback(() => {
    if (!keycloak) {
      console.log('Error: No Keycloak instance');
      return Promise.resolve([]);
    }
    return getAllRuns(keycloak.token);
  }, [keycloak]);

  const { sendRequest, status, data: loadedRuns, error } = useHttp(
    keycloak ? fetchAllRuns : null, true
  );

  useEffect(() => {
    if (keycloak) {
      sendRequest();
    }
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

  return loadedRuns ? <ManageRunDataMenu runs={loadedRuns} /> : null;
};

export default ManageRunData;