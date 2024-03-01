import React from 'react';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import classes from './ManageRunDataMenu.module.css';

const ManageRunDataMenu = () => {
  return (
    <>
      <Card>
        <h1 className={classes.h1}>Runs</h1>
      </Card>
      <WideCard>
      <div className={classes.runTableContainer}>
      <div className={classes.buttonContainer}>
        <button className={classes.createButton}>Create Run</button>
      </div>
        <table className={classes.runTable}>
          <thead>
            <tr className={classes.tableHeader}>
              <th className={classes.editDeleteCell}>Actions</th>
              <th className={classes.tableCell}>Run ID</th>
              <th className={classes.tableCell}>Create Date</th>
              <th className={classes.tableCell}>CRUD Status</th>
              <th className={classes.tableCell}>Update Date</th>
              <th className={classes.tableCell}>Distance</th>
              <th className={classes.tableCell}>Start Date Time</th>
              <th className={classes.tableCell}>Created By User ID</th>
              <th className={classes.tableCell}>Updated By User ID</th>
              <th className={classes.tableCell}>Route ID</th>
              <th className={classes.tableCell}>Run Owner User ID</th>
              <th className={classes.editDeleteCell}></th>
            </tr>
          </thead>
          <tbody>
            <tr className={classes.tableRow}>
              <td className={classes.editDeleteCell}>
                <button className={classes.editButton}>Edit</button>
                <button className={classes.deleteButton}>Delete</button>
              </td>
              <td className={classes.tableCell}>1</td>
              <td className={classes.tableCell}>2022-05-01</td>
              <td className={classes.tableCell}>Active</td>
              <td className={classes.tableCell}>2022-05-02</td>
              <td className={classes.tableCell}>10 km</td>
              <td className={classes.tableCell}>2022-05-01 08:00 AM</td>
              <td className={classes.tableCell}>user123</td>
              <td className={classes.tableCell}>admin456</td>
              <td className={classes.tableCell}>route789</td>
              <td className={classes.tableCell}>ownerUser567</td>
              <td className={classes.editDeleteCell}></td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
      </WideCard>
    </>
  );
};

export default ManageRunDataMenu;