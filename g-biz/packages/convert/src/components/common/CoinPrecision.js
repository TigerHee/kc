/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { formatNumber } from '../../utils/format';
import useContextSelector from '../../hooks/common/useContextSelector';

const CoinPrecision = (props) => {
  const { coin, value, precision, ...otherProps } = props;
  const currenciesMap = useContextSelector((state) => state.currenciesMap);
  const coinObj = currenciesMap[coin];
  return (
    <>
      {coinObj
        ? formatNumber(value, {
            dp: /^\d+$/.test(`${precision}`) ? +precision : coinObj?.precision,
            ...otherProps,
          })
        : value}
    </>
  );
};

export default CoinPrecision;
