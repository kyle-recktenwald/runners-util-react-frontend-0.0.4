import React from 'react';
import classes from './RunDetailsModal.module.css';
import { formatTimestamp, convertMetersToMiles, formatDuration } from '../util/FormatUtils';

const RunDetailsModal = ({ run, onClose }) => {
  if (!run) {
    return null;
  }

  return (
    <div className={classes.modalBackdrop} onClick={onClose}>
      <div className={classes.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Run Details:</h2>
        <ul>
          <li><strong>ID:</strong> {run.runId}</li>
          <li><strong>Start Date Time:</strong> {formatTimestamp(run.startDateTime)}</li>
          <li><strong>User ID:</strong> {run.userId}</li>
          <li><strong>Distance:</strong> {convertMetersToMiles(run.distance)}</li>
          <li><strong>Duration:</strong> {formatDuration(run.duration)}</li>
          <li><strong>Route ID:</strong> {run.route ? run.route.routeId : "null"}</li>
          <li><strong>Created By:</strong> {run.crudEntityInfo.createdBy}</li>
          <li><strong>Create Date:</strong> {formatTimestamp(run.crudEntityInfo.createDate)}</li>
          <li><strong>Updated By:</strong> {run.crudEntityInfo.updatedBy ? run.crudEntityInfo.updatedBy : "null"}</li>
          <li><strong>Update Date:</strong> {run.crudEntityInfo.updateDate ? formatTimestamp(run.crudEntityInfo.updateDate) : "null"}</li>
          <li><strong>Is Deleted:</strong> {run.crudEntityInfo.isDeleted ? "true" : "false"}</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RunDetailsModal;