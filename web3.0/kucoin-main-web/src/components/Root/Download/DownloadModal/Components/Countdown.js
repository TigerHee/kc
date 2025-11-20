/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { styled } from '@kufox/mui';
import storage from 'src/utils/storage';
import _ from 'lodash';
import { expireTime } from '../../config';

const CountDown = styled.div`
  position: absolute;
  bottom: 0px;
  font-size: 12px;
  color: #fff;
  font-weight: 900;
  font-style: italic;
  width: 56px;
  right: 1px;
  text-align: center;
`;

let interval = null;

export default ({ onClose } = {}) => {
  const [minute, setM] = useState(expireTime.m);
  const [second, setS] = useState(expireTime.s);

  useEffect(() => {
    countDown();
    return () => {
      interval && clearInterval(interval);
    };
  }, []);

  function countDown() {
    try {
      const data = storage.getItem('download_countdown');
      let m = minute;
      let s = second;
      if (data && (data.m || data.s)) {
        m = data.m;
        s = data.s;
      }

      getCountdown();
      interval = setInterval(function () {
        getCountdown();
      }, 1000);
      function getCountdown() {
        setM(m);
        setS(s);
        storage.setItem('download_countdown', { m, s });
        if (m == 0 && s == 0) {
          onClose();
        } else if (m >= 0) {
          if (s > 0) {
            s--;
          } else if (s == 0) {
            m--;
            s = 59;
          }
        }
      }
    } catch (error) {}
  }

  const format = (time) => {
    // 个位加0
    try {
      return time >= 10 ? time : '0' + time;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CountDown>
      {format(minute)}:{format(second)}
    </CountDown>
  );
};
