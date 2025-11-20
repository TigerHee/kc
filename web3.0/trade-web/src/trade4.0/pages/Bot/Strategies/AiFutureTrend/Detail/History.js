/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { StopOrderPageChart } from 'AiSpotTrend/components/charts';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';

const modelName = 'aifuturetrend';
export default (props) => {
  const {
    runningData: { id, symbolCode, status }, // 运行中的数据
  } = props;

  const symbolInfo = useFutureSymbolInfo(symbolCode);

  const Append =
    status !== 'STOPPED' ? (
      <StopOrderPageChart taskId={id} symbolInfo={symbolInfo} modelName={modelName} />
    ) : null;

  return (
    <HistoryTemp {...props} modelName={modelName} Append={Append} profitLabel={_t('profit')} />
  );
};
