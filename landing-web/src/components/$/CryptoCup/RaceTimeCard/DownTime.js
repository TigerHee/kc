/*
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { _t, _tHTML } from 'src/utils/lang';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import useLastTime, { formatCountDownTime } from 'src/components/$/MarketCommon/hooks/useLastTime';
import useGetTimeInfo from '../hooks/useGetTimeInfo';
import { isLongTextLang } from '../config';

const Wrapper = styled.div`
  line-height: 16px;
  font-size: 10px;
  color: #2dc985;
`;

const TimeColon = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 32px;
  width: auto;
  color: rgba(0, 13, 29, 0.68);

  > span {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: ${props => (props.isSmall ? '14px' : 'unset')};
  }

  > span > span {
    background: #f4fefc;
    border-radius: 4px;
    width: 28px;
    height: 32px;
    font-weight: 700;
    font-size: 18px;
    line-height: 23px;
    color: #2dc985;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px;
  }
`;

function DownTime() {
  const dispatch = useDispatch();
  const { serverTime } = useSelector(state => state.app);
  const currentLang = useSelector(state => state.app.currentLang);
  const isSmall = isLongTextLang.includes(currentLang);
  const { beginTime, status: seasonStatus } = useGetTimeInfo();
  const lastTime = useLastTime({
    start: serverTime,
    end: beginTime,
  });

  const { d, h, m, s } = formatCountDownTime(lastTime);

  useEffect(
    () => {
      if (lastTime <= 0) {
        // 倒计时结束，不做处理
        //  倒计时为零，重新获取活动信息
        // dispatch({
        //   type: 'cryptoCup/getCampaigns',
        //   payload: { name: 'sjb' },
        // });
      }
    },
    [lastTime, dispatch],
  );

  return (
    <Wrapper>
      <>
        {seasonStatus === 1 ? (
          <TimeColon isSmall={isSmall}>
            {/* <span>{d}</span>天 <span>{h}</span>时 <span>{m}</span>分 <span>{s}</span>秒 后开始 */}
            <>
              {_tHTML('5eC1WG99ZWSYHznHUtXwBx', {
                d,
                h,
                m,
                s,
              })}
            </>
          </TimeColon>
        ) : null}
      </>
      <>
        {seasonStatus === 2 ? (
          <TimeColon isSmall={isSmall}>
            <>
              {_tHTML('63N9kMTE4iad7dyQAmuZFF', {
                d,
                h,
                m,
                s,
              })}
            </>
            {/* <span>{d}</span>天 <span>{h}</span>时 <span>{m}</span>分 <span>{s}</span>秒 后结束 */}
          </TimeColon>
        ) : null}
      </>
    </Wrapper>
  );
}

export default React.memo(DownTime);
