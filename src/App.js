import { Route, Switch, Redirect } from 'react-router-dom';
import React, { useEffect, createContext, useState } from 'react';

import AllRuns from './pages/AllRuns';
import RunDetail from './pages/RunDetail';
import NewRun from './pages/NewRun';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Keycloak from 'keycloak-js';

export const KeycloakContext = createContext();

function App() {
  const [keycloak, setKeycloak] = useState(null);
  const [profile, setProfile] = useState(null); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      url: 'http://localhost:8180',
        realm: 'runnersutilapp',
        clientId: 'runner-utils-app-client',
    });

    keycloakInstance.init({ onLoad: 'login-required', pkceMethod: "S256" }).then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
      } else {
        console.log('User is not authenticated');
      }
      setKeycloak(keycloakInstance);
    });
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (keycloak) {
          try {
            const refreshed = await keycloak.updateToken(5);
            console.log(refreshed ? 'Token was refreshed' : 'Token is still valid');
            console.log('Token: ' + keycloak.token);
          } catch (error) {
              console.error('Failed to refresh the token:', error);
          }
        }
      } catch (error) {
        setError(error.message || 'An error occurred while refreshing the token.');
      }
    };

    const loadUserProfile = async () => {
      try {
        if (keycloak) {
          try {
            const profile = await keycloak.loadUserProfile();
            console.log('Retrieved user profile:', profile);
            setProfile(profile);
          } catch (error) {
              console.error('Failed to load user profile:', error);
          }
        }
      } catch (error) {
        setError(error.message || 'An error occurred while loading the user profile.');
      }
    };

    refreshToken();
    loadUserProfile();
  }, [keycloak]);

  return (
    <KeycloakContext.Provider value={{ keycloak, profile }}>
      <Layout>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>
          <Route path='/home' exact>
            <Home />
          </Route>
          <Route path='/runs' exact>
            <AllRuns />
          </Route>
          <Route path='/runs/:runId'>
            <RunDetail />
          </Route>
          <Route path='/new-run'>
            <NewRun />
          </Route>
          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </Layout>
    </KeycloakContext.Provider>
  );
}

export default App;