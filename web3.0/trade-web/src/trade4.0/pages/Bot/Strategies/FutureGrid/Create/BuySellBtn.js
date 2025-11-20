/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { useModel } from './model';
import TradeButton from 'Bot/components/Common/TradeButton';

export default React.memo(() => {
  const {
    setCommonSetting,
    commonSetting: { direction },
  } = useModel();
  const handleRadioBtnChange = useCallback((e) => {
    setCommonSetting({ direction: e });
  }, []);
  return <TradeButton value={direction} onChange={handleRadioBtnChange} mb={16} />;
});
