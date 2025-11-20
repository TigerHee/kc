/**
 * Owner: borden@kupotech.com
 */
import React, { memo } from 'react';
import { isNaN } from 'lodash';
import { styled } from '@kux/mui';
import { multiply } from '@utils/math';
import { formatNumber, comparedTo } from '../../utils/format';
import useContextSelector from '../../hooks/common/useContextSelector';

export const Wrapper = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
`;

const CoinCurrency = (props) => {
  const { coin, value, className, showType = 1, ...restProps } = props;

  const prices = useContextSelector((state) => state.prices);
  const currency = useContextSelector((state) => state.currency);

  const rate = prices?.[coin];

  if (!rate || value === null || isNaN(+value)) {
    return null;
  }

  // fix: 法币价格小数位 大于1显示2位 小于1显示6位
  const currencyPrice = multiply(rate, value);
  const currencyDecimal = comparedTo(currencyPrice, 1) > 0 ? 2 : 6;
  let target = formatNumber(currencyPrice, { dp: currencyDecimal });
  if (+value === 0 || +target !== 0) {
    target = showType === 1 ? `≈ ${target}` : target;
  } else {
    // 法币目前不存在负数，暂时没有处理负数的情况
    target = `< ${formatNumber(currencyDecimal === 2 ? '0.01' : '0.000001', {
      dp: currencyDecimal,
    })}`;
  }

  return (
    <Wrapper className={className} {...restProps}>
      <span className="gbiz-coinCurrency-amount">{target}</span>
      {showType !== 3 && <span className="gbiz-coinCurrency-currency">&nbsp;{currency}</span>}
    </Wrapper>
  );
};

export default memo(CoinCurrency);
