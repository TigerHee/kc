/**
 * Owner: roger@kupotech.com
 */
import round from 'lodash/round';
import React from 'react';
import { useTheme, styled } from '@kux/mui';
import { toPercent } from '@utils/math';

import { formatLangNumber } from '../../common/tools';

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
`;
const PriceWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  text-align: right;
`;

const RateWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.color};
  text-align: right;
`;

// value 为涨跌幅度，前端处理为百分比，price 为价格
const PriceRate = ({ value, price, lang }) => {
  const theme = useTheme();
  const { colors } = theme;

  if (typeof value !== 'number') {
    value = +value;
  }
  let color = colors.text40;
  let prefix = '';
  if (value > 0) {
    color = '#01BC8D';
    prefix = '+';
  } else if (value < 0) {
    color = colors.secondary;
  }

  // 价格有可能为-1，认为是--
  const priceNumber = price && Number(price) >= 0 ? formatLangNumber(price, lang) : '--';
  return (
    <Wrapper>
      <PriceWrapper>{priceNumber}</PriceWrapper>
      <RateWrapper color={color}>
        {prefix}
        {toPercent(round(value, 4), lang)}
      </RateWrapper>
    </Wrapper>
  );
};

PriceRate.defaultProps = {
  value: 0,
  className: '',
  type: 'normal',
};

export default PriceRate;
