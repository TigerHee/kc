/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useEffect, useState } from 'react';
import timetop from 'static/bitcoin-halving/timetop.svg';
import timebottom from 'static/bitcoin-halving/timebottom.svg';
import { Wrapper, TimeBox, TopBgImg, BottomBgImg, Time, Unit, Separator } from './index.style';

const defaultTime = {
  day: 0,
  hours: 0,
  minute: 0,
  second: 0,
};

const getformateTime = (data) => {
  const day = Math.trunc(data / 86400);
  const hours = Math.trunc((data - day * 86400) / 3600);
  const minute = Math.trunc((data - day * 86400 - hours * 3600) / 60);
  const second = data - day * 86400 - hours * 3600 - minute * 60;
  return {
    day,
    hours,
    minute,
    second,
  };
};

export default ({ countDownTime }) => {
  const [time, setTime] = useState(defaultTime);

  const changeTime = useCallback((data) => {
    setTimeout(() => {
      if (data > 0) {
        data--;
        setTime(getformateTime(data));
        changeTime(data);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (countDownTime) {
      // 获取倒计时时间 秒
      let data = Math.floor(countDownTime / 1000);
      if (data >= 0) {
        setTime(getformateTime(data));
        changeTime(data);
      } else {
        setTime(getformateTime(0));
      }
    }
  }, [countDownTime, changeTime]);

  return (
    <Wrapper>
      <TimeBox>
        <TopBgImg src={timetop} />
        <Time>{time.day}</Time>
        <Unit>D</Unit>
        <BottomBgImg src={timebottom} />
      </TimeBox>
      <Separator>:</Separator>
      <TimeBox>
        <TopBgImg src={timetop} />
        <Time>{time.hours}</Time>
        <Unit>H</Unit>
        <BottomBgImg src={timebottom} />
      </TimeBox>
      <Separator>:</Separator>
      <TimeBox>
        <TopBgImg src={timetop} />
        <Time>{time.minute}</Time>
        <Unit>M</Unit>
        <BottomBgImg src={timebottom} />
      </TimeBox>
      <Separator>:</Separator>
      <TimeBox>
        <TopBgImg src={timetop} />
        <Time>{time.second}</Time>
        <Unit>S</Unit>
        <BottomBgImg src={timebottom} />
      </TimeBox>
    </Wrapper>
  );
};
