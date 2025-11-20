import React, {memo} from 'react';
import styled from '@emotion/native';

import {isValidNumber} from 'utils/helper';
import NumberFormat from '../NumberFormat';

const StyledNumber = styled(NumberFormat)`
  color: ${({theme, isUp, isUndef, isZero}) =>
    isUndef || isZero
      ? theme.colorV2.text
      : isUp
      ? theme.colorV2.chartUpColor
      : theme.colorV2.chartDownColor};
`;

const Number = ({
  style,
  hiddenPositiveChar = false,
  isProfitNumber = false,
  ...others
}) => {
  const isUp = others.children >= 0;
  const isNilVal = !isValidNumber(others.children);

  return (
    <StyledNumber
      isUndef={isNilVal}
      isUp={isUp}
      isZero={+others.children === 0}
      style={style}
      isProfitNumber={isProfitNumber}
      isPositive={!hiddenPositiveChar}
      {...others}
    />
  );
};

export default memo(Number);
