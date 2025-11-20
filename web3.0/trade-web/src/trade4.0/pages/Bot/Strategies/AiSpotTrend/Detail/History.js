/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { StopOrderPageChart } from 'AiSpotTrend/components/charts';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';

const modelName = 'aispottrend';
export default (props) => {
  const {
    runningData: { id, symbol, status }, // 运行中的数据
  } = props;

  const symbolInfo = useSpotSymbolInfo(symbol);

  const Append =
    status !== 'STOPPED' ? (
      <StopOrderPageChart taskId={id} symbolInfo={symbolInfo} modelName={modelName} />
    ) : null;

  return (
    <HistoryTemp {...props} modelName={modelName} hasDetail={false} Append={Append} profitLabel={_t('profit')} />
  );
};
