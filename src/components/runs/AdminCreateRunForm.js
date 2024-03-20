import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api';
import { getRoutesByUserId, createRun } from '../../lib/resource-server-api';
import useAuthRequest from '../../hooks/use-http';
import { KeycloakContext } from '../../App';

const AdminCreateRunForm = () => {
  const history = useHistory();
  const { profile } = useContext(KeycloakContext);

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });
  const [startDateTime, setStartDateTime] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('');
  const [formValid, setFormValid] = useState(false);
  const [userRoutes, setUserRoutes] = useState([]);

  const hourInputRef = useRef(null);
  const minuteInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const fetchUserIds = useCallback(async (token) => {
    return getAllUserIds(token);
  }, [profile]);

  const { status: userIdsStatus, data: loadedUserIds } = useAuthRequest(fetchUserIds);

  useEffect(() => {
    if (loadedUserIds !== null && loadedUserIds.length > 0) {
      setSelectedUserId(loadedUserIds[0]);
    }
  }, [loadedUserIds]);

  useEffect(() => {
    if (selectedUserId) {
      fetchRoutes(selectedUserId);
      setSelectedRouteId('');
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (userRoutes.length > 0) {
      setSelectedRouteId(userRoutes[0].routeId);
    }
  }, [userRoutes]);

  const fetchRoutes = async (userId) => {
    try {
      const routes = await getRoutesByUserId(profile.token, userId);
      setUserRoutes(routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  useEffect(() => {
    setFormValid(selectedUserId !== '' && distance !== '' && duration.hours !== ''
      && duration.minutes !== '' && duration.seconds !== '' && startDateTime !== '');
  }, [selectedUserId, distance, duration, startDateTime]);

  useEffect(() => {
    const getUserTimeZone = async () => {
      try {
        const timeZone = await Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimeZone(timeZone);
      } catch (error) {
        console.error('Error retrieving time zone:', error);
        // Handle error: set a default time zone or retry obtaining the time zone
      }
    };

    getUserTimeZone();
  }, []); // Empty dependency array ensures the effect runs only once after the component mounts

  useEffect(() => {
    const getCurrentDateTime = () => {
      if (userTimeZone) {
        setStartDateTime(getCurrentLocalISOString(userTimeZone));
      }
    };
    getCurrentDateTime();
  }, [userTimeZone]); // Dependency added to update when userTimeZone changes

  function getCurrentLocalISOString(userTimeZone) {
    const now = new Date();
    const options = {
      timeZone: userTimeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false
    };
    const localISOString = now.toLocaleString('en-US', options)
      .replace(',', '')
      .replace(/\//g, '-')
      .replace(' ', 'T');

    const parts = localISOString.split('T');
    const datePart = parts[0];
    const timePart = parts[1];

    const dateComponents = datePart.split('-');
    const month = dateComponents[0];
    const day = dateComponents[1];
    const year = dateComponents[2];

    const formattedDate = `${year}-${month}-${day}`;

    const outputDateTime = `${formattedDate}T${timePart}`;

    return outputDateTime;
  }

  const createRunHandler = async (event) => {
    event.preventDefault();

    const distanceInMeters = parseFloat(distance) * 1609.34;

    const durationInMilliseconds = ((parseInt(duration.hours, 10) || 0) * 3600000) +
      ((parseInt(duration.minutes, 10) || 0) * 60000) +
      ((parseInt(duration.seconds, 10) || 0) * 1000);

    const runData = {
      userId: selectedUserId,
      routeId: selectedRouteId,
      distance: distanceInMeters,
      duration: durationInMilliseconds,
      startDateTime: new Date(startDateTime).toISOString(),
      createdByUserId: profile.id,
    };

    try {
      await createRun(runData, profile.token);
      console.log('Run created successfully');
      history.push('/admin/manage-data/runs');
    } catch (error) {
      console.error('Error creating run:', error);
    }
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
            {userIdsStatus === 'completed' ? (
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
            Select Route:
            <select value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)}>
              {userRoutes.map((route) => (
                <option key={route.routeId} value={route.routeId}>
                  {route.name}
                </option>
              ))}
            </select>
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
          <label>
            Start Date and Time:
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </label>
          <button type="submit" className={classes.createButton} disabled={!formValid}>
            Create Run
          </button>
        </form>
      </WideCard>
    </div>
  );
};

export default AdminCreateRunForm;
