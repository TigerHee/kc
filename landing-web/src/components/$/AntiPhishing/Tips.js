/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import tipsImg from 'assets/antiPhishing/tips.svg';
import tips1 from 'assets/antiPhishing/tips_1.svg';
import tips2 from 'assets/antiPhishing/tips_2.svg';
import tips3 from 'assets/antiPhishing/tips_3.svg';
import tips4 from 'assets/antiPhishing/tips_4.svg';
import tips5 from 'assets/antiPhishing/tips_5.svg';
import tips6 from 'assets/antiPhishing/tips_6.svg';
import tips7 from 'assets/antiPhishing/tips_7.svg';
import tips8 from 'assets/antiPhishing/tips_8.svg';
import { px2rem } from '@kufox/mui/utils';

const TipsWrapper = styled.div`
  box-shadow: 0 ${px2rem(4)} ${px2rem(24)} rgba(0, 57, 75, 0.1);
  margin-bottom: ${px2rem(38)};
  border-radius: 0 0 ${px2rem(12)} ${px2rem(12)};
`;
const Title = styled.div`
  height: ${px2rem(50)};
  display: flex;
  align-items: center;
  border-radius: ${px2rem(12)} ${px2rem(12)} 0 0;
  padding: 0 ${px2rem(12)};
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  background-image: url(${tipsImg});
  background-color: #3ce1aa;
  background-size: ${px2rem(152)} ${px2rem(50)};
  background-repeat: no-repeat;
  background-position: right;
`;

const List = styled.div`
  padding: ${px2rem(16)} ${px2rem(12)} ${px2rem(18)};
`;
const Item = styled.div`
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: ${px2rem(6)};
  margin-bottom: ${px2rem(6)};
  padding: ${px2rem(12)} ${px2rem(8)};
  display: flex;
  align-items: center;
`;

const Icon = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  margin-right: ${px2rem(4)};
`;

const Text = styled.span`
  font-weight: 500;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text};
`;

const datas = [
  { icon: tips1, text: `Bookmark the ${window._BRAND_NAME_} Official Site` },
  { icon: tips2, text: 'Don‘t click any unknown or illegal URL' },
  { icon: tips3, text: 'Create strong passwords' },
  { icon: tips4, text: 'Enable Google 2FA' },
  { icon: tips5, text: 'Question everything' },
  { icon: tips6, text: "Don't provide your code and login details" },
  { icon: tips7, text: 'Don’t send any assets to strangers' },
  { icon: tips8, text: 'Install good antivirus software on your device' },
];

const Tips = () => {
  return (
    <TipsWrapper>
      <Title>Anti-Phishing Tips</Title>
      <List>
        {datas.map(({ icon, text }, index) => (
          <Item key={index}>
            <Icon src={icon} />
            <Text>{text}</Text>
          </Item>
        ))}
      </List>
    </TipsWrapper>
  );
};

export default Tips;
