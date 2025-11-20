/**
 * Owner: garuda@kupotech.com
 */

import React, { useState, useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { isUndefined, debounce } from 'lodash';

import Slider from '@mui/RadioSlider';

import { styled, sliderMarks } from '../../../builtinCommon';

import { LEVERAGE_MIN } from '../../../config';
import { useGetLeverage, useGetSymbolInfo } from '../../../hooks/useGetData';

const SliderCls = styled(Slider)`
  &.rc-slider {
    margin: 2px auto 26px;
  }
`;

const CalculatorSlider = () => {
  const dispatch = useDispatch();
  const [innerValue, setInnerValue] = useState(LEVERAGE_MIN);
  const leverage = useGetLeverage();
  const { symbolInfo } = useGetSymbolInfo();
  const { maxLeverage = 5 } = symbolInfo;

  const onLeverageChange = useCallback(
    (v) => {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          calculatorLeverage: v,
        },
      });
    },
    [dispatch],
  );

  // 200 ms 节流更新买一卖一价格
  const debounceLeverageChange = useCallback(
    debounce((v) => {
      onLeverageChange(v);
    }, 200),
    [],
  );

  const handleSliderChange = useCallback(
    (v) => {
      setInnerValue(v);
      debounceLeverageChange(v);
    },
    [debounceLeverageChange],
  );

  // 以全局的 leverage 进行初始化设置
  useEffect(() => {
    if (leverage) {
      setInnerValue(leverage);
      onLeverageChange(leverage);
    }
  }, [leverage, onLeverageChange]);
  return (
    <SliderCls
      disabled={isUndefined(leverage)}
      marks={sliderMarks(maxLeverage)}
      min={LEVERAGE_MIN}
      max={maxLeverage}
      value={innerValue}
      onChange={handleSliderChange}
    />
  );
};

export default React.memo(CalculatorSlider);
