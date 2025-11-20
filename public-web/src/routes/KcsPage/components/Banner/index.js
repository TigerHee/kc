/**
 * Owner: chris@kupotech.com
 */
import { Button, ResizeObserver, styled } from '@kux/mui';
import LottieProvider from 'components/LottieProvider';
import { useState } from 'react';
import NoSSG from 'src/components/NoSSG';
import { _t, _tHTML } from 'src/tools/i18n';
import { ReactComponent as LgScopeBg } from 'static/kcs-intro/lg_bg.svg';
import { ReactComponent as MdScopeBg } from 'static/kcs-intro/md_bg.svg';
import { ReactComponent as ScopeBg } from 'static/kcs-intro/sm_bg.svg';
import { levelConfigMap } from '../../config';
import AssetsProportion from './AssetsProportion';
import H5Banner from './H5Banner';
import WebBanner from './WebBanner';

const Container = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0px 16px;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  background-color: ${({ theme, currentLevel }) =>
    levelConfigMap[currentLevel]?.overlayColor || '#000'};
  padding: 80px 0px;
  position: relative;
  overflow: hidden;
  .scopeBg {
    position: absolute;
    top: 0;
    z-index: 99;
    pointer-events: none;
    ${({ bgColor }) =>
      bgColor && {
        path: {
          'fill-opacity': '0.1',
        },
        stop: {
          transition: '0.3s',
          'stop-color': bgColor,
        },
      }}
  }

  .leftContent {
    position: relative;
    z-index: 11;
  }

  .title {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
  }
  .discover {
    margin: 6px 0px 24px;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    font-size: 28px;
    line-height: 130%;
  }
  .desc {
    margin-bottom: ${({ isK0 }) => (isK0 ? '32px' : '0px')};
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    & > span > span {
      margin-left: 2px;
      color: ${({ theme }) => theme.colors.text};
    }
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 60px 0px ${({ currentLevel }) => (currentLevel > 0 ? '24px' : '60px')};
    .title {
      font-size: 28px;
    }
    .discover {
      font-size: 24px;
    }
    .scopeBg {
      position: absolute;
      top: 0;
      z-index: 99;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: calc(80vw + 70px);
    padding-bottom: 40px;
    // overflow: hidden;
    .scopeBg {
      position: absolute;
      width: 100vw;
      height: 72vw;
    }
    .title {
      margin-bottom: 6px;
      font-size: 24px;
      text-align: center;
    }
    .discover {
      margin: 6px 0px 24px;
      font-size: 16px;
      text-align: center;
    }
    .desc {
      margin-bottom: 40px;
      color: ${({ theme }) => theme.colors.text60};
      font-size: 14px;
      text-align: center;
    }
  }
`;

const BgWrapper = styled.div`
  .gradient {
    position: absolute;
    bottom: -80px;
    z-index: 2;
    width: 100%;
    height: 125px;
    background: linear-gradient(0deg, #000 15.1%, rgba(0, 0, 0, 0) 98.66%);
  }
  .flex1 {
    flex: 1 1;
  }
  .scopeBg {
    position: absolute;
    top: 0;
    z-index: 99;
    pointer-events: none;
    ${({ bgColor }) =>
      bgColor && {
        path: {
          'fill-opacity': '0.1',
        },
        stop: {
          transition: '0.3s',
          'stop-color': bgColor,
        },
      }}
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    .gradient {
      bottom: -60px;
    }
    .scopeBg {
      position: absolute;
      top: 0;
      z-index: 99;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .gradient {
      bottom: 60px;
      left: 0px;
    }
    .scopeBg {
      position: absolute;
      width: 100%;
      height: 72vw;
    }
  }
`;

const WrapperVip = styled(Wrapper)`
  // padding: 0px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 10px;
    padding-bottom: 24px;
    .title {
      font-size: 24px;
      text-align: center;
    }
    .discover {
      margin: 6px 0px 24px;
      text-align: center;
    }
    // .desc {
    //   margin-bottom: 24px;
    //   font-size: 14px;
    //   text-align: center;
    // }
  }
`;

const BannerImg = styled.div`
  position: absolute;
  bottom: -120px;
  right: 0px;
  width: 558px;
  height: 492px;
  svg {
    background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    bottom: -180px;
    width: 440px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    top: 0px;
    width: 100%;
    overflow: hidden;
  }
`;

const ContentContainer = styled(Container)`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .rule {
    background: ${({ theme }) => theme.colors.cover8};
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    box-sizing: border-box;
    padding: 0px 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: block;
    padding: 0px 16px;
  }
`;

const Buttons = styled(Button)`
  color: ${({ theme, color }) => color || theme.colors.textEmphasis};
  background: ${({ theme, bgColor }) => bgColor || theme.colors.text};
  min-width: 256px;
  &:hover {
    background: ${({ theme, bgColor }) => bgColor || theme.colors.text};
  }
  &:active {
    background: ${({ theme, bgColor }) => bgColor || theme.colors.text};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
  }
`;

const segments = [50, 211];

// 为登录 和 k0等级
const K0Banner = ({
  color,
  bgColor,
  scopeColor,
  goUpgradeHandle,
  ruleHandle,
  isSm,
  bgImage,
  isInApp,
}) => {
  const lotteSource = isSm ? 'kcs_k0_h5' : 'kcs_k0_web';
  return (
    <>
      {bgImage}
      <Wrapper data-inspector="kcs_banner" bgColor={scopeColor} isK0={true}>
        <ContentContainer>
          <section className="leftContent">
            <h1 className="title">{_t('6eb42df6a2f34000abb4')}</h1>
            <p className="discover">{_t('c1a8a48654bd4000aa43')}</p>
            <p className="desc">{_tHTML('c63c5d764edf4000ac55')}</p>
            <Buttons onClick={goUpgradeHandle} color={color} bgColor={bgColor} size="large">
              {_t('e00aa1c68b994000a66e')}
            </Buttons>
            {!isSm && (
              <Button onClick={ruleHandle} className="ml-24 rule" type="default" size="large">
                {_t('rules')}
              </Button>
            )}
          </section>
          {!isSm && (
            <NoSSG>
              <BannerImg>
                <LottieProvider segments={segments} iconName={lotteSource} speed={1} loop={true} />
              </BannerImg>
            </NoSSG>
          )}
          <div className="gradient" />
        </ContentContainer>
        {isSm && !isInApp && (
          <NoSSG>
            <BannerImg>
              <LottieProvider segments={segments} iconName={lotteSource} speed={1} loop={true} />
            </BannerImg>
          </NoSSG>
        )}
      </Wrapper>
      {isSm && isInApp && (
        <NoSSG>
          <BannerImg>
            <LottieProvider segments={segments} iconName={lotteSource} speed={1} loop={true} />
          </BannerImg>
        </NoSSG>
      )}
    </>
  );
};

const Banner = ({
  levelConfig,
  userLevel,
  currentLevel,
  updateLevel,
  goUpgradeHandle,
  isLogin,
  currentScreen,
  ruleHandle,
  upgradeHandle,
  isInApp,
  isLottieReady,
  originalLevel,
}) => {
  const [key, setKey] = useState(false);
  const isSm = currentScreen === 'xs';
  const isMd = currentScreen === 'sm';
  const isLg = !isSm && !isMd;
  const isK0 = originalLevel === 0;
  const { color, bgColor, scopeColor } = isK0 ? {} : levelConfig;
  const bgImage = getScopeBg({ isSm, isMd, isLg });
  // 窗口缩放时，设置空state渲染一次
  const onResize = () => {
    setKey(Math.random());
  };

  if (isK0 || !isLogin) {
    return (
      <BgWrapper>
        <K0Banner
          color={color}
          bgColor={bgColor}
          scopeColor={scopeColor}
          userLevel={userLevel}
          currentLevel={currentLevel}
          goUpgradeHandle={goUpgradeHandle}
          bgImage={bgImage}
          isSm={isSm}
          ruleHandle={ruleHandle}
          isInApp={isInApp}
        />
      </BgWrapper>
    );
  }
  return (
    <ResizeObserver onResize={onResize}>
      <BgWrapper bgColor={scopeColor}>
        {bgImage}
        <WrapperVip data-inspector="kcs_banner" currentLevel={currentLevel}>
          {isSm ? (
            <H5Banner
              userLevel={userLevel}
              updateLevel={updateLevel}
              currentLevel={currentLevel}
              goUpgradeHandle={goUpgradeHandle}
              levelConfig={levelConfig}
              ruleHandle={ruleHandle}
              upgradeHandle={upgradeHandle}
              randomKey={key}
              isLottieReady={isLottieReady}
            />
          ) : (
            <ContentContainer>
              <WebBanner
                userLevel={userLevel}
                updateLevel={updateLevel}
                currentLevel={currentLevel}
                goUpgradeHandle={goUpgradeHandle}
                isLg={isLg}
                ruleHandle={ruleHandle}
                upgradeHandle={upgradeHandle}
                randomKey={key}
                isLottieReady={isLottieReady}
              />
            </ContentContainer>
          )}
          {!isLg && <AssetsProportion />}
        </WrapperVip>
      </BgWrapper>
    </ResizeObserver>
  );
};

const getScopeBg = ({ isSm, isMd }) => {
  if (isSm) return <ScopeBg className="scopeBg" />;
  if (isMd) return <MdScopeBg className="scopeBg" />;
  return <LgScopeBg className="scopeBg" />;
};

export default Banner;
