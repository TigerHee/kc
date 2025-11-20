/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import checkIcon from 'assets/recall/check.svg';
import { px2rem } from '@kufox/mui/utils';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const Inner = styled.div`
  border-radius: ${px2rem(99)};
  background: ${({ type, theme }) =>
    type === 'success' ? theme.colors.primary : theme.colors.secondary};
  font-size: ${px2rem(12)};
  color: ${({ theme }) => theme.colors.textEmphasis};
  padding: ${px2rem(1)} ${px2rem(10)} ${px2rem(2)};
  display: flex;
  align-items: center;
`;
const CheckIcon = styled.img`
  margin-right: ${px2rem(5)};
`;
const Text = styled.span``;

const TipsBar = ({ type, text, className, onClick }) => {
  return (
    <Wrapper className={className} onClick={onClick}>
      <Inner type={type}>
        {type === 'success' ? <CheckIcon src={checkIcon} /> : null}
        <Text>{text}</Text>
      </Inner>
    </Wrapper>
  );
};

export default TipsBar;
