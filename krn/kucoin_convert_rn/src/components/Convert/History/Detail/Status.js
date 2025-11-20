/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import Status from '../Status';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const Tips = styled.Text`
  font-size: 12px;
  line-height: 20px;
  color: ${props => props.theme.colorV2.text60};
  margin-top: 8px;
  text-align: center;
`;
export default ({status, tips}) => {
  return (
    <Wrapper>
      <Status status={status} />
      {tips && status === 'CANCEL' ? <Tips>{tips}</Tips> : null}
    </Wrapper>
  );
};
