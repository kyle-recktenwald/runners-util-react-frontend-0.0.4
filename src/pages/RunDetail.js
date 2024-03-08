import { Fragment, useEffect } from 'react';
import { useParams, Route, Link, useRouteMatch } from 'react-router-dom';

import HighlightedRun from '../components/runs/HighlightedRun';
import useHttp from '../hooks/use-http';
import { getRunById } from '../lib/resource-server-api';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const RunDetail = () => {
  const match = useRouteMatch();
  const params = useParams();

  const { runId } = params;

  const { sendRequest, status, data: loadedRun, error } = useHttp(
    getRunById,
    true
  );

  useEffect(() => {
    sendRequest(runId);
  }, [sendRequest, runId]);

  if (status === 'pending') {
    return (
      <div className='centered'>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className='centered'>{error}</p>;
  }

  if (!loadedRun.text) {
    return <p>No run found!</p>;
  }

  return (
    <Fragment>
      <HighlightedRun dateTime={loadedRun.dateTime} distance={loadedRun.distance} duration={loadedRun.duration} />
    </Fragment>
  );
};

export default RunDetail;
