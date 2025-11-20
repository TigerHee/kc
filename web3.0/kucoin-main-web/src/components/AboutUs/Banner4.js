/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'src/tools/i18n';
import Img1 from 'static/about-us/banner4_1.png';
import Img2 from 'static/about-us/banner4_2.png';
import Img3 from 'static/about-us/banner4_3.png';
import { useLocale } from '@kucoin-base/i18n';
import { useMediaQuery, useResponsive, px2rem, styled } from '@kufox/mui';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 ${px2rem(12)};
  }
`;

const Content = styled.div`
  max-width: ${px2rem(1200)};
  width: 100%;
  margin: auto;
`;

const FlexBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    margin-bottom: ${px2rem(40)};
  }
`;

const Image = styled.img`
  width: calc(50% - 12px);
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const TextBoxs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: calc(50% - 12px);
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const Banner4 = () => {
  useLocale();
  useResponsive();
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <Wrapper data-inspector="about_us_info">
      <Content>
        <FlexBox>
          {sm ? (
            <>
              <Image className="wow fadeInRight" src={Img1} alt="" />
              <TextBoxs className="wow fadeInLeft">
                <div className="textTitle">{_t('aboutus.feature1')}</div>
                <div className="textContent">{_t('aboutus.feature1.intro')}</div>
              </TextBoxs>
            </>
          ) : (
            <>
              <TextBoxs className="wow fadeInLeft">
                <div className="textTitle">{_t('aboutus.feature1')}</div>
                <div className="textContent">{_t('aboutus.feature1.intro')}</div>
              </TextBoxs>
              <Image className="wow fadeInRight" src={Img1} alt="" />
            </>
          )}
        </FlexBox>
        <FlexBox>
          <Image className="wow fadeInLeft" src={Img2} alt="" />
          <TextBoxs className="wow fadeInRight">
            <div className="textTitle">{_t('aboutus.feature2')}</div>
            <div className="textContent">{_t('aboutus.feature2.intro')}</div>
          </TextBoxs>
        </FlexBox>
        <FlexBox>
          {sm ? (
            <>
              <Image className="wow fadeInRight" src={Img3} alt="" />
              <TextBoxs className="wow fadeInLeft">
                <div className="textTitle">{_t('aboutus.feature3')}</div>
                <div className="textContent">{_t('aboutus.feature3.intro')}</div>
              </TextBoxs>
            </>
          ) : (
            <>
              <TextBoxs className="wow fadeInLeft">
                <div className="textTitle">{_t('aboutus.feature3')}</div>
                <div className="textContent">{_t('aboutus.feature3.intro')}</div>
              </TextBoxs>
              <Image className="wow fadeInRight" src={Img3} alt="" />
            </>
          )}
        </FlexBox>
      </Content>
    </Wrapper>
  );
};

export default Banner4;
