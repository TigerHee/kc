/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { Line } from 'react-progress-bar.js';
import { styled } from '@/style/emotion';
import { useTheme } from '@emotion/react';
import { isRTLLanguage } from 'src/utils/langTools';
import clockStarted from '@/assets/chart/clock-started.svg';
import clockPlan from '@/assets/chart/clock-plan.svg';
import ProgressLineVertical from './ProgressLineVertical';

const ProgressLineClock = styled.img`
  position: absolute;
  margin-left: -22px;
  margin-top: -9px;
`;

const ProgressLineClockEnd = styled.img`
  position: absolute;
  margin-top: -12px;
`;

const ProgressLineDiv = styled.div`
  width: 50%;
  &:first-of-type{
    padding-left: 21px;
    padding-right: 10.5px;
  }
  &:last-of-type{
    padding-left: 10.5px;
    padding-right: 21px;
  }
`;

const ProgressEndTextSpan = styled.span`
  width: max-content;
  right: -21px;
  font-weight: 500;
`;

const ProgressTextStyle = {
  position: 'absolute',
  top: '24px',
  padding: 0,
  margin: 0,
  'font-weight': 500,
  'font-size': '14px',
};

const ProgressLine = (props) => {
  const { vertical, isEnd, isActive } = props;
  const theme = useTheme();
  const isRtl = isRTLLanguage();
  const endColor = isEnd ? theme.colors.text : theme.colors.text40;
  const textColor = (isActive || isEnd) ? theme.colors.text : theme.colors.text40;
  if (vertical) {
    return (<ProgressLineVertical
      endColor={endColor} textColor={textColor} isRtl={isRtl}
      {...props}
    />);
  }
  const { showEnd, endText, progress, text, offset } = props;
  const options = {
    color: '#23AF91',
    strokeWidth: 1,
    trailColor: theme.colors.cover8,
    easing: 'linear',
    svgStyle: {
      display: 'block',
      width: '100%',
      ...(isRtl ? { transform: 'rotate(180deg)' } : undefined),
    },
    text: {
      value: text,
      style: {
        ...ProgressTextStyle,
        color: textColor,
        [isRtl ? 'right' : 'left']: offset ? '-26px' : '-21px',
      },
      autoStyleContainer: true,
    },
  };
  return (<ProgressLineDiv>
    <ProgressLineClock src={(isActive || isEnd) ? clockStarted : clockPlan} />
    <Line
      progress={progress}
      options={options}
      initialAnimate
      textColor={textColor}
      containerStyle={{
        display: 'inline-block',
        verticalAlign: 'text-top',
        width: '100%',
      }}
    />
    {showEnd && <span style={{ position: 'absolute' }}>
      <ProgressLineClockEnd src={isEnd ? clockStarted : clockPlan} />
      { endText && <ProgressEndTextSpan style={{ ...ProgressTextStyle, color: endColor }}>
        { endText }
      </ProgressEndTextSpan>}
    </span>}
  </ProgressLineDiv>
  );
};

export default memo(ProgressLine);
