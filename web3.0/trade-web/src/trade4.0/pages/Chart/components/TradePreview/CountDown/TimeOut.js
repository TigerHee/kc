/**
 * Owner: jessie@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { _t } from 'utils/lang';
import { TimeOutWrapper, Item, TimeColon, TimeNum, TimeTitle } from './style';

// 倒计时组件
const TimeOut = ({ totalMS = 15 * 60 * 1000, finish = () => {}, className }) => {
  const [times, setTimes] = useState({ hours: '00', minutes: '00', seconds: '00' });
  let timer = null;
  const timeTransition = (maxtime) => {
    timer = setInterval(() => {
      if (maxtime >= 100) {
        let hours = Math.floor(maxtime / 1000 / 3600);
        let minutes = Math.floor((maxtime / 1000 / 60) % 60);
        let seconds = Math.floor((maxtime / 1000) % 60);
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        setTimes({
          hours,
          minutes,
          seconds,
        });
        maxtime -= 100;
      } else {
        setTimes({
          hours: '00',
          minutes: '00',
          seconds: '00',
        });
        clearInterval(timer);
        finish();
        // return;
      }
    }, 100);
  };

  useEffect(() => {
    timeTransition(totalMS * 1000);
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [totalMS]);

  return (
    <TimeOutWrapper className={className}>
      <Item className={className}>
        <TimeNum>{times.hours}</TimeNum>
        <TimeTitle>{_t('preview.countdown.hours')}</TimeTitle>
      </Item>
      <TimeColon />
      <Item className={className}>
        <TimeNum>{times.minutes}</TimeNum>
        <TimeTitle>{_t('preview.countdown.minutes')}</TimeTitle>
      </Item>
      <TimeColon />
      <Item className={className}>
        <TimeNum>{times.seconds}</TimeNum>
        <TimeTitle>{_t('preview.countdown.seconds')}</TimeTitle>
      </Item>
    </TimeOutWrapper>
  );
};
export default TimeOut;
