/**
 * Owner: roger@kupotech.com
 */
import round from 'lodash/round';
import React from 'react';
import { useTheme, styled } from '@kux/mui';

import { toPercent } from '@utils/math';
import { formatLangNumber } from '../../../../common/tools';

const Wrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
`;
const PriceWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  margin-bottom: ${(props) => (props.inDrawer ? '0px' : '4px')};
`;

const RateWrapper = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.color};
`;
const H5Wrapper = styled.div`
  margin-top: 5px;
  font-weight: 500;
  font-size: 12px;
  display: flex;
  align-items: center;
`;

const PriceRate = ({ rate, price, inDrawer, lang }) => {
  const theme = useTheme();
  const { colors } = theme;

  if (typeof rate !== 'number') {
    rate = +rate;
  }
  let color = colors.text40;
  let prefix = '';
  if (rate > 0) {
    color = '#01BC8D';
    prefix = '+';
  } else if (rate < 0) {
    color = colors.secondary;
  }
  if (inDrawer) {
    return (
      <H5Wrapper>
        <PriceWrapper inDrawer>{price ? formatLangNumber(price, lang) : '--'}</PriceWrapper>
        <RateWrapper color={color}>
          {prefix}
          {toPercent(round(rate, 4), lang)}
        </RateWrapper>
      </H5Wrapper>
    );
  }

  return (
    <Wrapper>
      <PriceWrapper>{price ? formatLangNumber(price, lang) : '--'}</PriceWrapper>
      <RateWrapper color={color}>
        {prefix}
        {toPercent(round(rate, 4), lang)}
      </RateWrapper>
    </Wrapper>
  );
};

export default PriceRate;
