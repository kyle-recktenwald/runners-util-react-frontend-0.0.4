import React, { useContext, useState, useEffect } from 'react';
import { useHistory  } from 'react-router-dom';
import { KeycloakContext } from '../../App';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';
import { getAllUserIds } from '../../lib/keycloak-server-api'; // Replace with the actual path

const AdminCreateRunForm = () => {
  const { profile } = useContext(KeycloakContext);
  const history = useHistory();
  
  // State for form fields
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  // Add more state variables for other form fields

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const fetchedUserIds = await getAllUserIds(profile.token);
        setUserIds(fetchedUserIds);
      } catch (error) {
        console.error('Error fetching user IDs:', error);
      }
    };

    fetchUserIds();
  }, []);


  const createRunHandler = (event) => {
    event.preventDefault();

    // Perform form validation and submission logic here
    // For simplicity, let's just log the form data for now
    console.log('Form submitted:', { distance, duration });

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
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="" disabled>
                Select User ID
              </option>
              {userIds.map((userId) => (
                <option key={userId} value={userId}>
                  {userId}
                </option>
              ))}
            </select>
          </label>
          <label>
            Distance (yards):
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
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