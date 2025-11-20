/**
 * Owner: ella@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { getCountdown } from 'services/bitcoinHalving';
import { _t } from 'tools/i18n';
import { Wrapper, Title, Digit, Unit, TimeWrapper, Separator } from './index.style';

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
export default () => {
  const [time, setTime] = useState(defaultTime);

  useEffect(() => {
    let timer;
    getCountdown().then((res) => {
      if (res.success) {
        // 获取倒计时时间 秒
        let { data } = res;
        setTime(getformateTime(data));
        timer = setInterval(() => {
          data--;
          setTime(getformateTime(data));
        }, 1000);
      }
    });

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <Wrapper>
      <Title>{_t('rKrtBdxk8yCqGm8YYqKMiS')}</Title>
      <TimeWrapper>
        <Digit>
          {time.day}
          <Unit>D</Unit>
        </Digit>
        <Separator>:</Separator>
        <Digit>
          {time.hours}
          <Unit>H</Unit>
        </Digit>
        <Separator>:</Separator>
        <Digit>
          {time.minute}
          <Unit>M</Unit>
        </Digit>
        <Separator>:</Separator>
        <Digit>
          {time.second}
          <Unit>S</Unit>
        </Digit>
      </TimeWrapper>
    </Wrapper>
  );
};
