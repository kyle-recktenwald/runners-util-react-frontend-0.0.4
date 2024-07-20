import { Fragment } from 'react';
import Card from '../UI/Card';
import RunList from '../runs/WelcomeRunList';
import classes from './Welcome.module.css';
import WelcomeRunContainer from '../runs/WelcomeRunContainer';

const Welcome = () => {
  return (
    <Fragment>
      <WelcomeRunContainer>
      </WelcomeRunContainer>
    </Fragment>
  );
};

export default Welcome;