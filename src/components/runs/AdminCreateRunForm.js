import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });
  const [formValid, setFormValid] = useState(false); // Track form validity

  const hourInputRef = useRef(null);
  const minuteInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const fetchUserIds = useCallback(async (token) => {
    return getAllUserIds(token);
  }, []);

  const { status, data: loadedUserIds, error } = useAuthRequest(fetchUserIds);

  useEffect(() => {
    setFormValid(selectedUserId !== '' && distance !== '' && duration.hours !== '' && duration.minutes !== '' && duration.seconds !== '');
  }, [selectedUserId, distance, duration]);

  const createRunHandler = (event) => {
    event.preventDefault();

    const distanceInMeters = parseFloat(distance) * 1609.34;

    const durationInMilliseconds = ((parseInt(duration.hours, 10) || 0) * 3600000) +
      ((parseInt(duration.minutes, 10) || 0) * 60000) +
      ((parseInt(duration.seconds, 10) || 0) * 1000);

    // Form Validation

    console.log('Form submitted:', { selectedUserId, distance: distanceInMeters, duration: durationInMilliseconds });

    history.push('/manage-data/runs');
  };

  const handleDurationChange = (event, type) => {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    value = value.slice(0, 2);
    setDuration((prevDuration) => ({
      ...prevDuration,
      [type]: value,
    }));
  };

  const handleDistanceKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      hourInputRef.current.focus();
    }
  };

  const handleHourKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      minuteInputRef.current.focus();
    }
  };

  const handleMinuteKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      secondInputRef.current.focus();
    }
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
              onKeyDown={handleDistanceKeyDown}
            />
          </label>
          <label>
            Duration:
            <input
              ref={hourInputRef}
              type="text"
              value={duration.hours}
              onChange={(e) => handleDurationChange(e, 'hours')}
              maxLength="2"
              style={{ width: '50px', marginRight: '5px' }}
              onKeyDown={handleHourKeyDown}
            />
            :
            <input
              ref={minuteInputRef}
              type="text"
              value={duration.minutes}
              onChange={(e) => handleDurationChange(e, 'minutes')}
              maxLength="2"
              style={{ width: '50px', marginRight: '5px', marginLeft: '5px' }}
              onKeyDown={handleMinuteKeyDown}
            />
            :
            <input
              ref={secondInputRef}
              type="text"
              value={duration.seconds}
              onChange={(e) => handleDurationChange(e, 'seconds')}
              maxLength="2"
              style={{ width: '50px', marginLeft: '5px' }}
              onKeyDown={(e) => {
                const isValidChar = /^\d$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete';
                if (!isValidChar) {
                  e.preventDefault();
                }
              }}
            />
          </label>
          {/* Add more form fields as needed */}
          <button type="submit" className={classes.createButton} disabled={!formValid}>
            Create Run
          </button>
        </form>
      </WideCard>
    </div>
  );
};

export default AdminCreateRunForm;