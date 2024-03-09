import { useReducer, useCallback, useContext, useEffect } from 'react';
import { KeycloakContext } from '../App';

function httpReducer(state, action) {
  if (action.type === 'SEND') {
    return {
      data: null,
      error: null,
      status: 'pending',
    };
  }

  if (action.type === 'SUCCESS') {
    return {
      data: action.responseData,
      error: null,
      status: 'completed',
    };
  }

  if (action.type === 'ERROR') {
    return {
      data: null,
      error: action.errorMessage,
      status: 'completed',
    };
  }

  return state;
}

function useHttp(requestFunction, startWithPending = false) {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? 'pending' : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async function (requestData, token) {
      dispatch({ type: 'SEND' });
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const responseData = await requestFunction(requestData, headers);
        dispatch({ type: 'SUCCESS', responseData });
      } catch (error) {
        dispatch({
          type: 'ERROR',
          errorMessage: error.message || 'Something went wrong!',
        });
      }
    },
    [requestFunction]
  );

  return {
    sendRequest,
    ...httpState,
  };
}

const useAuthRequest = (requestFunction) => {
  const { keycloak } = useContext(KeycloakContext);

  const fetchData = useCallback(
    (token) => {
      if (!keycloak) {
        console.log('Error: No Keycloak instance');
        return Promise.resolve([]);
      }
      return requestFunction(token);
    },
    [keycloak, requestFunction]
  );

  const { sendRequest, status, data, error } = useHttp(
    fetchData,
    true
  );

  useEffect(() => {
    if (keycloak) {
      sendRequest(keycloak.token);
    }
  }, [sendRequest, keycloak]);

  return { status, data, error };
};

export default useAuthRequest;