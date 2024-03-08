import React, { useContext, useState, useEffect, useCallback } from 'react';
import useHttp from '../../hooks/use-http';
import { useHistory } from 'react-router-dom';
import { KeycloakContext } from '../../App';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api';

const AdminCreateRunForm = () => {
  const { profile, keycloak } = useContext(KeycloakContext);
  const history = useHistory();

  // State for form fields
  const [selectedUserId, setSelectedUserId] = useState(''); // Conditionally set the initial value
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  // Add more state variables for other form fields

  const fetchUserIds = useCallback(() => {
    if (!keycloak) {
      console.log('Error: No Keycloak instance');
      return Promise.resolve([]);
    }
    return getAllUserIds(keycloak.token);
  }, [keycloak]);

  const { sendRequest, status, data: loadedUserIds, error } = useHttp(
    keycloak ? fetchUserIds : null, true
  );

  useEffect(() => {
    if (keycloak) {
      sendRequest();
    }
  }, [sendRequest, keycloak]);

  const createRunHandler = (event) => {
    event.preventDefault();

    // Form Validation

    console.log('Form submitted:', { selectedUserId, distance, duration });

    // Redirect back to the AdminRunTable page after creating the run
    history.push('/admin-run-table');
  };

  return (
    <div className={classes.container}>
      <Card>
        <h1 className={classes.h1}>Create Run</h1>
      </Card>
      <WideCard>
        <form onSubmit={createRunHandler}>
          <label>
            User ID:
            {loadedUserIds ? (
              <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                {loadedUserIds.map((userId) => (
                  <option key={userId} value={userId}>
                    {userId}
                  </option>
                ))}
              </select>
            ) : (
              <span>Loading...</span>
            )}
          </label>
          <label>
            Distance (miles):
            <input
              type="text"
              value={distance}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d*\.?\d*$/.test(input)) {
                  setDistance(input);
                }
              }}
              onKeyDown={(e) => {
                // Allow only numeric and decimal characters, backspace, and delete
                const isValidChar =
                  /^\d$/.test(e.key) ||
                  e.key === '.' ||
                  e.key === 'Backspace' ||
                  e.key === 'Delete';
                if (!isValidChar) {
                  e.preventDefault();
                }
              }}
            />
          </label>
          <label>
            Duration (milliseconds):
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>
          {/* Add more form fields as needed */}
          <button type="submit" className={classes.createButton}>
            Create Run
          </button>
        </form>
      </WideCard>
    </div>
  );
};

export default AdminCreateRunForm;