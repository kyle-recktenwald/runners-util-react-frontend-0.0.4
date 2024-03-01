import React from 'react';
import Card from '../UI/Card';
import classes from './ManageDataMenu.module.css';
import { Link } from 'react-router-dom';

const ManageDataMenu = () => {
  return (
    <>
      <Card>
        <h1 className={classes.h1}>Manage Data:</h1>
        <div className={classes['manage-data-button']}>
          <Link to="/admin/manage-data/runs">Runs</Link>
          <Link to="/admin/manage-data/routes">Routes</Link>
        </div>
      </Card>
    </>
  );
};

export default ManageDataMenu;