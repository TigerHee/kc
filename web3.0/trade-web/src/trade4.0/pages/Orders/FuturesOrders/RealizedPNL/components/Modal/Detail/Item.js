/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';

import { styled } from '@/style/emotion';

export const ItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  .pretty-size {
    font-weight: 500;
    font-size: inherit;
  }
`;

const TitleLabel = styled.div`
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`;

const AmountLabel = styled.div`
  font-size: ${(props) => (props.showColor ? '20px' : '14px')};
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => {
    const isShowColor = props.showColor;
    if (!isShowColor) {
      return props.theme.colors.text;
    }
    // eslint-disable-next-line eqeqeq
    if (props.value == 0) {
      return props.theme.colors.text60;
    }
    return props.value > 0 ? props.theme.colors.primary : props.theme.colors.secondary;
  }};
`;

const CoinCurrencyLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  .coin-color {
    color: ${(props) => props.theme.colors.text40};
  }
`;

const Item = ({ title, amount, coin, showColor, value }) => {
  return (
    <ItemBox className="item-box">
      {title ? <TitleLabel>{title}</TitleLabel> : null}
      <AmountLabel showColor={showColor} value={value}>
        {amount}
      </AmountLabel>
      {coin ? <CoinCurrencyLabel>{coin}</CoinCurrencyLabel> : null}
    </ItemBox>
  );
};

export default React.memo(Item);
