/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Divider } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { css } from '@emotion/css';
import { formatSpanDuration } from 'Bot/helper';

const nowrap = css`
  white-space: nowrap;
`;
const RunTimes = ({ item }) => {
  return (
    <>
      <span className={nowrap}>{formatSpanDuration(item.startTimeDifference)}</span>
      <Divider type="vertical" />
      <span className={nowrap}>
        {_tHTML('card5', {
          num: item.dayArbitrageNum || 0,
          num2: item.totalArbitrageNum || 0,
        })}
      </span>
    </>
  );
};

export default RunTimes;
