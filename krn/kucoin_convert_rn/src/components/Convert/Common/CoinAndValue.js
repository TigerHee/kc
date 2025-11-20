/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import useLang from 'hooks/useLang';
import {Platform} from 'react-native';

const Right = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Value = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const LabelText = styled.Text`
  font-size: 13px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '17px')};
  color: ${({theme}) => theme.colorV2.text40};
`;

export default ({
  coin,
  number,
  value,
  char = '$',
  text1Style,
  text2Style,
  ...restProps
}) => {
  const {numberFormat} = useLang();
  return (
    <Right {...restProps}>
      <LabelText style={text1Style}>
        {numberFormat(number)} {coin && <CoinCodeToName coin={coin} />}
      </LabelText>
      {number === '--' ? null : (
        <Value>
          <LabelText style={text2Style}>≈ </LabelText>
          <LabelText style={text2Style}>
            {char}
            {numberFormat(value)}
          </LabelText>
        </Value>
      )}
    </Right>
  );
};
