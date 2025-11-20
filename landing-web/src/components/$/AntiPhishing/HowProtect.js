/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { NumberIndex } from 'components/$/AntiPhishing/CommonAttacks';
import { APP_HOST } from 'config';
import moreIcon from 'assets/antiPhishing/more.svg';
import { px2rem } from '@kufox/mui/utils';
import JsBridge from 'utils/jsBridge';

const HowProtectWrapper = styled.div`
  margin-bottom: ${px2rem(36)};
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(14)};
`;
const NormalText = styled.p`
  font-weight: 300;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 0;
`;
const List = styled.div``;
const Item = styled.div`
  margin-top: ${px2rem(12)};
  background: ${({ theme }) => theme.colors.cover2};
  padding: ${px2rem(12)} ${px2rem(8)};
  border-radius: ${px2rem(6)};
`;
const ItemTitle = styled.h4`
  font-weight: 500;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(4)};
  display: flex;
  align-items: center;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
`;

const LearnMoreButton = styled.a`
  font-weight: 500;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(20)};
  color: ${({ theme }) => theme.colors.primary};
  border: ${px2rem(1)} solid ${({ theme }) => theme.colors.cover20};
  border-radius: ${px2rem(4)};
  padding: ${px2rem(3)} ${px2rem(7)};
  margin: ${px2rem(12)} auto 0;
  display: inline-flex;
  align-items: center;

  img {
    width: ${px2rem(12)};
    height: ${px2rem(12)};
    margin-left: ${px2rem(4)};
  }
`;

const HowProtect = ({ isInApp }) => {
  const handleJump = e => {
    if (isInApp) {
      e.preventDefault();
      const href = e.currentTarget.href;
      JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeURIComponent(href)}` } });
    }
  };
  return (
    <HowProtectWrapper>
      <Title>How Does {window._BRAND_NAME_} Protect Users From Phishing Attacks?</Title>
      <NormalText>
        The following are some of the best-protected security features available to all our users.
      </NormalText>
      <List>
        <Item>
          <ItemTitle>
            <NumberIndex>01</NumberIndex>
            Official Media Verification
          </ItemTitle>
          <NormalText>
            To prevent fraud in the name of {window._BRAND_NAME_}, users can confirm an official {window._BRAND_NAME_} contact or
            domain from this channel to verify the telephone number, Email, WeChat, Telegram, Skype,
            Twitter, or website address...
          </NormalText>
        </Item>
        <Item>
          <ItemTitle>
            <NumberIndex>02</NumberIndex>Restrict login IP
          </ItemTitle>
          <NormalText>
            After enabling it, the account protection mechanism will be triggered when login IP
            changes to automatically log out accounts to avoid any hacking cases.
          </NormalText>
        </Item>
        <Item>
          <ItemTitle>
            <NumberIndex>03</NumberIndex>Anti-phishing Safety Phrase
          </ItemTitle>
          <NormalText>
            A phrase to prove the authenticity of {window._BRAND_NAME_} site/APP, Emails/SMS. Any words can be set
            freely, and if it is not shown or incorrect in the sign-up page or {window._BRAND_NAME_} Emails/SMS, it
            means that you are on a phishing site or have received a phishing email.
          </NormalText>
        </Item>
      </List>
      <ButtonBox>
        <LearnMoreButton
          href={`${APP_HOST}/support/360015207473-KuCoin-Security-Notice`}
          rel="noopener noreferrer"
          onClick={handleJump}
        >
          Learn More
          <img src={moreIcon} alt="" />
        </LearnMoreButton>
      </ButtonBox>
    </HowProtectWrapper>
  );
};

export default HowProtect;
