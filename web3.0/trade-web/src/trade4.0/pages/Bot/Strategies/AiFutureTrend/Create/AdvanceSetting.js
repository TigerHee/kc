/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import AdvanceSettingWrap from 'Bot/components/Common/AdvanceSettingWrap';
import { _t } from 'Bot/utils/lang';
import PullBack from 'AiFutureTrend/components/PullBack';
import StopLossProfit from 'AiFutureTrend/components/StopLossProfit';

const AdvanceSetting = React.memo(({ mergeState, createParams, setMergeState }) => {
  return (
    <AdvanceSettingWrap>
      <PullBack value={mergeState.pullBack} onChange={(val) => setMergeState({ pullBack: val })} />
      <StopLossProfit
        value={mergeState.stopLossPercent}
        scene="stopLossPercent"
        onChange={(val) => setMergeState({ stopLossPercent: val })}
        min={createParams.minStopLossPercent}
        max={createParams.maxStopLossPercent}
      />
      <StopLossProfit
        value={mergeState.stopProfitPercent}
        scene="stopProfitPercent"
        onChange={(val) => setMergeState({ stopProfitPercent: val })}
        min={createParams.minStopProfitPercent}
        max={createParams.maxStopProfitPercent}
      />
    </AdvanceSettingWrap>
  );
});

export default AdvanceSetting;
