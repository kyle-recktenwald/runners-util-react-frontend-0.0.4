import { Fragment, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { KeycloakContext } from '../../App';

import classes from './MainNavigation.module.css';
import runningBannerImage from '../../assets/running_banner.jpg';

const MainNavigation = () => {
  const { profile } = useContext(KeycloakContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  // Function to get user initials
  const getUserInitials = () => {
    if (profile && profile.firstName && profile.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`;
    }
    return null;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <Fragment>
      <header className={classes.header}>
        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink to='/home' activeClassName={classes.active}>
                Home
              </NavLink>
            </li>
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
        <div
          className={`${classes['user-icon']} ${isDropdownOpen ? 'active' : ''}`}
          onClick={toggleDropdown}
        >
          {profile ? (
            <div className={classes['user-circle']}>
              <div className={classes['user-initials']}>{getUserInitials()}</div>
            </div>
          ) : (
            <NavLink to='/login'>
              <img src="signin-icon.png" alt="Sign In" className={classes['signin-icon']} />
            </NavLink>
          )}
          {isDropdownOpen && (
            <div className={classes['dropdown-menu']}>
              <div className={classes['dropdown-text']}>
                <ul>
                  <li>
                    <NavLink to='/account-settings'>Account Settings</NavLink>
                  </li>
                  {profile && profile.isAdmin && (
                    <li>
                      <NavLink to='/admin/admin-console'>Admin Console</NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
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