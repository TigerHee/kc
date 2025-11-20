/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {TouchableWithoutFeedback} from 'react-native';
import CoinIcon from 'components/Common/CoinIcon';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import arrowImg from 'assets/convert/arrow_down.png';

const CoinView = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${({theme}) => theme.colorV2.overlay};
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colorV2.cover8};
  border-style: solid;
  padding: 6px;
  border-radius: 100px;
`;

const Arrow = styled.Image`
  width: 16px;
  height: 16px;
`;

const CoinName = styled.Text`
  font-weight: 600;
  font-size: ${({isFillter}) => (isFillter ? '12px' : '16px')};
  margin: 0 2px 0 4px;
  color: ${({theme, hasCoin}) => theme.colorV2[hasCoin ? 'text' : 'text60']};
`;

export default ({coin, onPress, type = 'select', ...restProps}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <CoinView {...restProps}>
        {coin ? <CoinIcon coin={coin} size={20} /> : null}
        <CoinName hasCoin={coin} isFillter={type === 'filter'}>
          {coin ? <CoinCodeToName coin={coin} maxLength={10} /> : '--'}
        </CoinName>
        <Arrow source={arrowImg} />
      </CoinView>
    </TouchableWithoutFeedback>
  );
};
