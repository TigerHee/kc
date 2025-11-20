/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';

const Wrapper = styled.Pressable`
  background: ${({theme}) => theme.colorV2.overlay};
  border-radius: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-width: ${({showBorder = true}) => (showBorder ? '0.5px' : '0px')};
  border-style: solid;
  border-color: ${({theme, selected}) =>
    theme.colorV2[selected ? 'text' : 'divider8']};
`;

export default ({children, selected, onPress, style, showBorder}) => {
  return (
    <Wrapper
      onPress={onPress}
      style={style}
      selected={selected}
      showBorder={showBorder}>
      {children}
    </Wrapper>
  );
};
