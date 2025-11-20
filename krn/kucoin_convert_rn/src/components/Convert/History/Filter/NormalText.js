/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';

const Title = styled.Text`
  font-size: 12px;
  font-weight: 400;
  line-height: 15.6px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-bottom: 8px;
`;

export default ({text, style, ...restProps}) => {
  return (
    <Title style={style} {...restProps}>
      {text}
    </Title>
  );
};
