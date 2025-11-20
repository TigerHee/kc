/**
 * Owner: mike@kupotech.com
 */
import { useTradeType } from '@/hooks/common/useTradeType';
import { commonSensorsFunc } from '@/meta/sensors';
import TradeTypesSelect from '@/pages/Orders/Common/TradeTypesSelect';
// import SettlementSort from '@/pages/Orders/FuturesOrders/NewPosition/components/SettlementSort';
import Checkbox from '@mui/Checkbox';
import { useDispatch, useSelector } from 'dva';
import React from 'react';
import { _t } from 'utils/lang';
import { fundTableHeadFilterCfg } from '../../config';
import { Box } from './style';

export default (props) => {
  const tradeType = useTradeType();

  const dispatch = useDispatch();

  const currentHeadCfg = fundTableHeadFilterCfg.get(tradeType);
  const onCheckBoxChange = React.useCallback(
    (e) => {
      dispatch({
        type: 'fund/updateFundHeadFilter',
        payload: {
          cacheKey: currentHeadCfg.cacheKey,
          cacheValue: e.target.checked,
          [currentHeadCfg.modelKey]: e.target.checked,
        },
      });
      commonSensorsFunc(['assetTab', 3, 'click']);
    },
    [currentHeadCfg],
  );
  const checkValue = useSelector((state) => state.fund[currentHeadCfg.modelKey]);
  return (
    <Box active={checkValue}>
      <TradeTypesSelect sensorKey="assetTab" />
      <div className="fund-tools-r">
        <Checkbox
          className={currentHeadCfg.modelKey}
          onChange={onCheckBoxChange}
          checked={checkValue}
        >
          {_t(currentHeadCfg.langKey)}
        </Checkbox>
        {/* <SettlementSort isFilter underline={false} /> */}
      </div>
    </Box>
  );
};
