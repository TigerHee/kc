/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import HistoryDetail from './HistoryDetail';

export default (props) => {
  return <HistoryTemp {...props} modelName="infinitygrid" HistoryDetail={HistoryDetail} />;
};
