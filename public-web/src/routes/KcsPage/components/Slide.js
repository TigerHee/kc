/**
 * Owner: chris@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICLockedOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { evtEmitter } from 'helper';
import { useEffect, useRef, useState } from 'react';
import { _t } from 'src/tools/i18n';
import sensors from 'tools/ext/kc-sensors';
import { EVENT, levelConfigMap, levels, totalLevel } from '../config';
import { getScene } from '../utils';

const Container = styled.div`
  padding-top: 56px;
  overflow: hidden;
  .levelHeader {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: center;
    height: 6.53333vw;
    height: 21px;
    margin-top: 0.4vw;
  }
  .levelCon {
    position: absolute;
    bottom: 0px;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 84.8vw;
  }
  .line {
    position: absolute;
    top: 0;
    left: 0px;
    width: 100vw;
    height: 21px;
    object-fit: cover;
  }
`;

const SlidePoint = styled.div`
  color: ${({ selectedColor, isUnLock, theme }) =>
    isUnLock || selectedColor ? selectedColor || theme.colors.text : theme.colors.text40};
  font-size: ${({ selectedColor }) => (selectedColor ? '18px' : '14px')};
  font-weight: 600;
  line-height: 1.3;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  .tag {
    padding: 2px 6px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    white-space: nowrap;
    background: ${({ theme }) => theme.colors.cover4};
    border-radius: 4px;
  }
`;

// 曲线，动态生成，防止响应式被拉伸变形
const CurveLine = ({ className = '', width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="21"
      viewBox={`0 0 ${width} 21`}
      fill="none"
      className={className}
    >
      <path
        opacity="0.2"
        d={`M${width} 19.2176C${(333 * width) / 375} 8.18823 ${(264 * width) / 375} 1 ${
          (187 * width) / 375
        } 1C${(110 * width) / 375} 1 ${(42 * width) / 375} 8.07488 0.199219 18.9564`}
        stroke="url(#paint0_linear_140_9331)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_140_9331"
          x1="4.19922"
          y1="19"
          x2={width}
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.51" stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const SignPoint = ({ color, className = '', overlayColor }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width="25"
      height="30"
      viewBox="0 0 25 30"
      fill="none"
    >
      <path
        d="M10.7466 19.7573L12.5977 24.2822L14.4488 19.7573L18.9488 8.75727L20.8331 4.15119L16.2854 6.17238L12.5977 7.81136L8.90993 6.17238L4.36226 4.15119L6.24656 8.75727L10.7466 19.7573Z"
        fill={color}
        stroke={overlayColor || '#0D0E12'}
        strokeWidth="4"
      />
    </svg>
  );
};

const CirclePoint = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
      <circle cx="6.09766" cy="6" r="4" fill="#F3F3F3" stroke="#0D0E12" strokeWidth="4" />
    </svg>
  );
};

const LockContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: ${({ theme }) => theme.colors.text40};
  background: ${({ theme, overlayColor }) => overlayColor || '#000'};
  border-radius: 50%;
`;

const { getEvt } = evtEmitter;
const event = getEvt(EVENT);

const LockPoint = () => {
  return (
    <LockContainer>
      <ICLockedOutlined size={8} />
    </LockContainer>
  );
};

const getSlidePoint = (currentLevel, levels) => {
  const len = levels.length;
  const start = currentLevel - 3 <= 0 ? 0 : currentLevel - 3;
  const end = currentLevel === 1 ? 3 : currentLevel + 3 >= len ? len : currentLevel + 3;
  return levels.slice(start, end);
};

// h5 banner slide
function Slide({ currentLevel, userLevel, levelConfig, updateLevel, randomKey }) {
  const conRef = useRef(null);
  const [width, setWidth] = useState(375);
  const { isRTL } = useLocale();

  useEffect(() => {
    setWidth(conRef.current.clientWidth);
  }, [randomKey]);

  const sliceLevels = getSlidePoint(currentLevel, levels);
  const { textColor, offset, overlayColor } = levelConfig;
  const style = isRTL
    ? {
        right: offset,
      }
    : {
        left: offset,
      };
  return (
    <Container ref={conRef}>
      <div className="levelHeader">
        <div className="levelCon" style={style}>
          {sliceLevels.map(({ level }) => {
            // 选中
            const isSelected = level === currentLevel;
            // 解锁
            const isUnLock = userLevel >= level && !isSelected;
            // 未解锁
            const isLock = !isUnLock && !isSelected;
            // 是否当前等级最近一个
            const isNext = currentLevel - 1 === level || currentLevel + 1 === level;
            const isNext2 = currentLevel - 2 === level || currentLevel + 2 === level;
            const style = {
              paddingBottom: isNext
                ? isLock
                  ? '10px'
                  : '12px'
                : isNext2
                ? isLock
                  ? '7px'
                  : '8px'
                : '0px',
            };

            const levelText =
              userLevel === currentLevel
                ? _t('809aa3a4b0344000a315')
                : userLevel >= currentLevel
                ? _t('0acace9fd4634000adcd')
                : _t('bd2b89dbd9a54000af5e');

            return (
              <SlidePoint
                style={style}
                key={level}
                isUnLock={isUnLock}
                selectedColor={isSelected ? textColor : null}
                onClick={() => {
                  // updateLevel(level);
                  event.emit('updateLevel', level);
                }}
              >
                {isSelected && <div className="tag">{levelText}</div>}
                <span>{`K${level}`}</span>
                {isSelected && <SignPoint overlayColor={overlayColor} color={textColor} />}
                {isUnLock && <CirclePoint color={textColor} />}
                {isLock && <LockPoint />}
              </SlidePoint>
            );
          })}
        </div>
        <CurveLine width={width} className="line" />
      </div>
    </Container>
  );
}

const HeaderSlideContainer = styled.div`
  width: 100%;
  position: relative;
  .slideWrapper {
    display: flex;
    // flex-direction: column;
    align-items: center;
  }
  &::before {
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #fff;
    background: ${({ userLevel, hightLightWidth, theme }) =>
      `linear-gradient(to right, #fff0 0px, #fff ${hightLightWidth}px,rgba(255, 255, 255, 0.1) ${
        hightLightWidth + 1
      }px)`};
    content: '';
  }
`;

const HeaderPoint = styled.div`
  position: relative;
  color: ${({ isSelected, isUnLock, theme }) =>
    isUnLock || isSelected ? isSelected || theme.colors.text : theme.colors.text40};
  font-size: ${({ isSelected }) => (isSelected ? '14px' : '12px')};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
  line-height: 1.3;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 0px 16px 4px;
  &::before {
    position: absolute;
    bottom: ${({ isSelected }) => (isSelected ? '0.5px' : '-0.5px')};
    left: calc(50% - 1px);
    width: ${({ isLock }) => (isLock ? '2px' : '2px')};
    height: ${({ isLock }) => (isLock ? '2px' : '2px')};
    background: ${({ theme, isLock }) => (isLock ? 'black' : theme.colors.text)};
    border: ${({ isLock, theme }) => (isLock ? `0.5px solid ${theme.colors.text}` : 'none')};
    border-radius: 50%;
    content: '';
  }
  .textWrap {
    position: relative;
  }
  .lock {
    position: absolute;
    top: 0px;
  }
`;

// app header slide
const HeaderSlide = ({ currentLevel, userLevel, updateLevel }) => {
  const slideRef = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = document.querySelector(`div[data-index="${userLevel}"]`);
    if (el && slideRef.current) {
      const childRect = el.getBoundingClientRect();
      const parentRect = slideRef.current.getBoundingClientRect();
      const distanceLeft = childRect.left - parentRect.left + el.clientWidth / 2;
      setWidth(distanceLeft);
    }
  }, [userLevel, currentLevel]);

  return (
    <HeaderSlideContainer userLevel={userLevel} hightLightWidth={width} ref={slideRef}>
      <div className="slideWrapper">
        {levels.map(({ level }) => {
          // 选中
          const isSelected = level === currentLevel;
          // 解锁
          const isUnLock = userLevel >= level && !isSelected;
          // 未解锁
          const isLock = !isUnLock && !isSelected;
          return (
            <HeaderPoint
              isUnLock={isUnLock}
              isLock={isLock}
              userLevel={userLevel}
              isSelected={isSelected}
              data-index={level}
              onClick={() => {
                event.emit('updateLevel', level, {
                  noSwipe: true,
                });
                window.scrollTo(0, 0);
              }}
            >
              <span className="textWrap">
                {`K${level}`}
                {userLevel < level && <ICLockedOutlined className="lock" size={6} />}
              </span>
            </HeaderPoint>
          );
        })}
      </div>
    </HeaderSlideContainer>
  );
};

const WebBannerSlideContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 60px;
  .slideWrapper {
    display: flex;
    // flex-direction: column;
    align-items: center;
    justify-content: space-between;
    .signWeb {
      position: absolute;
      top: -16px;
      transform: rotate(180deg);
    }
  }
  &::before {
    position: absolute;
    top: 1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #fff;
    background: ${({ clientWidth, hightLightWidth, theme }) =>
      `linear-gradient(to right, #fff0 6px, ${theme.colors.text60} 6px, ${
        theme.colors.text60
      } ${hightLightWidth}px,rgba(255, 255, 255, 0.1) ${
        hightLightWidth + 1
      }px,rgba(255, 255, 255, 0.1) ${clientWidth - 3}px, rgba(255, 255, 255, 0) ${
        clientWidth - 2
      }px)`};
    content: '';
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 26px;
  }
`;

const WebBannerPoint = styled.div`
  position: relative;
  cursor: pointer;
  color: ${({ isSelected, isUnLock, theme }) =>
    isUnLock || isSelected ? isSelected || theme.colors.text : theme.colors.text40};
  font-size: ${({ isSelected }) => (isSelected ? '18px' : '14px')};
  font-weight: 600;
  line-height: 1.3;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 8px 0px 0px;
  &::before {
    position: absolute;
    top: -6px;
    left: 50%;
    display: ${({ isUnLock, isSelected }) => (isUnLock || isSelected ? 'block' : 'none')};
    box-sizing: border-box;
    width: ${({ isLock }) => (isLock ? '12px' : '12px')};
    height: ${({ isLock }) => (isLock ? '12px' : '12px')};
    background: ${({ isLock, theme }) => (isLock ? `${theme.colors.text}` : '#fff')};
    border: ${({ theme, isLock, overlayColor }) => `3px solid ${overlayColor || '#021112'}`};
    border-radius: 50%;
    transform: translateX(-50%);
    content: '';
  }
  .textWrap {
    position: relative;
  }
  .lock {
    position: absolute;
    top: -7px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.text40};
    background: ${({ theme, overlayColor }) => overlayColor || '#000'};
    border-radius: 50%;
  }
  .levelDesc {
    position: absolute;
    bottom: 1px;
    height: 20px;
    max-height: 20px;
    padding: 0px 6px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    word-break: keep-all;
    background: ${({ theme }) => theme.colors.cover4};
    border-radius: 4px;
    ${({ isLastLevel }) =>
      isLastLevel
        ? {
            'margin-right': '6px',
            transform: 'translateX(-100%)',
          }
        : {
            'margin-left': '6px',
          }}
  }
`;

// web banner slide
const WebBannerSlide = ({ currentLevel, userLevel, updateLevel, randomKey }) => {
  const slideRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);
  useEffect(() => {
    const el = document.querySelector(`div[data-index="${userLevel}"]`);
    if (el && slideRef.current) {
      const childRect = el.getBoundingClientRect();
      const parentRect = slideRef.current.getBoundingClientRect();
      const distanceLeft = childRect.left - parentRect.left + el.clientWidth / 2;
      setWidth(distanceLeft);
      setClientWidth(slideRef.current.clientWidth);
    }
  }, [userLevel, currentLevel, randomKey]);

  const { textColor, overlayColor } = levelConfigMap[currentLevel] || {};

  const levelText =
    userLevel === currentLevel
      ? _t('809aa3a4b0344000a315')
      : userLevel >= currentLevel
      ? _t('0acace9fd4634000adcd')
      : _t('bd2b89dbd9a54000af5e');

  return (
    <WebBannerSlideContainer
      userLevel={userLevel}
      hightLightWidth={width}
      clientWidth={clientWidth}
      ref={slideRef}
    >
      <div className="slideWrapper">
        {levels.map(({ level }) => {
          // 选中
          const isSelected = level === currentLevel;
          // 解锁
          const isUnLock = userLevel >= level && !isSelected;
          // 未解锁
          const isLock = userLevel < level && !isSelected;

          const style = isSelected ? { color: textColor } : {};

          const isLastLevel = currentLevel === totalLevel;

          return (
            <WebBannerPoint
              key={level}
              isUnLock={isUnLock}
              isLock={isLock}
              userLevel={userLevel}
              isSelected={isSelected}
              data-index={level}
              isLastLevel={isLastLevel}
              overlayColor={overlayColor}
              onClick={() => {
                sensors.trackClick([`Banner`, `${level}`], {
                  kcs_level: userLevel,
                  pagePosition: `${currentLevel}`,
                  ...getScene(),
                });
                updateLevel(level);
                window.scrollTo(0, 0);
              }}
            >
              {isSelected ? (
                <SignPoint className="signWeb" color={textColor} overlayColor={overlayColor} />
              ) : isLock ? (
                <div className="lock">
                  <ICLockedOutlined size={8} />
                </div>
              ) : (
                ''
              )}
              <span className="textWrap" style={style}>
                {isSelected && isLastLevel && <span className="levelDesc">{levelText}</span>}
                {`K${level}`}
                {isSelected && !isLastLevel && <span className="levelDesc">{levelText}</span>}
              </span>
            </WebBannerPoint>
          );
        })}
      </div>
    </WebBannerSlideContainer>
  );
};

export { HeaderSlide, WebBannerSlide };

export default Slide;
