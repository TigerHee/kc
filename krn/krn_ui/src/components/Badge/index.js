/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import API from './API';
import registerAPI from 'utils/registerAPI';

const Wrapper = styled.View`
  background: ${({ theme }) => theme.colorV2.primary};
  padding: 0 6px;
  border-radius: 12px;
`;

const EmptyWrapper = styled.View`
  background: ${({ theme }) => theme.colorV2.primary};
  width: 8px;
  height: 8px;
  border-radius: 4px;
`;

const TextCont = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colorV2.primaryButtonText};
`;

const Badge = ({ text, overflowCount, style, textStyle, ...restProps }) => {
  text = typeof text === 'number' && text > overflowCount ? `${overflowCount}+` : text;

  const ContDom = text ? (
    <Wrapper style={style} {...restProps}>
      <TextCont style={textStyle}>{text}</TextCont>
    </Wrapper>
  ) : (
    <EmptyWrapper style={style} {...restProps} />
  );

  return ContDom;
};

registerAPI(Badge, API);
export default Badge;
