/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';

const Wrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  overflow: hidden;
`;
const Title = styled.Text`
  font-size: 12px;
  line-height: 20px;
  color: ${props => props.theme.colorV2.text40};
  flex: 1;
  margin-right: 8px;
`;

export default ({title, children, style}) => {
  return (
    <Wrapper style={style}>
      <Title numberOfLines={1} ellipsizeMode={'tail'}>
        {title}
      </Title>
      {children}
    </Wrapper>
  );
};
