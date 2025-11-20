/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import common_attacks from 'assets/antiPhishing/common_attacks.svg';
import { px2rem } from '@kufox/mui/utils';

const CommonAttacksWrapper = styled.div`
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
  background-image: url(${common_attacks});
  background-color: #3ce1aa;
  background-size: ${px2rem(94)} ${px2rem(50)};
  background-repeat: no-repeat;
  background-position: right;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${px2rem(16)} ${px2rem(12)} ${px2rem(18)};
`;
const Item = styled.div`
  width: calc(50% - ${px2rem(3)});
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: ${px2rem(6)};
  margin-bottom: ${px2rem(6)};
  padding: ${px2rem(12)} ${px2rem(8)};
  display: flex;
  align-items: center;
`;

export const NumberIndex = styled.span`
  font-style: italic;
  font-weight: 900;
  font-size: ${px2rem(16)};
  line-height: 150%;
  background: linear-gradient(180deg, #3ce1aa 20.24%, rgba(60, 225, 170, 0) 79.76%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: ${px2rem(4)};
`;

const Text = styled.span`
  font-weight: 500;
  font-size: ${px2rem(14)};
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text};
`;

const datas = [
  'Email spoofing',
  'Fake websites',
  'Fake links',
  'SMS phishing attack',
  'Fake support & admin team',
  'Wi-Fi phishing attacks',
];

const CommonAttacks = () => {
  return (
    <CommonAttacksWrapper>
      <Title>6 Common Phishing Attacks</Title>
      <List>
        {datas.map((text, index) => (
          <Item key={index}>
            <NumberIndex>0{index + 1}</NumberIndex>
            <Text>{text}</Text>
          </Item>
        ))}
      </List>
    </CommonAttacksWrapper>
  );
};

export default CommonAttacks;
