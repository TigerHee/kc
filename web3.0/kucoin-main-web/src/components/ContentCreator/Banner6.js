/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';
import ImgSrc1 from 'static/content-creator/creator-bonus.svg';
import ImgSrc2 from 'static/content-creator/get-featured.svg';
import ImgSrc3 from 'static/content-creator/contributor.svg';

const Wrapper = styled(Box)`
  padding: ${px2rem(80)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: ${px2rem(60)} ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} ${px2rem(12)};
  }
`;

const Content = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
`;

const Title = styled.h2`
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

const FlexWrapper = styled(Box)`
  margin-top: ${px2rem(60)};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: ${px2rem(12)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(28)};
  }
`;

const FlexItem = styled(Box)`
  width: 30%;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 45%;
    margin-top: ${px2rem(44)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
    margin-top: ${px2rem(20)};
  }
`;

const Image = styled.img`
  width: ${px2rem(64)};
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: ${px2rem(48)};
  }
`;

const TextHeader = styled.h3`
  font-size: ${px2rem(20)};
  line-height: ${px2rem(32)};
  color: #00142a;
  margin: ${px2rem(28)} 0 ${px2rem(12)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(16)} 0 ${px2rem(12)} 0;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(24)};
  }
`;

const TextContent = styled.p`
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  color: rgba(0, 20, 42, 0.6);
  margin: 0 0 0 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
  }
`;

const Banner6 = () => {
  return (
    <Wrapper>
      <Content>
        <Title>{_t('creator.sixth.title')}</Title>
        <FlexWrapper>
          <FlexItem>
            <Image src={ImgSrc1} alt="creator-bonus" />
            <TextHeader>{_t('creator.sixth.item1.title')}</TextHeader>
            <TextContent>{_t('creator.sixth.item1.sub1')}</TextContent>
            <TextContent>{_t('creator.sixth.item1.sub2')}</TextContent>
          </FlexItem>
          <FlexItem>
            <Image src={ImgSrc2} alt="get-featured" />
            <TextHeader>{_t('creator.sixth.item2.title')}</TextHeader>
            <TextContent>{_t('creator.sixth.item2.sub')}</TextContent>
          </FlexItem>
          <FlexItem>
            <Image src={ImgSrc3} alt="contributor" />
            <TextHeader>{_t('creator.sixth.item3.title')}</TextHeader>
            <TextContent>{_t('creator.sixth.item3.sub')}</TextContent>
          </FlexItem>
        </FlexWrapper>
      </Content>
    </Wrapper>
  );
};

export default Banner6;
