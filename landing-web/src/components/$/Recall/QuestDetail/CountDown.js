/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useMemo, useState, useImperativeHandle, forwardRef } from 'react';
import { styled } from '@kufox/mui/emotion';
import lockLight from 'assets/recall/lock_light.svg';
import lockDark from 'assets/recall/lock_dark.svg';
import useTheme from '@kufox/mui/hooks/useTheme';
import { _tHTML } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { useSelector } from 'dva';
import { recallStageTimeUnit } from 'components/$/Recall/config';

const Wrapper = styled.div``;

const CountDownWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: ${px2rem(36)} 0 ${px2rem(13)};
`;
const Item = styled.span`
  padding: 0 ${px2rem(3)};
  height: ${px2rem(24)};
  background: ${({ theme }) => theme.colors.text};
  border-radius: ${px2rem(3)};
  font-weight: 600;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textEmphasis};
`;
const Separate = styled.span`
  font-weight: 600;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(26)};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 ${px2rem(2)};
`;

const DescBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${px2rem(24)};
`;
const Icon = styled.img`
  width: ${px2rem(16)};
  height: ${px2rem(16)};
  margin-right: ${px2rem(5)};
`;
const Desc = styled.span`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  i {
    color: ${({ theme }) => theme.colors.text};
    font-style: normal;
  }
`;

const CountDown = ({ target }, countDownRef) => {
  const [timerFlag, setTimerFlag] = useState(false);
  const { currentTheme } = useTheme();
  const { currentStageInfo, generalInfo } = useSelector(state => state.userRecall);
  const { countingStartTime, countingTimeUnit, countingTotalTime } = currentStageInfo;
  const { currency: activityCurrency } = generalInfo;

  const duration = useMemo(
    () => {
      if (countingTimeUnit && recallStageTimeUnit[countingTimeUnit] && countingTotalTime) {
        const time = recallStageTimeUnit[countingTimeUnit] * countingTotalTime;
        const endTime = countingStartTime + time;
        const nowTime = Date.now();
        // 获取endTime和nowTime的时间差，返回一个包含hours，minutes，seconds的对象
        const diff = endTime - nowTime;
        const hours = Math.max(Math.floor(diff / (1000 * 60 * 60)), 0);
        const minutes = Math.max(Math.floor((diff / (1000 * 60)) % 60), 0);
        const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);
        return {
          hours: hours < 10 ? `0${hours}` : hours,
          minutes: minutes < 10 ? `0${minutes}` : minutes,
          seconds: seconds < 10 ? `0${seconds}` : seconds,
        };
      }
      return { hours: '--', minutes: '--', seconds: '--' };
    },
    [countingStartTime, countingTotalTime, countingTimeUnit, timerFlag],
  );

  useEffect(() => {
    const timer = setInterval(() => setTimerFlag(i => !i), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, []);

  useImperativeHandle(countDownRef, () => {
    return {
      duration,
    };
  });

  return (
    <Wrapper ref={countDownRef}>
      <CountDownWrapper>
        <Item>{duration.hours}</Item>
        <Separate>:</Separate>
        <Item>{duration.minutes}</Item>
        <Separate>:</Separate>
        <Item>{duration.seconds}</Item>
      </CountDownWrapper>
      <DescBox>
        <Icon src={currentTheme === 'light' ? lockLight : lockDark} />
        <Desc>{_tHTML('quwB6UuTPD8mgr4m5ktWmf', { number: target, currency: activityCurrency })}</Desc>
      </DescBox>
    </Wrapper>
  );
};

export default forwardRef(CountDown);
