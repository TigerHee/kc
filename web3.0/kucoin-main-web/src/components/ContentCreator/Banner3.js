/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { REWARDS_ITEMS } from './config';
import { styled } from '@kufox/mui';
import ImgSrc from 'static/content-creator/bitcoin-records.png';

const Wrapper = styled(Box)`
  position: relative;
  overflow: hidden;
  background: rgba(0, 20, 42, 0.04);
`;

const Content = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${px2rem(84)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 93.75%;
    padding: ${px2rem(80)} 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
    width: 93.6%;
    padding: ${px2rem(40)} 0 ${px2rem(162)};
  }
`;

const Text = styled(Box)`
  margin-top: ${px2rem(16)};
  width: 49%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 60%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
    margin-top: 0;
  }
`;

const TextHeader = styled.h2`
  margin: 0;
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #091133;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(38)};
  }
`;

const TextContent = styled.ul`
  margin-bottom: 0;
  margin-top: ${px2rem(20)};
  font-size: ${px2rem(18)};
  line-height: ${px2rem(30)};
  color: rgba(0, 20, 42, 0.6);
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(12)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
  }
`;

const TextContentItem = styled.li`
  position: relative;
  padding-left: ${px2rem(20)};
  &::before {
    position: absolute;
    top: ${px2rem(12)};
    left: 0;
    display: block;
    width: ${px2rem(4)};
    height: ${px2rem(4)};
    background: rgba(0, 20, 42, 0.4);
    border-radius: 50%;
    content: '';
  }
`;

const Image = styled.img`
  width: 32.5%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 39.4%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    position: absolute;
    bottom: ${px2rem(-64)};
    left: 50%;
    width: ${px2rem(284)};
    transform: translateX(-50%);
  }
`;

const Banner3 = () => {
  return (
    <Wrapper>
      <Content>
        <Text>
          <TextHeader>{_t('creator.third.title')}</TextHeader>
          <TextContent>
            {map(REWARDS_ITEMS, ({ text }, index) => (
              <TextContentItem key={index}>{text}</TextContentItem>
            ))}
          </TextContent>
        </Text>
        <Image src={ImgSrc} alt="bitcoin-rewards" />
      </Content>
    </Wrapper>
  );
};

export default Banner3;
