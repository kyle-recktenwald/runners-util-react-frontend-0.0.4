import React from 'react';
import Card from '../UI/Card';
import classes from './AdminConsoleMenu.module.css';
import { Link } from 'react-router-dom';

const AdminConsoleMenu = () => {
  return (
    <>
      <Card>
        <h1 className={classes.h1}>Admin Console:</h1>
        <div className={classes['manage-data-button']}>
          <Link to="/admin/manage-data">Manage Data</Link>
        </div>
      </Card>
    </>
  );
};

export default AdminConsoleMenu;