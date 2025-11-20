/**
 * Owner: jessie@kupotech.com
 */
import { useCountDown } from 'ahooks';
import { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import { transformTimeStr } from 'TradeActivity/utils';
import { ActivityTimeWrapper, CountdownWrapper, StyledTimer } from './styledComponents';

export const CoutdwonWithBtn = memo(({ date, status, countDownLabel }) => {
  const dispatch = useDispatch();

  const handleDataList = useCallback(() => {
    dispatch({
      type: 'rocketZone/pullGemspaceOngoingGem',
    });
  }, [dispatch]);

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
    onEnd: handleDataList,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountdownWrapper>
      {countDownLabel}
      <span className="timeCounter">
        {!!days && (
          <>
            <span className="item">{transformTimeStr(days)}</span>
            <span className="split">:</span>
          </>
        )}
        <span className="item">{transformTimeStr(hours)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(minutes)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(seconds)}</span>
      </span>
    </CountdownWrapper>
  );
});

export const CountDown = memo(({ date }) => {
  const dispatch = useDispatch();

  const handleDataList = useCallback(() => {
    dispatch({
      type: 'rocketZone/pullGemspaceOngoingGem',
    });
  }, [dispatch]);

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
    onEnd: handleDataList,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return useMemo(() => {
    return (
      <StyledTimer>
        <div className="item">
          <div className="time">{transformTimeStr(days)}</div>
          <div className="unit">D</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(hours)}</div>
          <div className="unit">H</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(minutes)}</div>
          <div className="unit">M</div>
        </div>
        <div className="item">
          <div className="time">{transformTimeStr(seconds)}</div>
          <div className="unit">S</div>
        </div>
      </StyledTimer>
    );
  }, [days, hours, minutes, seconds]);
});

const CountDownComp = memo(({ startDate, endDate, status, withInButton = false, typeName }) => {
  const countDownLabel = useMemo(() => {
    if (typeName === 'gemPreMarket') {
      if (status === 0) {
        return _t('8583a5a3d34b4000acd8');
      } else if (status === 1) {
        return _t('9daa36bfc6ce4000ace0');
      } else if (status === 3) {
        return _t('80b2cd51a04d4000a62d');
      }
    }

    return status === 0 ? _t('8583a5a3d34b4000acd8') : _t('9daa36bfc6ce4000ace0');
  }, [typeName, status]);

  // 不显示倒计时（已结束 ｜ 待交割（premarket status === 2） ｜未开始但没有开始时间 ｜ 进行中但没有结束时间）
  if (status === 2 || (status === 0 && !startDate) || (status === 1 && !endDate)) {
    return null;
  }

  if (withInButton) {
    return (
      <div className="timeCount">
        <CoutdwonWithBtn
          status={status}
          date={status === 0 ? startDate : endDate}
          countDownLabel={countDownLabel}
        />
      </div>
    );
  }

  return (
    <ActivityTimeWrapper>
      <div className="label">{countDownLabel}</div>
      <CountDown date={status === 0 ? startDate : endDate} />
    </ActivityTimeWrapper>
  );
});

export default CountDownComp;
