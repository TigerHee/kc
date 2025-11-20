/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';

const LineView = styled.View`
  height: 60px;
  justify-content: center;
  margin-bottom: 20px;
`;
const LineText = styled.Text`
  font-size: 12px;
  color: ${({theme}) => theme.colorV2.text40};
  text-align: center;
`;

const BottomTip = ({style, text}) => {
  return (
    <LineView style={style}>
      <LineText>{text}</LineText>
    </LineView>
  );
};

export default BottomTip;
