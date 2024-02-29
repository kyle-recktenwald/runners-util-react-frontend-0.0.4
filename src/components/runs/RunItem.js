import { Link } from 'react-router-dom';

import classes from './RunItem.module.css';

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

function yardsToMiles(yards) {
  const miles = yards / 1760; // Convert yards to miles
  return miles.toFixed(2); // Return the result rounded to 2 decimal places
}

function formatDuration(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const RunItem = (props) => {
  return (
    <li className={classes.item}>
      <div>
        <div className='run-item__description'>
            <h2>{formatTimestamp(props.startDateTime)}</h2>
            <h2>{yardsToMiles(props.distance)} Miles</h2>
            <div className='run-item__duration'>{formatDuration(props.duration)}</div>
        </div>
      </div>
      <Link className='btn' to={`/runs/${props.id}`}>
        More...
      </Link>
    </li>
  );
};

export default RunItem;
