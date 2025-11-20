/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { connect } from 'dva';
import { numberFixed } from 'helper';
import { formatNumber } from '@/utils/format';

const CoinPrecision = (props) => {
  const { coin, value, coinDict, fillZero = false } = props;
  const coinObj = coinDict[coin];
  const realValue = coinObj ? numberFixed(value, coinObj.precision) : value;
  return (
    <React.Fragment>
      {formatNumber(realValue, { dropZ: !fillZero })}
    </React.Fragment>
  );
};

export default connect((state) => {
  const categories = state.categories;
  return {
    coinDict: categories,
  };
})(CoinPrecision);
