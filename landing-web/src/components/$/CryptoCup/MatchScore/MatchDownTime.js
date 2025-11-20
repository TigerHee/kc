/**
 * Owner: tom@kupotech.com
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import useLastTime, { formatCountDownTime } from 'src/components/$/MarketCommon/hooks/useLastTime';
import { _tHTML } from 'utils/lang';
import useGetSelectedSeason from '../hooks/useGetSelectedSeason';

const Wrapper = styled.div``;

const StartTime = styled.div`
  & > span {
    > span {
      color: #2dc985;
    }
  }
`;

const EndTime = styled.div`
  height: 16px;
  font-size: 10px;
  color: #2dc985;
  & > span {
    display: flex;
    align-items: center;
    > span {
      margin: 0 4px 0 2px;
      width: 17px;
      height: 16px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 3px;
      font-weight: 500;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

function MatchDownTime() {
  const dispatch = useDispatch();
  const { serverTime } = useSelector(state => state.app);
  const { season, seasonBeginTime } = useGetSelectedSeason();
  const lastTime = useLastTime({
    start: serverTime,
    end: seasonBeginTime,
  });
  const { d, h, m, s } = formatCountDownTime(lastTime);

  useEffect(
    () => {
      if (lastTime <= 0) {
        // 倒计时结束，不做处理
      }
    },
    [lastTime, dispatch],
  );

  return (
    <Wrapper>
      <>
        {season?.status === 1 ? (
          <StartTime>{_tHTML('5eC1WG99ZWSYHznHUtXwBx', { d, h, m, s })}</StartTime>
        ) : null}
      </>

      <>
        {season?.status === 2 ? (
          <EndTime>{_tHTML('cryptoCup.match.end', { d, h, m, s })}</EndTime>
        ) : null}
      </>
    </Wrapper>
  );
}

export default React.memo(MatchDownTime);
