/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import useLastTime, { formatCountDownTime } from 'src/components/$/MarketCommon/hooks/useLastTime';
import moment from 'moment';

const Wrapper = styled.div``;

function ScoreDownTime() {
  const { serverTime } = useSelector((state) => state.app);
  const lastTime = useLastTime({
    start: moment.utc(serverTime),
    end: moment.utc(serverTime).endOf('day'),
  });
  const { h, m, s } = formatCountDownTime(lastTime);

  useEffect(() => {
    if (lastTime <= 0) {
    }
  }, [lastTime]);

  return (
    <Wrapper>
      <span>{h}</span>:<span>{m}</span>:<span>{s}</span>后刷新分数
    </Wrapper>
  );
}

export default React.memo(ScoreDownTime);
