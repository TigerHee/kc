/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import { PercentButtons } from 'src/trade4.0/pages/OrderForm/components/TradeForm/style';

/**
 * PercentButtonsPro
 */
const PercentButtonsPro = memo((props) => {
  const { ...restProps } = props;
  return <PercentButtons multis={['最小', 0.25, 0.5, 0.75, 1]} {...restProps} />;
});

export default PercentButtonsPro;
