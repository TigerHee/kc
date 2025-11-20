/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'src/tools/i18n';
import Img1 from 'static/about-us/banner2_1.png';
import Img2 from 'static/about-us/banner2_2.png';
import Img3 from 'static/about-us/banner2_3.png';
import Img4 from 'static/about-us/banner2_4.png';
import { useLocale } from '@kucoin-base/i18n';
import { useMediaQuery } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';

import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    min-height: 0;
    padding: 0 ${px2rem(12)};
  }
`;

const Content = styled.div`
  max-width: ${px2rem(1200)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding: ${px2rem(80)} 0;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  width: ${px2rem(400)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(50% - 12px);
  }
`;
const LeftTop = styled.div`
  display: flex;
  justify-content: space-between;
`;
const LeftBottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Right = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  max-width: ${px2rem(660)};
  margin-left: ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(50% - 12px);
    max-width: 100%;
    margin-left: 0;
  }
`;
const Image = styled.img`
  display: block;
  width: ${px2rem(180)};
  height: ${px2rem(218)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(50% - 12px);
    height: auto;
  }
  &:nth-of-type(2n + 1) {
    margin-top: ${px2rem(40)};
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-top: ${px2rem(24)};
    }
  }
  &:nth-of-type(2n + 2) {
    margin-bottom: ${px2rem(40)};
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-bottom: ${px2rem(24)};
    }
  }
`;

const Banner2RightTitle = styled.div`
  color: #000000;
  font-weight: 500;
  width: 100%;
  font-size: ${px2rem(38)};
  line-height: ${px2rem(40)};
  position: relative;
  &::before {
    position: absolute;
    bottom: ${px2rem(-8)};
    display: block;
    width: ${px2rem(30)};
    height: ${px2rem(3)};
    background: #24ae8f;
    content: ' ';
  }
`;

const Banner2RightIntro = styled.div`
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(28)};
  margin-top: ${px2rem(34)};
`;

const ContentH5 = styled.div`
  width: 100%;
  margin: auto;
  padding: ${px2rem(40)} 0;
`;

const TopWrapper = styled.div`
  margin: auto;
`;

const TitleH5 = styled.div`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: ${px2rem(18)};
  text-align: center;
  color: #000000;
  position: relative;
  &::before {
    position: absolute;
    bottom: ${px2rem(-8)};
    left: 50%;
    display: block;
    width: ${px2rem(30)};
    height: ${px2rem(3)};
    background: #24ae8f;
    transform: translate3d(-50%, 0, 0);
    content: ' ';
  }
`;

const IntroH5 = styled.div`
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(20)};
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  margin-top: ${px2rem(18)};
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: ${px2rem(12)};
  grid-row-gap: ${px2rem(12)};
  margin-top: ${px2rem(20)};
`;

const ImageH5 = styled.img`
  width: 100%;
`;

const Banner2 = () => {
  useLocale();
  useResponsive();
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <Wrapper data-inspector="about_us_story" className="wow fadeIn">
      {sm ? (
        <ContentH5>
          <TopWrapper>
            <TitleH5>{_t('aboutus.story')}</TitleH5>
            <IntroH5>{_t('aboutus.story.intro')}</IntroH5>
            <ImageWrapper>
              <ImageH5 src={Img1} />
              <ImageH5 src={Img2} />
              <ImageH5 src={Img3} />
              <ImageH5 src={Img4} />
            </ImageWrapper>
          </TopWrapper>
        </ContentH5>
      ) : (
        <Content>
          <Left>
            <LeftTop>
              <Image src={Img1} alt="" />
              <Image src={Img2} alt="" />
            </LeftTop>
            <LeftBottom>
              <Image src={Img3} alt="" />
              <Image src={Img4} alt="" />
            </LeftBottom>
          </Left>
          <Right>
            <Banner2RightTitle>{_t('aboutus.story')}</Banner2RightTitle>
            <Banner2RightIntro>{_t('aboutus.story.intro')}</Banner2RightIntro>
          </Right>
        </Content>
      )}
    </Wrapper>
  );
};

export default Banner2;
