import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import RunForm from '../components/runs/RunForm';
import useHttp from '../hooks/use-http';
import { createRun } from '../lib/resource-server-api';

const NewRun = () => {
  const { sendRequest, status } = useHttp(createRun);
  const history = useHistory();

  useEffect(() => {
    if (status === 'completed') {
      history.push('/runs');
    }
  }, [status, history]);

  const addRunHandler = (runData) => {
    sendRequest(runData);
  };

  return <RunForm isLoading={status === 'pending'} onAddRun={addRunHandler} />;
};

export default NewRun;
