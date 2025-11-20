/**
 * Owner: garuda@kupotech.com
 * 调整真实杠杆滑杆
 */
import React, { useCallback, useState, useEffect } from 'react';
import { debounce } from 'lodash';

import { FUTURES } from '@/meta/const';
import { greaterThan, lessThan, toFixed } from 'utils/operation';

import { sliderMarks } from '@/pages/Futures/components/Leverage/utils';
import { trackClick } from 'src/utils/ga';
import { ADJUST_LEVERAGE } from '@/meta/futuresSensors/withdraw';

import { getSymbolInfo } from '@/hooks/common/useSymbol';

import { styled } from '@/style/emotion';
import Slider from '@mui/RadioSlider';

const KuxSlider = styled(Slider)`
  &.rc-slider {
    margin-bottom: 10px;
  }
`;

const SliderLeverage = ({
  symbol,
  disabled,
  minLeverage,
  maxLeverage,
  onLeverageChange,
  leverage,
  onSetWarning,
}) => {
  const { maxLeverage: sliderMaxLeverage } = getSymbolInfo({ symbol, tradeType: FUTURES });
  const [innerValue, setInnerValue] = useState(1);

  useEffect(() => {
    setInnerValue(leverage);
  }, [leverage]);

  const handleCheckLeverage = useCallback(
    debounce((v) => {
      if (greaterThan(v)(maxLeverage)) {
        onLeverageChange(maxLeverage);
        setInnerValue(maxLeverage);
        onSetWarning(true);
      } else if (lessThan(v)(minLeverage)) {
        onLeverageChange(minLeverage);
        setInnerValue(minLeverage);
        onSetWarning(true);
      } else {
        onLeverageChange(v);
      }
    }, 300),
    [maxLeverage, minLeverage, onLeverageChange],
  );

  const handleSliderChange = useCallback(
    (v) => {
      setInnerValue(v);
      handleCheckLeverage(v);
      // 埋点
      trackClick([ADJUST_LEVERAGE, '4']);
    },
    [handleCheckLeverage],
  );

  return (
    <KuxSlider
      disabled={disabled}
      marks={sliderMarks(sliderMaxLeverage)}
      min={1}
      max={sliderMaxLeverage}
      value={innerValue}
      onChange={handleSliderChange}
      step={0.01}
      tipFormatter={(v) => `${toFixed(v)(2)}x`}
    />
  );
};

export default React.memo(SliderLeverage);
