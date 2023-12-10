import { Fragment, useRef, useState } from 'react';
import { Prompt } from 'react-router-dom';

import Card from '../UI/Card';
import LoadingSpinner from '../UI/LoadingSpinner';
import classes from './RunForm.module.css';

const RunForm = (props) => {
  const [isEntering, setIsEntering] = useState(false);

  const dateTimeInputRef = useRef();
  const distanceInputRef = useRef();
  const durationInputRef = useRef();


  function submitFormHandler(event) {
    event.preventDefault();

    const enteredDateTime = dateTimeInputRef.current.value;
    const enteredDistance = distanceInputRef.current.value;
    const enteredDuration = durationInputRef.current.value;

    //TODO: Add Validation

    props.onAddRun({ dateTime: enteredDateTime, distance: enteredDistance, duration: enteredDuration });
  }

  const finishEnteringHandler = () => {
    setIsEntering(false);
  };

  const formFocusedHandler = () => {
    setIsEntering(true);
  };

  return (
    <Fragment>
      <Prompt
        when={isEntering}
        message={(location) =>
          'Are you sure you want to leave? All your entered data will be lost!'
        }
      />
      <Card>
        <form
          onFocus={formFocusedHandler}
          className={classes.form}
          onSubmit={submitFormHandler}
        >
          {props.isLoading && (
            <div className={classes.loading}>
              <LoadingSpinner />
            </div>
          )}
          <div className={classes.control}>
            <label htmlFor='dateTime'>Date & Time</label>
            <input type='date' id='dateTime' ref={dateTimeInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='number'>Distance</label>
            <input type='number' id='distance' ref={distanceInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor='number'>Duration</label>
            <input type='number' id='duration' ref={durationInputRef} />
          </div>
          <div className={classes.actions}>
            <button onClick={finishEnteringHandler} className='btn'>Save Run</button>
          </div>
        </form>
      </Card>
    </Fragment>
  );
};

export default RunForm;
