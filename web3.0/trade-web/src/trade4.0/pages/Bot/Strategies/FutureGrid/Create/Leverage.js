/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useState, useCallback } from 'react';
import LeveragePicker from 'Bot/components/Common/LeveragePicker.js';
import { getMaxLeverage } from '../services';
import { useModel } from './model';
import useUpdateLayoutEffect from 'Bot/hooks/useUpdateLayoutEffect';

const maxDefaultLeverage = 10;
/**
 * @description: 杠杆倍数选择处理
 * @return {*}
 */
export default ({ symbolCode }) => {
  const {
    commonSetting: { direction, leverage },
    setCommonSetting,
  } = useModel();
  const [maxLeverage, setMaxLeverage] = useState(5);
  useEffect(() => {
    if (!symbolCode) return;
    getMaxLeverage(symbolCode).then(({ data: mleverage }) => {
      setMaxLeverage(Math.min(mleverage, maxDefaultLeverage));
    });
  }, [symbolCode]);

  // direction变化 重置杠杆倍数
  useUpdateLayoutEffect(() => {
    setCommonSetting({
      leverage: direction === 'long' ? 2 : 1,
    });
  }, [direction]);

  const setLeverage = useCallback((v) => {
    setCommonSetting({ leverage: v });
  }, []);
  // 做多要大于2x
  const minLeverage = direction === 'long' ? 2 : 1;
  return (
    <LeveragePicker
      min={minLeverage}
      max={maxLeverage}
      value={leverage}
      onChange={setLeverage}
      symbolCode={symbolCode}
    />
  );
};
