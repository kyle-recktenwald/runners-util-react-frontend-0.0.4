import React from 'react';
import FullRunTable from '../runs/FullRunTable';

const ManageRunDataMenu = (props) => {
  return <FullRunTable runs={props.runs} />
};

export default ManageRunDataMenu;