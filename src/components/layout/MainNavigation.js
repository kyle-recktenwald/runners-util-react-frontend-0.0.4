import { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { KeycloakContext } from '../../App';


import classes from './MainNavigation.module.css';
import runningBannerImage from '../../assets/running_banner.jpg';

const MainNavigation = () => {
  const { profile } = useContext(KeycloakContext);

  // Function to get user initials
  const getUserInitials = () => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`;
    }
    return null;
  };
  
  return (
    <Fragment>
    <header className={classes.header}>
      <div className={classes.logo}><NavLink to='/home'>Runner's Util</NavLink></div>
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
      <div className={classes['user-icon']}>
          {profile ? (
            <div className={classes['user-circle']}>
              <div className={classes['user-initials']}>
                {getUserInitials()}
              </div>
            </div>
          ) : (
            <NavLink to='/login'> {/* Replace '/login' with your login route */}
              <img src="signin-icon.png" alt="Sign In" className={classes['signin-icon']} />
            </NavLink>
          )}
        </div>
    </header>
    <div className={classes['main-image']}>
        <img src={runningBannerImage} alt='A runner with a mountain in the distance.' />
      </div>
    </Fragment>
    
    
  );
};

export default MainNavigation;
