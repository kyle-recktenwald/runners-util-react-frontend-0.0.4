import { Link } from 'react-router-dom';

import classes from './NoRunsFound.module.css';

const NoRunsFound = () => {
  return (
    <div className={classes.noruns}>
      <p>No runs found!</p>
      <Link className='btn' to='/new-run'>
        Add a Run
      </Link>
    </div>
  );
};

export default NoRunsFound;
