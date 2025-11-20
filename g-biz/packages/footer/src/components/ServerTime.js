/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme, css } from '@kux/mui';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { tenantConfig } from '../tenantConfig';

import { namespace } from '../model';

dayjs.extend(utc);
dayjs.extend(customParseFormat);
const { setInterval, clearInterval } = window;
let interval;

const useStyle = ({ theme }) => {
  return {
    date: css({
      marginRight: 42,
      color: theme.colors.text40,
      fontSize: 14,
      lineHeight: '130%',
      [theme.breakpoints.down('sm')]: {
        fontSize: 12,
      },
    }),
  };
};

export default function ServerTime() {
  const { serverTime } = useSelector((state) => state[namespace]);
  const [countDown, setCountDown] = useState(0);
  const theme = useTheme();
  const styles = useStyle({ theme });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: `${namespace}/pullServerTime@polling` });

    return () => {
      dispatch({ type: `${namespace}/pullServerTime@polling:cancel` });
    };
  }, []);

  useEffect(() => {
    setCountDown(serverTime);
    interval = setInterval(() => {
      setCountDown((countDown) => countDown + 1000);
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, [serverTime]);

  if (countDown < 1 || serverTime < 1) {
    return null;
  }

  return (
    <div css={styles.date}>
      {dayjs(countDown)
        .utc()
        .utcOffset(tenantConfig.utcOffset)
        .format('YYYY-MM-DD HH:mm:ss')}
      &nbsp;&nbsp;(UTC+{tenantConfig.utcOffset})
    </div>
  );
}
