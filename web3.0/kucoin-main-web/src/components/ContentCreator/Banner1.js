/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';
import ImgSrc from 'static/content-creator/creator-program.png';

const Wrapper = styled(Box)`
  background: rgba(0, 20, 42, 0.04);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} ${px2rem(12)} 0 ${px2rem(12)};
  }
`;

const Content = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    width: 100%;
  }
`;

const Text = styled.div`
  width: 51%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 58%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const TextHeader = styled.h1`
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #00142a;
  margin: 0 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
  }
`;

const TextContent = styled.p`
  font-size: ${px2rem(18)};
  line-height: ${px2rem(28)};
  color: rgba(0, 20, 42, 0.6);
  margin-top: ${px2rem(8)};
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(20)};
  }
`;

const Image = styled.img`
  width: 31%;
  transform: translateY(${px2rem(28)}) scale(1.1);
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 41%;
    transform: translateY(${px2rem(16)}) scale(0.9);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: ${px2rem(296)};
  }
`;

const Banner1 = () => {
  return (
    <Wrapper>
      <Content>
        <Text>
          <TextHeader>{_t('creator.first.title')}</TextHeader>
          <TextContent>{_t('creator.first.sub')}</TextContent>
        </Text>
        <Image src={ImgSrc} alt="creator-program" />
      </Content>
    </Wrapper>
  );
};

export default Banner1;
