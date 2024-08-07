import React, { useState, useCallback, useRef, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api';
import { getRoutesByUserId, createRun, getRouteById } from '../../lib/resource-server-api';
import useAuthRequest from '../../hooks/use-http';
import { KeycloakContext } from '../../App';
import SelectUserId from '../form-fields/SelectUserId';
import { getCurrentLocalISOString, convertMilesToMeters, convertDurationToMilliseconds, convertMetersToMiles } from '../util/FormatUtils';

const AdminCreateRunForm = () => {
  const history = useHistory();
  const { profile } = useContext(KeycloakContext);

  const [userIds, setUserIds] = useState([]);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const { status: userIdsStatus, data: loadedUserIds } = useAuthRequest(fetchUserIds);

  useEffect(() => {
    const fetchUserIds = async () => {
      setLoading(true);
      try {
        const userIdsData = await getAllUserIds(profile.token);
        setUserIds(userIdsData);
        if (userIdsData.length > 0) {
          setSelectedUserId(userIdsData[0]);
        }
      } catch (error) {
        console.error('Error fetching user IDs:', error);
      }
      setLoading(false);
    };

    if (profile) {
      fetchUserIds();
    }
  }, [profile]);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (selectedUserId) {
        setLoading(true);
        try {
          const routesData = await getRoutesByUserId(profile.token, selectedUserId);
          setUserRoutes(routesData);
          if (routesData.length > 0) {
            const firstRoute = routesData[0];
            setSelectedRouteId(firstRoute.routeId);
            setDistance(convertMetersToMiles(firstRoute.distance));
          }
        } catch (error) {
          console.error('Error fetching routes:', error);
        }
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [selectedUserId, profile]);

  useEffect(() => {
    setFormValid(selectedUserId !== '' && distance !== '' && duration.seconds !== '' && startDateTime !== '');
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

  const handleUserIdChange = async (event) => {
    event.preventDefault();
    const newUserId = event.target.value;
    setSelectedUserId(newUserId);
    try {
      const routes = await getRoutesByUserId(profile.token, newUserId);
      setUserRoutes(routes);
      if (routes.length > 0) {
        const firstRoute = routes[0];
        setSelectedRouteId(firstRoute.routeId);
        setDistance(convertMetersToMiles(firstRoute.distance));
      } else {
        setSelectedRouteId('');
        setDistance('');
      }
    } catch (error) {
      console.error('Error fetching user routes:', error);
    }
  };

  const handleRouteChange = async (event) => {
    event.preventDefault();
    const selectedRouteId = event.target.value;
    setSelectedRouteId(selectedRouteId);
    let route = null;
    if (selectedRouteId) {
      try {
        route = await getRouteById(profile.token, selectedRouteId);
        if (route) {
          setDistance(convertMetersToMiles(route.distance));
        }
      } catch (error) {
        console.error('Error fetching route:', error);
      }
    } else {
      setDistance('');
    }
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
            <select value={selectedRouteId} onChange={handleRouteChange}>
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
