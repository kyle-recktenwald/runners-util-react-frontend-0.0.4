import React, { useState } from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import Card from '../UI/Card';
import WideCard from '../UI/WideCard';
import RunDetailsModal from './RunDetailsModal';
import { formatTimestamp, convertMetersToMiles, formatDuration } from '../util/FormatUtils';
import classes from './AdminRunTable.module.css';

const sortRuns = (runs, ascending) => {
  return runs.sort((runA, runB) => {
    if (ascending) {
      return runA.id > runB.id ? 1 : -1;
    } else {
      return runA.id < runB.id ? 1 : -1;
    }
  });
};

const AdminRunTable = (props) => {
  const [selectedRun, setSelectedRun] = useState(null);
  const history = useHistory();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isSortingAscending = queryParams.get('sort') === 'asc';
  const sortedRuns = sortRuns(props.runs, isSortingAscending);

  const changeSortingHandler = () => {
    history.push({
      pathname: location.pathname,
      search: `?sort=${isSortingAscending ? 'desc' : 'asc'}`,
    });
  };

  const viewRunHandler = (run) => {
    setSelectedRun(run);
  };

  const closeModalHandler = () => {
    setSelectedRun(null);
  };

  return (
    <React.Fragment>
      <Card>
        <h1 className={classes.h1}>Runs</h1>
      </Card>
      <WideCard>
        <div className={classes.runTableContainer}>
          <div className={classes.buttonContainer}>
            <NavLink to="/admin/manage-data/runs/create" className={classes.createButton}>
              Create Run
            </NavLink>
            <button className={classes.sortButton} onClick={changeSortingHandler}>
              Sort {isSortingAscending ? 'Descending' : 'Ascending'}
            </button>
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
                <th className={classes.tableCell}>Created By User ID</th>
                <th className={classes.tableCell}>Create Date</th>
                <th className={classes.tableCell}>Updated By User ID</th>
                <th className={classes.tableCell}>Update Date</th>
                <th className={classes.tableCell}>Is Deleted</th>
              </tr>
            </thead>
            <tbody>
              {sortedRuns.map((run) => (
                <tr className={classes.tableRow} key={run.id}>
                  <td className={classes.tableCell}>
                    <button className={classes.viewButton} onClick={() => viewRunHandler(run)}>
                      View
                    </button>
                    <button className={classes.editButton}>Edit</button>
                    <button className={classes.deleteButton}>Delete</button>
                  </td>
                  <td className={classes.tableCell}>{formatTimestamp(run.startDateTime)}</td>
                  <td className={classes.tableCell}>{run.userId}</td>
                  <td className={classes.tableCell}>{run.runId}</td>
                  <td className={classes.tableCell}>{convertMetersToMiles(run.distance)}</td>
                  <td className={classes.tableCell}>{formatDuration(run.duration)}</td>
                  <td className={classes.tableCell}>{run.route ? run.route.routeId : 'null'}</td>
                  <td className={classes.tableCell}>{run.crudEntityInfo.createdBy}</td>
                  <td className={classes.tableCell}>{formatTimestamp(run.crudEntityInfo.createDate)}</td>
                  <td className={classes.tableCell}>
                    {run.crudEntityInfo.updatedBy ? run.crudEntityInfo.updatedBy : 'null'}
                  </td>
                  <td className={classes.tableCell}>{formatTimestamp(run.crudEntityInfo.updateDate)}</td>
                  <td className={classes.tableCell}>{run.crudEntityInfo.isDeleted ? 'true' : 'false'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WideCard>
      {selectedRun && <RunDetailsModal run={selectedRun} onClose={closeModalHandler} />}
    </React.Fragment>
  );
};

export default AdminRunTable;
