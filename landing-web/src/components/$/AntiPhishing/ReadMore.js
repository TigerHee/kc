/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { APP_HOST } from 'config';
import readMore from 'assets/antiPhishing/read_more.svg';
import { px2rem } from '@kufox/mui/utils';
import JsBridge from 'utils/jsBridge';

const ReadMoreWrapper = styled.div`
  margin-bottom: ${px2rem(20)};
`;

const Title = styled.div`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: 130%;
  margin-bottom: ${px2rem(14)};
`;

const List = styled.div``;
const Item = styled.a`
  padding: ${px2rem(12)} 0;
  display: flex;
  align-items: baseline;
  & + a {
    border-top: ${px2rem(1)} solid ${({ theme }) => theme.colors.cover8};
  }
`;

const Text = styled.span`
  font-weight: 300;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const JumpIcon = styled.img`
  width: ${px2rem(16)};
  height: ${px2rem(16)};
  margin-left: ${px2rem(12)};
`;

const datas = [
  {
    link:
      `${APP_HOST}/blog/phishing-attacks-how-to-recognize-them-and-avoid-crypto-scams`,
    text: 'Phishing Attacks: How to Recognize Them and Avoid Crypto Scams?',
  },
  {
    link: `${APP_HOST}/blog/everything-you-need-to-know-about-account-security-on-kucoin`,
    text: `Everything You Need to Know About Account Security on ${window._BRAND_NAME_}`,
  },
  {
    link:
      `${APP_HOST}/blog/5-general-security-considerations-every-crypto-investor-should-know`,
    text: '5 General Security Considerations Every Crypto Investor Should Know',
  },
  {
    link: `${APP_HOST}/support/360015207473-KuCoin-Security-Notice`,
    text: `${window._BRAND_NAME_} Security Notice`,
  },
  {
    link: 'https://www.youtube.com/watch?v=qjxmjqz_2LY',
    text: `Top Anti-phishing Security Tips You Should Know on ${window._BRAND_NAME_}`,
  },
  {
    link: 'https://www.youtube.com/watch?v=N_rrmHD8gF8&t=61s',
    text: 'Top Tips on How to Avoid Crypto Scams',
  },
];

const ReadMore = ({ isInApp }) => {
  const handleJump = e => {
    if (isInApp) {
      e.preventDefault();
      const href = e.currentTarget.href;
      JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeURIComponent(href)}` } });
    }
  };
  return (
    <ReadMoreWrapper>
      <Title>Read More</Title>
      <List>
        {datas.map(({ link, text }, index) => (
          <Item key={index} href={link} rel="noopener noreferrer" onClick={handleJump}>
            <Text>{text}</Text>
            <JumpIcon src={readMore} />
          </Item>
        ))}
      </List>
    </ReadMoreWrapper>
  );
};

export default ReadMore;
