import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './AdminCreateRunForm.module.css';

const AdminCreateRunForm = () => {
  const history = useHistory();

  // State for form fields
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  // Add more state variables for other form fields

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