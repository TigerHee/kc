/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled, useEventCallback, useResponsive } from '@kux/mui';
import CoinIcon from '../CoinIcon';
import CoinCurrency from '../CoinCurrency';
import CoinPrecision from '../CoinPrecision';
import CoinTag from './common/CoinTag';
import HighLight from './common/HighLight';
import usePropsSelector from './usePropsSelector';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 32px;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
  }
  ${({ theme, isActive }) => {
    if (isActive) {
      return `background: ${theme.colors.cover2};`;
    }
    return '';
  }}
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 9px 24px;
  }
`;
const StyledCoinIcon = styled(CoinIcon)`
  margin-right: 12px;
`;
const StyledCoinTag = styled(CoinTag)`
  margin-left: 4px;
`;
const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;
const CurrencyName = styled(HighLight)`
  font-size: 16px;
  line-height: 1.4;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const Name = styled(HighLight)`
  font-size: 12px;
  font-weight: 400;
  line-height: 140%;
`;
const Text = styled.div`
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const PriceWrapper = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
`;

const PriceCoinCurrency = styled(CoinCurrency)`
  line-height: 1.4;
`;

const SearchItem = ({ data, style }) => {
  const { sm } = useResponsive();
  const value = usePropsSelector((props) => props.value);
  const onChange = usePropsSelector((props) => props.onChange);
  const amountKey = usePropsSelector((props) => props.amountKey);

  const { currency } = data;
  const amount = data[amountKey] || 0;

  const handleClick = useEventCallback((e) => {
    e.stopPropagation();
    if (onChange) onChange(currency);
  });

  return (
    <Container
      data-inspector={`convert_coin_list_search_item_${currency}`}
      onClick={handleClick}
      isActive={currency === value}
      style={{ overflow: 'hidden', ...style }}
    >
      <FlexBox>
        <StyledCoinIcon coin={currency} size={sm ? 28 : 24} icon={data.icon} />
        <div>
          <FlexBox>
            <CurrencyName data={data} field="currencyName" search={data._matchSearch} />
            <StyledCoinTag record={data} />
          </FlexBox>
          <Name data={data} field="name" search={data._matchSearch} />
        </div>
      </FlexBox>
      {Boolean(amountKey && !Number.isNaN(+amount)) && (
        <PriceWrapper>
          <Text>
            <CoinPrecision coin={currency} value={amount} />
          </Text>
          <PriceCoinCurrency coin={currency} value={amount} />
        </PriceWrapper>
      )}
    </Container>
  );
};

export default React.memo(SearchItem);
