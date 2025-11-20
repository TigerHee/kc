/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import Spin from '@mui/Spin';

const Loading = () => {
  return (
    <div className="market-list loading" key="loading">
      <Spin spinning size="small" className="loading-spin" />
    </div>
  );
};

export default Loading;
