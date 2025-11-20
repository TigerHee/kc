/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import DirectRestartActionSheet from './DirectRestartActionSheet';
import PauseActionSheet from './Pause';

// 暂停/重启选择器
const PauseRestartActionSheet = (props) => {
  const { actionSheerRef, item, onFresh } = props;
  if (item.status === 'RUNNING') {
    return (
      <PauseActionSheet actionSheerRef={actionSheerRef} taskId={item.taskId} onFresh={onFresh} />
    );
  } else if (item.status === 'PAUSED') {
    return <DirectRestartActionSheet {...props} />;
  }
  return null;
};

export default PauseRestartActionSheet;
