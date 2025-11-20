/*
 * owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled, ThemeProvider, useResponsive } from '@kux/mui';
import React from 'react';
import { _t, _tHTML } from 'src/tools/i18n';
import bannerLeftBgH5 from 'static/slothub/index-banner-left-h5.svg';
import bannerLeftBg from 'static/slothub/index-banner-left-web.svg';
import bannerRightBgH5 from 'static/slothub/index-banner-right-h5.svg';
import bannerRightBg from 'static/slothub/index-banner-right-web.svg';
import ButtonGroup from '../../components/ButtonGroup';

const Container = styled.section`
  width: auto;
  background-color: #121212;
  overflow: hidden;
`;
const Content = styled.div`
  margin: 0 24px;
  padding: 60px 0 120px;
  position: relative;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    max-width: 1200px;
    margin: 0 auto;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin: 0 16px;
    padding: 108px 0 54px;
  }
`;
const MainBox = styled.div`
  padding-right: 300px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding-right: 160px;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    position: relative;
  }
`;
const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 0;
  color: ${(props) => props.theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-weight: 600;
    font-size: 28px;
  }
`;
const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 130%;
  margin-top: 8px;
  color: ${(props) => props.theme.colors.text40};
  .highlight {
    color: #d3f475;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 4px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 14px;
  }
`;
const LeftBg = styled.img`
  position: absolute;
  left: -172px;
  top: 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    left: -16px;
  }
`;
const RightBg = styled.img`
  position: absolute;
  right: 0;
  top: 50%;
  ${(props) =>
    props.isRTL
      ? `
    transform: scaleX(-1);
  `
      : ''}
  ${({ theme }) => theme.breakpoints.down('lg')} {
    right: -70px;
  }
  ${({ theme }) => theme.breakpoints.up('sm')} {
    transform: ${(props) => (props.isRTL ? 'scaleX(-1) translateY(-50%)' : 'translateY(-50%)')};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    top: 100px;
    right: -16px;
  }
`;

const Banner = () => {
  const { isRTL } = useLocale();
  const { sm } = useResponsive();

  return (
    <ThemeProvider theme="dark">
      <Container data-inspector="gemslothub_banner">
        <Content>
          <LeftBg
            alt="background image in banner"
            className="horizontal-flip-in-arabic"
            src={sm ? bannerLeftBg : bannerLeftBgH5}
          />
          <MainBox>
            <Title>{_t('615b6f53080e4000a487')}</Title>
            <SubTitle>{_tHTML('6eb3c25faa494000a60d')}</SubTitle>
            <ButtonGroup style={{ marginTop: 40 }} />
            <RightBg
              isRTL={isRTL}
              alt="background image in banner"
              src={sm ? bannerRightBg : bannerRightBgH5}
            />
          </MainBox>
        </Content>
      </Container>
    </ThemeProvider>
  );
};

export default React.memo(Banner);
