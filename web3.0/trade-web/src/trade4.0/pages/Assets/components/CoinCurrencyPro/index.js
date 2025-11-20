/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { useSelector } from 'dva';
import CoinCurrency from '@/components/CoinCurrency';
import Mask, { Placeholder } from 'src/trade4.0/components/Mask';

/**
 * CoinCurrencyPro
 */
const CoinCurrencyPro = (props) => {
  const { ...restProps } = props;

  const showAssets = useSelector((state) => state.setting.showAssets);
  const isLogin = useSelector((state) => state.user.isLogin);

  if (!showAssets) return <Mask />;
  if (!isLogin) return <Placeholder />;
  return <CoinCurrency {...restProps} />;
};

export default memo(CoinCurrencyPro);
