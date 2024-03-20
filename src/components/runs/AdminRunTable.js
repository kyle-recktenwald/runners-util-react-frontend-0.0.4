import classes from './AdminRunTable.module.css';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { Fragment } from 'react';

const sortRuns = (runs, ascending) => {
  return runs.sort((runA, runB) => {
    if (ascending) {
      return runA.id > runB.id ? 1 : -1;
    } else {
      return runA.id < runB.id ? 1 : -1;
    }
  });
};

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

function yardsToMiles(yards) {
  const miles = yards / 1760; // Convert yards to miles
  return miles.toFixed(2); // Return the result rounded to 2 decimal places
}

function formatDuration(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

const AdminRunTable = (props) => {
  const history = useHistory();
  const location = useLocation();

  const createRunHandler = () => {
    history.push('/admin/create-run');
  };

  const queryParams = new URLSearchParams(location.search);

  const isSortingAscending = queryParams.get('sort') === 'asc';

  const sortedRuns = sortRuns(props.runs, isSortingAscending);

  const changeSortingHandler = () => {
    history.push({
      pathname: location.pathname,
      search: `?sort=${(isSortingAscending ? 'desc' : 'asc')}`
    });
  };

  return (
    <Fragment>
      <Card>
        <h1 className={classes.h1}>Runs</h1>
      </Card>
      <WideCard>
        <div className={classes.runTableContainer}>
          <div className={classes.buttonContainer}>
            <NavLink to="/admin/manage-data/runs/create" className={classes.createButton}>
              Create Run
            </NavLink>
            <button className={classes.sortButton} onClick={changeSortingHandler}>Sort {isSortingAscending ? 'Descending' : 'Ascending'}</button>
          </div>
          <table className={classes.runTable}>
            <thead>
              <tr className={classes.tableHeader}>
                <th className={classes.tableCell}>Actions</th>
                <th className={classes.tableCell}>Start Date Time</th>
                <th className={classes.tableCell}>User ID</th>
                <th className={classes.tableCell}>ID</th>
                <th className={classes.tableCell}>Distance</th>
                <th className={classes.tableCell}>Duration</th>
                <th className={classes.tableCell}>Route ID</th>
                <th className={classes.tableCell}>Create Date</th>
                <th className={classes.tableCell}>Update Date</th>
                <th className={classes.tableCell}>Created By User ID</th>
                <th className={classes.tableCell}>Updated By User ID</th>
                <th className={classes.tableCell}>Is Deleted</th>
              </tr>
            </thead>
            <tbody>
              {sortedRuns.map((run) => (
                <tr className={classes.tableRow} key={run.id}>
                  <td className={classes.tableCell}>
                    <button className={classes.viewButton}>View</button>
                    <button className={classes.editButton}>Edit</button>
                    <button className={classes.deleteButton}>Delete</button>
                  </td>
                  <td className={classes.tableCell}>{formatTimestamp(run.startDateTime)}</td>
                  <td className={classes.tableCell}>{run.userId}</td>
                  <td className={classes.tableCell}>{run.runId}</td>
                  <td className={classes.tableCell}>{yardsToMiles(run.distance)}</td>
                  <td className={classes.tableCell}>{formatDuration(run.duration)}</td>
                  <td className={classes.tableCell}>{run.routeId}</td>
                  <td className={classes.tableCell}>{formatTimestamp(run.createDate)}</td>
                  <td className={classes.tableCell}>{formatTimestamp(run.updateDate)}</td>
                  <td className={classes.tableCell}>{run.createdByUserId}</td>
                  <td className={classes.tableCell}>{run.updatedByUserId}</td>
                  <td className={classes.tableCell}>{run.isDeleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WideCard>
    </Fragment>
  );
};

export default AdminRunTable;
