import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api';
import useAuthRequest from '../../hooks/use-http';

const AdminCreateRunForm = () => {
  const history = useHistory();

  const [selectedUserId, setSelectedUserId] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const fetchUserIds = useCallback(async (token) => {
    return getAllUserIds(token);
  }, []);

  const { status, data: loadedUserIds, error } = useAuthRequest(fetchUserIds);

  const createRunHandler = (event) => {
    event.preventDefault();

    // Form Validation

    console.log('Form submitted:', { selectedUserId, distance, duration });

    history.push('/manage-data/runs');
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