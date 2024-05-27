import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api';
import { getRoutesByUserId, createRun } from '../../lib/resource-server-api';
import useAuthRequest from '../../hooks/use-http';
import { KeycloakContext } from '../../App';
import SelectUserId from '../form-fields/SelectUserId';
import { getCurrentLocalISOString, convertMilesToMeters, convertDurationToMilliseconds } from '../util/FormatUtils';
import useUserData from '../../hooks/use-user-data'; // Importing the custom hook

const AdminCreateRunForm = () => {
  const history = useHistory();
  const { profile } = useContext(KeycloakContext);
  const { userIds, userRoutes, loading } = useUserData(profile); 

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });
  const [startDateTime, setStartDateTime] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('');
  const [formValid, setFormValid] = useState(false);

  const formRef = useRef(null);

  const fetchUserIds = useCallback(async (token) => {
    return getAllUserIds(token);
  }, [profile]);

  const { status: userIdsStatus, data: loadedUserIds } = useAuthRequest(fetchUserIds);

  useEffect(() => {
    if (!loading && userIds.length > 0) {
      setSelectedUserId(userIds[0]);
    }
  }, [loading, userIds]);

  useEffect(() => {
    if (!loading && selectedUserId && userRoutes.length > 0) {
      setSelectedRouteId(userRoutes[0].routeId);
    }
  }, [loading, selectedUserId, userRoutes]);

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
      }
    };

    getUserTimeZone();
  }, []);

  useEffect(() => {
    const getCurrentDateTime = () => {
      if (userTimeZone) {
        setStartDateTime(getCurrentLocalISOString(userTimeZone));
      }
    };
    getCurrentDateTime();
  }, [userTimeZone]);

  const createRunHandler = async (event) => {
    event.preventDefault();

    const runData = {
      userId: selectedUserId,
      routeId: selectedRouteId,
      distance: convertMilesToMeters(distance),
      duration: convertDurationToMilliseconds(duration),
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

  const handleUserIdChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div className={classes.container}>
      <Card>
        <h1 className={classes.h1}>Create Run</h1>
      </Card>
      <WideCard>
        <form ref={formRef} onSubmit={createRunHandler}>
          <SelectUserId
            selectedUserId={selectedUserId}
            loadedUserIds={loadedUserIds}
            onChange={handleUserIdChange}
            requestStatus={userIdsStatus}
          />
          <label>
            Select Route:
            <select value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)}>
              <option value="">-- No Route Selected --</option>
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
            />
          </label>
          <label>
            Duration:
            <input
              type="text"
              value={duration.hours}
              onChange={(e) => handleDurationChange(e, 'hours')}
              maxLength="2"
              style={{ width: '50px', marginRight: '5px' }}
            />
            :
            <input
              type="text"
              value={duration.minutes}
              onChange={(e) => handleDurationChange(e, 'minutes')}
              maxLength="2"
              style={{ width: '50px', marginRight: '5px', marginLeft: '5px' }}
            />
            :
            <input
              type="text"
              value={duration.seconds}
              onChange={(e) => handleDurationChange(e, 'seconds')}
              maxLength="2"
              style={{ width: '50px', marginLeft: '5px' }}
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
