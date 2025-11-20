/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import styled from '@emotion/native';
import {useNavigation} from '@react-navigation/native';
import useLang from 'hooks/useLang';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import Status from './Status';

const Wrapper = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-style: solid;
  border-bottom-color: ${props => props.theme.colorV2.divider8};
  /* padding: 14px 0px 15px 0; */
  height: 72px;
  justify-content: center;
`;

const Time = styled.Text`
  font-size: 12px;
  line-height: 15.6px;
  color: ${props => props.theme.colorV2.text40};
  font-weight: 400;
`;
const ConvertCoinWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ItemWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &:last-of-type {
    margin-top: 6px;
  }
`;
const ConvertCoin = styled.Text`
  font-weight: 500;
  font-size: 16px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20.8px')};
  color: ${props => props.theme.colorV2.text};
`;
const ConvertCoinNum = styled.Text`
  font-weight: 500;
  font-size: 16px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20.8px')};
  color: ${props => props.theme.colorV2.text};
  margin-right: 2px;
`;

const Item = ({size, currency}) => {
  const {numberFormat} = useLang();

  return (
    <ConvertCoinWrapper>
      <ConvertCoinNum>{numberFormat(size)}</ConvertCoinNum>
      <ConvertCoin>
        {currency ? <CoinCodeToName coin={currency} /> : '--'}
      </ConvertCoin>
    </ConvertCoinWrapper>
  );
};
export default ({info, type}) => {
  const navigation = useNavigation();
  const {dateTimeFormat} = useLang();
  const isLimit = type === 'limit';

  const onPress = (_info, _isLimit) => {
    const params = _isLimit
      ? {..._info, isLimit: _isLimit}
      : {tickerId: _info.tickerId, isLimit: _isLimit};
    navigation.navigate('ConvertHistoryDetailPage', params);
  };

  const fromData = {
    size: isLimit ? info.fromSize : info.fromCurrencySize,
    currency: info.fromCurrency,
  };
  const toData = {
    size: isLimit ? info.toSize : info.toCurrencySize,
    currency: info.toCurrency,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(info, isLimit)}>
      <Wrapper>
        <ItemWrapper>
          <Item size={fromData.size} currency={fromData.currency} />
          <Item size={toData.size} currency={toData.currency} />
        </ItemWrapper>
        <ItemWrapper>
          <Time>
            {dateTimeFormat(info[isLimit ? 'tradedAt' : 'createdAt'])}
          </Time>
          <Status status={info.status} isLimit={isLimit} />
        </ItemWrapper>
      </Wrapper>
    </TouchableOpacity>
  );
};
