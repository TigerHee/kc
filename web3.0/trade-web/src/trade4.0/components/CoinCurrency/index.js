/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useSelector } from 'dva';
import React, { memo } from 'react';
import { isNaN } from 'lodash';

import { multiplyAndFixed } from 'helper';
import { abs, greaterThan, lessThan } from 'utils/operation';
import { formatNumber } from '@/utils/format';
import styled from '@emotion/styled';

import { Placeholder } from '../Mask';
import { formatCurrency } from '@/utils/futures';

export const Wrapper = styled.div`
  font-weight: 500;
  font-size: 12px;
  /* line-height: 130%; */
  color: ${(props) => (props.empty ? props.theme.colors.text40 : props.theme.colors.text)};
`;

/**
 * CoinCurrency
 */
const CoinCurrency = (props) => {
  const {
    coin,
    value,
    showType = 1,
    defaultValue = <Placeholder />,
    className,
    amountClassName,
    currencyClassName,
    ...restProps
  } = props;

  const currency = useSelector((state) => state.currency.currency);
  const prices = useSelector((state) => state.currency.prices);

  const rate = prices[formatCurrency(coin)];
  // owen修改兜底逻辑为空，当命中if条件时返回null代替此前--空气泡展示（aaron du 交易输入框快捷操作逻辑优化及交易精度监控 07.25提出更改建议）
  if (!rate || value === null || isNaN(+value)) {
    // return <Wrapper {...restProps}>{defaultValue}</Wrapper>;
    return null;
  }

  // fix: 法币价格小数位 大于1显示2位 小于1显示6位
  const currencyPrice = multiplyAndFixed(rate, value);
  const currencyDecimal =
    lessThan(abs(currencyPrice))(0.01) && greaterThan(abs(currencyPrice))(0) ? 6 : 2;
  let target = formatNumber(currencyPrice, { fixed: currencyDecimal, dropZ: false });
  if (+value === 0 || +target !== 0) {
    target = showType === 1 ? `≈ ${target}` : target;
  } else {
    // 法币目前不存在负数，暂时没有处理负数的情况
    target = `< ${formatNumber(currencyDecimal === 2 ? '0.01' : '0.000001', {
      fixed: currencyDecimal,
    })}`;
  }

  return (
    <Wrapper className={className} {...restProps}>
      <span className={amountClassName}>{target}</span>
      {showType === 3 ? null : <span className={currencyClassName}>&nbsp;{currency}</span>}
    </Wrapper>
  );
};

export default memo(CoinCurrency);
