/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import CoinInfo from './CoinInfo';
import useCoinInfo from './useCoinInfo';

const TokenInfoCommon = (props) => {
  const { symbol } = props;
  const coinInfoCommon = useCoinInfo(symbol);
  return <CoinInfo coinInfo={coinInfoCommon} />;
};

export default TokenInfoCommon;
