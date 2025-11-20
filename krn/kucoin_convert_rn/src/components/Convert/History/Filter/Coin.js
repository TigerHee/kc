/**
 * Owner: willen@kupotech.com
 */
import CoinSelector from 'components/Convert/Common/CoinSelector';
import CoinWrapper from './NormalWrapper';
import styled from '@emotion/native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Title from './NormalText';
import useLang from 'hooks/useLang';
import {useSelector} from 'react-redux';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
`;

const ItemWrapper = styled.View`
  flex: 50%;
  margin-right: ${({index}) => (index === 0 ? '16px' : '0px')};
`;
export default ({fromCoin, toCoin, onPress, tab}) => {
  const navigation = useNavigation();
  const {_t} = useLang();
  const historyOrderType = useSelector(state => state.order.historyOrderType);

  const coinMap = [
    {title: _t('f1fUs5np2HnVWsgQPhB9LC'), coin: fromCoin, direction: 'from'},
    {title: _t('1izXduRcCW4CqMQTDi3Nry'), coin: toCoin, direction: 'to'},
  ];

  const handlePress = item => {
    navigation.navigate('ConvertCoinListPage', {
      direction: item.direction,
      coinSelected: item.coin,
      type: 'history',
      backRoute: 'ConvertHistoryPage',
      showFilter: true,
      orderType: historyOrderType,
      tab,
    });
    typeof onPress === 'function' && onPress();
  };

  return (
    <Wrapper>
      {coinMap.map((item, index) => {
        return (
          <ItemWrapper key={item.coin || index} index={index}>
            <Title text={item.title} />
            <CoinWrapper
              showBorder={false}
              onPress={() => {
                handlePress(item);
              }}>
              <CoinSelector
                coin={item.coin}
                onPress={() => {
                  handlePress(item);
                }}
                type="filter"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </CoinWrapper>
          </ItemWrapper>
        );
      })}
    </Wrapper>
  );
};
