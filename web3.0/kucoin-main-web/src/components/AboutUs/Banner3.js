/**
 * Owner: mcqueen@kupotech.com
 */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { separateNumber } from 'helper';
import { isEqual } from 'lodash';
import { _t } from 'src/tools/i18n';
import AnimateNumber from 'components/common/AnimateNumber';
import LogoSM from 'static/about-us/logoSM.svg';
import LogoMD from 'static/about-us/logoMD.svg';
import LogoLG from 'static/about-us/logoLG.svg';
import EarthSM from 'static/about-us/earthSM.svg';
import EarthMD from 'static/about-us/earthMD.svg';
import EarthLG from 'static/about-us/earthLG.svg';
import LeftLineImg1 from 'static/about-us/banner3_line_left1.png';
import LeftLineImg2 from 'static/about-us/banner3_line_left2.png';
import RightLineImg1 from 'static/about-us/banner3_line_right1.png';
import RightLineImg2 from 'static/about-us/banner3_line_right2.png';
import { useLocale } from '@kucoin-base/i18n';
import keysEquality from 'tools/keysEquality';
import { useMediaQuery } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import { tenantConfig } from 'config/tenant';

import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';

const Wrapper = styled.div`
  overflow: hidden;
  min-height: ${px2rem(768)};
  background: rgba(1, 8, 30, 0.02) url(${LogoLG}) no-repeat left top;
  background-size: auto ${px2rem(547)};
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: ${px2rem(64)} 0;
    background: rgba(1, 8, 30, 0.02) url(${LogoMD}) no-repeat left top;
    background-size: auto ${px2rem(410)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-height: ${px2rem(500)};
    background: rgba(1, 8, 30, 0.02) url(${LogoSM}) no-repeat left top;
    background-size: auto ${px2rem(136)};
  }
`;

const LayoutBox = styled.div`
  width: 100%;
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(12)};
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: ${px2rem(1200)};
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  ${(props) => props.theme.breakpoints.down('lg')} {
    display: block;
  }
`;

const EarthBox = styled.div`
  img {
    display: block;
    margin: auto;
    ${(props) => props.theme.breakpoints.down('md')} {
      width: 100%;
    }
  }
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  text-align: center;
  font-size: ${px2rem(36)};
  line-height: ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(18)};
    line-height: ${px2rem(20)};
  }
`;

const Intro = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-weight: 400;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(40)};
  text-align: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(8)};
    line-height: ${px2rem(12)};
  }
`;

const Boxes = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Box = styled.div`
  width: calc(50% - ${px2rem(12)});
  ${(props) => props.theme.breakpoints.down('md')} {
    width: calc(50% - ${px2rem(6)});
  }
`;

const Left = styled.div`
  [dir='rtl'] & img {
    transform: rotateY(180deg);
  }
`;
const Top = styled.div`
  img {
    max-width: ${px2rem(261)};
  }
  [dir='rtl'] & img {
    transform: rotateY(180deg);
  }
`;

const Bottom = styled.div`
  img {
    max-width: ${px2rem(275)};
  }
  [dir='rtl'] & img {
    transform: rotateY(180deg);
  }
`;

const Right = styled.div`
  [dir='rtl'] & img {
    transform: rotateY(180deg);
  }
`;

const Banner3 = () => {
  const configItems = useSelector((state) => state.newhomepage.configItems, isEqual);
  const { summary } = useSelector((state) => state.newhomepage, keysEquality(['summary']));
  const { rates = {} } = useSelector((state) => state.currency, shallowEqual);
  const dispatch = useDispatch();
  const duration = 1000;

  useLocale();

  const volumes = useMemo(() => {
    return summary.TRADING_VOLUME * +rates['USD'];
  }, [summary.TRADING_VOLUME, rates]);

  const formatValue = (value) => separateNumber(value.toFixed(0));

  useEffect(() => {
    dispatch({ type: 'newhomepage/pullNewStatistics@polling' });
    return () => {
      dispatch({ type: 'newhomepage/pullNewStatistics@polling:cancel' });
    };
  }, [dispatch]);

  useResponsive();

  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  // 全球用户数（泰国站展示不变）
  const globalUser = useMemo(() => {
    if (tenantConfig.aboutUs.useDynamicData) {
      return configItems?.webHomepageData?.backupValues?.GlobalInvestors;
    }

    return _t('aboutus.users.value');
  }, [configItems]);

  // 上架币种（泰国站展示不变）
  const tokens = useMemo(() => {
    if (tenantConfig.aboutUs.useDynamicData) {
      return configItems?.webHomepageData?.backupValues?.Coins;
    }

    return '750+';
  }, [configItems?.webHomepageData?.backupValues?.Coins]);

  return (
    <Wrapper data-inspector="about_us_num">
      <LayoutBox>
        <Content>
          {lg ? (
            <>
              <Left className="wow fadeInLeft">
                <Top>
                  <Title>{_t('aboutus.top1.title')}</Title>
                  <Intro>{_t('aboutus.top1.value')}</Intro>
                  <img src={LeftLineImg1} alt="" />
                </Top>
                <Bottom>
                  <Title>
                    <AnimateNumber
                      index={0}
                      value={volumes}
                      formatValue={formatValue}
                      duration={duration}
                    />
                  </Title>
                  <Intro>{_t('dgEEQ2MXhbzGF2EAFt2S72')}</Intro>
                  <img src={LeftLineImg2} alt="" />
                </Bottom>
              </Left>
              <EarthBox className="wow fadeInUp">
                <img src={EarthLG} alt="" />
              </EarthBox>
              <Right className="wow fadeInRight">
                <Top>
                  <Title>{globalUser}</Title>
                  <Intro>{_t('aboutus.users.title')}</Intro>
                  <img src={RightLineImg1} alt="" />
                </Top>
                <Bottom>
                  <Title>{tokens}</Title>
                  <Intro>{_t('vRX1D8bfQi4U5CxPCEdzG3')}</Intro>
                  <img src={RightLineImg2} alt="" />
                </Bottom>
              </Right>
            </>
          ) : (
            <>
              <EarthBox>
                <img src={sm ? EarthSM : EarthMD} alt="" />
              </EarthBox>
              <Boxes style={{ marginTop: px2rem(24) }}>
                <Box>
                  <Title>{_t('aboutus.top1.title')}</Title>
                  <Intro>{_t('aboutus.top1.value')}</Intro>
                </Box>
                <Box>
                  <Title>{_t('aboutus.users.value')}</Title>
                  <Intro>{_t('aboutus.users.title')}</Intro>
                </Box>
              </Boxes>
              <Boxes style={{ marginTop: px2rem(48) }}>
                <Box>
                  <Title>
                    <AnimateNumber
                      index={0}
                      value={volumes}
                      formatValue={formatValue}
                      duration={duration}
                    />
                  </Title>
                  <Intro>{_t('dgEEQ2MXhbzGF2EAFt2S72')}</Intro>
                </Box>
                <Box>
                  <Title>{tokens}</Title>
                  <Intro>{_t('vRX1D8bfQi4U5CxPCEdzG3')}</Intro>
                </Box>
              </Boxes>
            </>
          )}
        </Content>
      </LayoutBox>
    </Wrapper>
  );
};

export default Banner3;
