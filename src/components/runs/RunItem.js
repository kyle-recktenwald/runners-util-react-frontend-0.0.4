import { Link } from 'react-router-dom';

import classes from './RunItem.module.css';

const RunItem = (props) => {
  return (
    <li className={classes.item}>
      <div>
        <div className='run-item__description'>
            <h2>{props.dateTime}</h2>
            <h2>{props.distance} Miles</h2>
            <div className='run-item__duration'>{props.duration} Minutes</div>
        </div>
      </div>
      <Link className='btn' to={`/runs/${props.id}`}>
        More...
      </Link>
    </li>
  );
};

export default RunItem;
