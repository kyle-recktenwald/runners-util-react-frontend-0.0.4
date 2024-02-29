import { Fragment } from 'react';
import Card from '../UI/Card';
import classes from './Welcome.module.css';

const Welcome = () => {
  return (
    <Fragment>
      <Card>
        <h1 className={classes.h1}>Welcome to Runtils!</h1>
        <h2 className={classes.h2}>A runner's utility application</h2>
      </Card>
    </Fragment>
  );
};

export default Welcome;