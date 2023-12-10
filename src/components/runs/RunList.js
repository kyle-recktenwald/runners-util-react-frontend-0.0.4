import { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import RunItem from './RunItem';
import classes from './RunList.module.css';

const sortRuns = (runs, ascending) => {
  return runs.sort((runA, runB) => {
    if (ascending) {
      return runA.id > runB.id ? 1 : -1;
    } else {
      return runA.id < runB.id ? 1 : -1;
    }
  });
};

const RunList = (props) => {
  const history = useHistory();
  const location = useLocation();

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
      <div className={classes.sorting}>
        <button onClick={changeSortingHandler}>
          Sort {isSortingAscending ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <ul className={classes.list}>
        {sortedRuns.map((run) => (
          <RunItem
            key={run.id}
            id={run.id}
            dateTime={run.dateTime}
            distance={run.distance}
            duration={run.duration}
          />
        ))}
      </ul>
    </Fragment>
  );
};

export default RunList;
