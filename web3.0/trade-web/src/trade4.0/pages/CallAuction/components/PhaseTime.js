/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import { ICWaitOutlined } from '@kux/icons';
import { eTheme, eConditionStyle } from '@/utils/theme';
import { _t, _tHTML } from 'utils/lang';

const TimeDiv = styled.div`
  display: inline-flex;
  border: 1px solid ${eTheme('divider8')};
  ${eConditionStyle(true, 'isActive')`
    border: 1px solid ${eTheme('primary')};
  `}
  border-radius: 8px;
  margin: 16px 10px;
  & > div:first-of-type {
    display: flex;
    align-items: center;
    padding: 5px;
    background: ${eTheme('cover8')};
    color: ${eTheme('icon')};
    line-height: 0;
    border-radius: 6px 0 0 6px;
    ${eConditionStyle(true, 'isActive')`
      background: ${eTheme('primary')};
      color: ${eTheme('textEmphasis')};
    `}
  }
`;

const TimeTextDiv = styled.div`
  color: ${eTheme('text40')};
  padding: 6px 12px;
  font-size: 14px;
  line-height: 1;
  border-radius: 0 8px 8px 0;
  font-weight: 400;
  ${eConditionStyle(true, 'isActive')`
    color: ${eTheme('primary')};
    font-weight: 500;
  `}
`;

const TimeTextSpan = styled.span`
  > span {
    // > span {
    //   padding-left: 8px;
    // }
  }
`;

const PhaseTime = (props) => {
  const { style, countDownInfo } = props;
  const { countDown = {}, isActive, isEnd } = countDownInfo || {};
  const timeText =
    isActive || isEnd ? (
      <TimeTextSpan isActive={isActive}>
        {_tHTML('trd.ca.time.remain', {
          time: _t('tra.ca.milestone.time', {
            h: `${countDown.m}m`,
            m: `${countDown.s}s`,
            unit: '',
          }),
        })}
      </TimeTextSpan>
    ) : (
      _t('trd.ca.toBeStarted')
    );
  return (
    <TimeDiv isActive={isActive} style={style}>
      <div>
        <ICWaitOutlined size={16} />
        {/* <img width={14} height={14} src={isActive ? clockActive : clockImg} alt="" /> */}
      </div>
      <TimeTextDiv isActive={isActive}>{timeText}</TimeTextDiv>
    </TimeDiv>
  );
};

export default PhaseTime;
