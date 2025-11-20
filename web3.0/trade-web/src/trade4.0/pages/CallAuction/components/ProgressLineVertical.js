/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useEffect } from 'react';
import { Line } from 'react-progress-bar.js';
import { map } from 'lodash';
import { useTheme } from '@emotion/react';
import { styled } from '@/style/emotion';
import clockStarted from '@/assets/chart/clock-started.svg';
import clockPlan from '@/assets/chart/clock-plan.svg';
import { eConditionStyle, eTheme, eNotConditionStyle } from '@/utils/theme';
import FetureDes from './FetureDes';

const VerticalToNormalStyle = `
  transform: rotate(-90deg);
  transform-origin: 0 0;
`;

const ProgressLineClock = styled.img`
  ${VerticalToNormalStyle}
  ${eConditionStyle(true, 'isRtl')`
    transform: rotate(90deg);
    transform-origin: 100% 0;
  `}
  position: absolute;
  margin-left: -24px;
  margin-top: 12px;
  z-index: 1;
`;

const ProgressLineTextWrap = styled.div`
  ${VerticalToNormalStyle}
  ${eConditionStyle(true, 'isRtl')`
    transform: rotate(90deg);
    transform-origin: 100% 0;
  `}
  position: absolute;
  display: inline-block;
  margin-left: -12px;
`;

const ProgressLineEndTextWrap = styled.div`
  ${VerticalToNormalStyle}
  ${eConditionStyle(true, 'isRtl')`
    transform: rotate(90deg);
    transform-origin: 100% 0;
  `}
  position: absolute;
  display: inline-block;
  margin-left: 12px;
`;

const ProgressLineTextContent = styled.div`
  margin-left: 24px;
  margin-top: -8px;
`;

const ProgressLineTextTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const ProgressLineTextIntro = styled.div`
  font-weight: 400;
  color: ${eTheme('text40')};
  margin-top: 8px;
`;

const ProgressLineClockEnd = styled.img`
  ${VerticalToNormalStyle}
  ${eConditionStyle(true, 'isRtl')`
    transform: rotate(90deg);
    transform-origin: 100% 0;
  `}
  position: absolute;
  margin-top: 12px;
  z-index: 1;
`;

const ProgressLineDiv = styled.div`
  transform-origin: left;
  transform: rotate(90deg);
  ${eConditionStyle(true, 'isRtl')`
    transform: rotate(-90deg);
  `}
  display: inline-block;
  padding-left: 12px;
`;

const FetureDesWrap = styled.div`
  span {
    font-size: 14px;
    font-weight: 400;
  }
  ${eNotConditionStyle(0, 'index')`
    margin-top: 6px;
  `}
`;

const ProgressLineVertical = (props) => {
  const { noStarted, isEnd, isActive, endText, verticalHeight, progress, features, isRtl,
    showEnd, onFinish, progressTimeTitle, endColor, verticalWidth, textColor,
  } = props;
  const theme = useTheme();
  const options = {
    color: '#23AF91',
    strokeWidth: 4,
    trailColor: theme.colors.cover8,
    easing: 'linear',
    svgStyle: {
      display: 'block',
      width: '100%',
      ...(isRtl ? { transform: 'rotate(180deg)' } : undefined),
    },
  };

  useEffect(() => {
    if (isEnd && showEnd && typeof onFinish === 'function') {
      onFinish();
    }
  }, [isEnd, showEnd, onFinish]);
  const textWidth = verticalWidth - 48;
  return (<ProgressLineDiv isRtl={isRtl}>
    <ProgressLineClock isRtl={isRtl} src={noStarted ? clockPlan : clockStarted} />
    <ProgressLineTextWrap isRtl={isRtl}>
      <ProgressLineTextContent>
        <ProgressLineTextTitle style={{ color: textColor }}>{progressTimeTitle}</ProgressLineTextTitle>
        {textWidth > 0 && <ProgressLineTextIntro style={{ width: textWidth }}>
          <div>
            {map(features, (item, index) => <FetureDesWrap index={index} key={String(index)}>
              <FetureDes {...item} noPadding isActive={isActive || isEnd} />
            </FetureDesWrap>)}
          </div>
        </ProgressLineTextIntro>
        }
      </ProgressLineTextContent>
    </ProgressLineTextWrap>
    <Line
      progress={progress}
      options={options}
      initialAnimate
      containerStyle={{
        display: 'inline-block',
        verticalAlign: 'text-top',
        width: verticalHeight - 24,
        transform: 'translateY(-2px)',
      }}
    />
    {showEnd && (<div style={{ display: 'inline-block', position: 'absolute' }}>
      <ProgressLineClockEnd isRtl={isRtl} src={isEnd ? clockStarted : clockPlan} />
      {endText && <ProgressLineEndTextWrap isRtl={isRtl}>
        <ProgressLineTextContent>
          {textWidth > 0 &&
            <ProgressLineTextTitle style={{ color: endColor, width: textWidth }}>
              {endText}
            </ProgressLineTextTitle>
          }
        </ProgressLineTextContent>
      </ProgressLineEndTextWrap>}
    </div>
    )}
  </ProgressLineDiv>
  );
};

export default memo(ProgressLineVertical);
