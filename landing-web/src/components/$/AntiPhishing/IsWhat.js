/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { px2rem } from '@kufox/mui/utils';

const IsWhatWrapper = styled.div`
  padding: ${px2rem(34)} ${px2rem(4)} 0;
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${px2rem(14)};
`;
const Content = styled.p`
  font-weight: 300;
  font-size: ${px2rem(14)};
  line-height: 150%;
  text-align: center;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${px2rem(36)};
`;

const IsWhat = ({ isInApp }) => {
  return (
    <IsWhatWrapper isInApp={isInApp}>
      <Title>What is a Phishing Attack?</Title>
      <Content>
        A phishing attack is a form of social engineering attack that aims to obtain sensitive
        information about your accounts, such as your private keys, username, passwords, and other
        details of your wallet.
      </Content>
    </IsWhatWrapper>
  );
};

export default IsWhat;
