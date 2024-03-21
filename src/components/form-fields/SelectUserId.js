import React from 'react';

const SelectUserId = ({ selectedUserId, loadedUserIds = [], onChange, requestStatus }) => (
  <label>
    User ID:
    {requestStatus === 'pending' ? (
      <span>Loading...</span>
    ) : (
      <select value={selectedUserId} onChange={onChange}>
        {loadedUserIds && loadedUserIds.map((userId) => (
          <option key={userId} value={userId}>
            {userId}
          </option>
        ))}
      </select>
    )}
  </label>
);

export default SelectUserId;
