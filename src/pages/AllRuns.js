import { useEffect } from 'react';

import RunList from '../components/runs/RunList';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import NoRunsFound from '../components/runs/NoRunsFound';
import useHttp from '../hooks/use-http';
import { getAllRuns } from '../lib/api';

const AllRuns = () => {
  const { sendRequest, status, data: loadedRuns, error } = useHttp(
    getAllRuns,
    true
  );

  useEffect(() => {
    sendRequest();
  }, [sendRequest]);

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
