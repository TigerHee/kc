/**
 * Owner: chris@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Carousel, styled } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { _t } from 'src/tools/i18n';
import sensors from 'tools/ext/kc-sensors';
import { EVENT, levelConfigMap, levels, levelsMap, totalLevel } from '../../config';
import { getScene, getUpgradeLevelText } from '../../utils';
import StarBorderButton from '../StarBorderButton';

import { evtEmitter } from 'helper';

import LottieProvider from '../LottieProvider';

const { getEvt } = evtEmitter;
const event = getEvt(EVENT);

const settings = {
  dots: false,
  infinite: false,
  speed: 300,
  autoplay: false,
  arrows: false,
  caseEase: 'cubic-bezier(0.16, 0.00, 0.18, 1.00)',
  // cssEase: 'ease-out',
};

const Container = styled.div`
  .kux-slick-arrow {
    display: none;
  }
  .kux-slick-track {
    transition-timing-function: cubic-bezier(0.16, 0, 0.18, 1) !important;
  }
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  .level {
    position: relative;
    z-index: 1;
    width: 145px;
    min-width: 145px;
    height: 145px;
  }
  .star {
    position: absolute;
    top: -100px;
    left: -70px;
    width: 318px;
    height: 318px;
    opacity: 0.4;
    pointer-events: none;
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
    .bag {
      width: 28px;
      margin-left: 12px;
    }
  }
  .desc,
  .upgrade {
    margin-bottom: 0px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
  }
  .upgrade {
    margin-left: 6px;
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    .level {
      width: 105px;
      min-width: 105px;
      height: 105px;
    }
    .star {
      position: absolute;
      top: -40px;
      left: 0px;
      width: 155px;
      height: 155px;
    }
    .title {
      font-size: 28px;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: block;
    text-align: center;
    .level {
      width: 220px;
      min-width: 220px;
      height: 220px;
      margin: 0px auto;
    }
    .title {
      justify-content: center;
      margin-top: 20px;
      margin-bottom: 6px;
      font-size: 24px;
    }
    .desc,
    .upgrade {
      margin-bottom: 24px !important;
      color: ${({ theme }) => theme.colors.text60};
      font-size: 12px !important;
    }
    .upgrade {
      margin-left: 6px;
      color: ${({ theme }) => theme.colors.primary};
      cursor: pointer;
    }
  }
`;

const Buttons = styled(StarBorderButton)`
  width: calc(100% - 32px);
`;

function Swiper({
  currentLevel,
  userLevel,
  updateLevel,
  goUpgradeHandle,
  upgradeHandle,
  isLottieReady,
}) {
  const carouselRef = useRef();
  const [isProgrammaticSlide, setIsProgrammaticSlide] = useState(false);
  // let slideByHand = false;
  const { isRTL } = useLocale();

  // useEffect(() => {
  //   if (carouselRef.current) {
  //     carouselRef.current.slickGoTo(isRTL ? totalLevel - currentLevel : currentLevel - 1);
  //   }
  // }, [currentLevel, isRTL]);

  useEffect(() => {
    let onListen = (l, options) => {
      const { init, noSwipe } = options || {};

      const lastLevel = isRTL ? totalLevel - l : l - 1;

      sensors.trackClick([`Banner`, `${l}`], {
        kcs_level: userLevel,
        pagePosition: `${currentLevel}`,
        ...getScene(),
      });
      // 不使用滑动效果
      if (noSwipe || init) {
        if (!init) {
          updateLevel(l, true);
        }
        carouselRef.current.slickGoTo(lastLevel, true);
      } else {
        setIsProgrammaticSlide(true);
        carouselRef.current.slickGoTo(lastLevel, false);
        updateLevel(l, true);
      }
    };
    event.on('updateLevel', onListen);
    return () => {
      // 取消监听事件
      event.off('updateLevel', onListen);
    };
  }, [isRTL]);

  const beforeChange = (current, next) => {
    if (!isProgrammaticSlide) {
      const _nextLevel = isRTL ? totalLevel - next : next + 1;
      sensors.trackClick([`Banner`, `${_nextLevel}`], {
        kcs_level: userLevel,
        pagePosition: `${currentLevel}`,
        ...getScene(),
      });
      updateLevel(_nextLevel);
    }
  };

  const afterChange = () => {
    setIsProgrammaticSlide(false);
  };

  const isLastLevel = userLevel === totalLevel && userLevel === currentLevel;
  const userLastLevel = userLevel === totalLevel;

  const { h5srcSource, bgColor, upgradeColor, titleColor, hintColor, shineColor } =
    levelConfigMap[currentLevel] || {};

  return (
    <Container>
      <Carousel
        {...settings}
        ref={carouselRef}
        afterChange={afterChange}
        beforeChange={beforeChange}
      >
        {levels.map(({ level, text }, idx) => {
          return (
            <Card key={`${level}_${currentLevel}_${userLevel}`}>
              {isLottieReady ? (
                <LottieProvider
                  className="level"
                  iconName={h5srcSource}
                  speed={1}
                  loop={true}
                  useCache
                />
              ) : (
                <div className="level" />
              )}
              <div className="title" style={{ color: titleColor }}>
                {levels[currentLevel - 1]?.text}
              </div>
              <div className="desc">
                <span>{getUpgradeLevelText(currentLevel)}</span>
                {(userLevel < currentLevel || isLastLevel) && (
                  <span onClick={upgradeHandle} className="upgrade" style={{ color: upgradeColor }}>
                    {isLastLevel ? _t('79f6c4adf4a34000a375') : _t('c3a7ca96665b4000af41')}
                  </span>
                )}
              </div>
              <Buttons
                shineColor={shineColor}
                onClick={() => {
                  sensors.trackClick([`Update`, `1`], {
                    kcs_level: userLevel,
                    pagePosition: `${currentLevel}`,
                    ...getScene(),
                  });
                  goUpgradeHandle();
                }}
                style={{
                  color: hintColor,
                  background: bgColor,
                  width: 'calc(100% - 32px)',
                }}
                size="large"
              >
                {userLastLevel ? _t('43be8ba0ff1d4000ad18') : _t('e00aa1c68b994000a66e')}
              </Buttons>
            </Card>
          );
        })}
      </Carousel>
    </Container>
  );
}

// web 等级部分
export const SwiperWeb = ({
  currentLevel,
  userLevel,
  goUpgradeHandle,
  upgradeHandle,
  randomKey,
  isLottieReady,
}) => {
  const { text } = levelsMap[currentLevel] || {};
  const { srcSource, upgradeColor, textColor, titleColor, hintColor, bagSource, starSource } =
    levelConfigMap[currentLevel] || {};
  const isLastLevel = userLevel === totalLevel && userLevel === currentLevel;
  return (
    <Card>
      <div className="level">
        {isLottieReady && <LottieProvider iconName={srcSource} speed={1} loop={true} />}
      </div>
      <div className="ml-16">
        <h1 className="title" style={{ color: titleColor }}>
          <span>{text}</span>
          <img className="bag" src={bagSource} alt="bag" />
        </h1>
        <div className="desc">
          {getUpgradeLevelText(currentLevel)}
          {(userLevel < currentLevel || isLastLevel) && (
            <span onClick={upgradeHandle} className="upgrade" style={{ color: upgradeColor }}>
              {isLastLevel ? _t('79f6c4adf4a34000a375') : _t('c3a7ca96665b4000af41')}
            </span>
          )}
        </div>
      </div>
      {starSource && <img className="star" src={starSource} alt="star" />}
    </Card>
  );
};

export default Swiper;
