import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import runningBannerImage from '../../assets/running_banner.jpg';

const MainNavigation = () => {
  return (
    <Fragment>
    <header className={classes.header}>
      <div className={classes.logo}>Runner Utils</div>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink to='/runs' activeClassName={classes.active}>
              All Runs
            </NavLink>
          </li>
          <li>
            <NavLink to='/new-run' activeClassName={classes.active}>
              Record a Run
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
    <div className={classes['main-image']}>
        <img src={runningBannerImage} alt='A runner with a mountain in the distance.' />
      </div>
    </Fragment>
    
    
  );
};

export default MainNavigation;
