/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import LeveragePicker from 'Bot/components/Common/LeveragePicker.js';
import { useModel } from './model';

/**
 * @description: 杠杆倍数选择处理
 * @return {*}
 */
export default ({ symbolCode, maxLeverage }) => {
  const {
    commonSetting: { leverage },
    setCommonSetting,
  } = useModel();

  const setLeverage = useCallback((v) => {
    setCommonSetting({ leverage: v });
  }, []);

  return (
    <LeveragePicker
      min={2}
      step={0.1}
      max={maxLeverage}
      value={leverage}
      onChange={setLeverage}
      symbolCode={symbolCode}
    />
  );
};
