import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { KeycloakContext } from '../App';

function Home() {
  const keycloak = useContext(KeycloakContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (keycloak) {
          console.log('User Authenticated: ' + keycloak.authenticated);
          try {
            const refreshed = await keycloak.updateToken(5);
            console.log(refreshed ? 'Token was refreshed' : 'Token is still valid');
            console.log('Token: ' + keycloak.token);
          } catch (error) {
              console.error('Failed to refresh the token:', error);
          }
          const response = await axios.get('http://localhost:8080/api/runs/test', {
            headers: {
              Authorization: `Bearer ${keycloak.token}`,
            },
          });
          setData(response.data);
        }
      } catch (error) {
        setError(error.message || 'An error occurred while fetching data.');
      }
    };

    fetchData();
  }, [keycloak]);

  return (
    <div>
      {/* Display fetched data or error */}
      {data ? (
        <div>
          <h2>Data from Backend:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>Error: {error}</p>
      )}
    </div>
  );
}

export default Home;