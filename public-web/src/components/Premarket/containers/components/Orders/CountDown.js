/**
 * Owner: june.lee@kupotech.com
 */

import { styled } from '@kux/mui';
import { useCountDown } from 'ahooks';
import { memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { transformTimeStr } from 'src/components/TradeActivity/utils';

export const StyledTimer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  div.item {
    display: flex;
    align-items: center;
    &:not(:last-of-type) {
      margin-right: 16px;
    }

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 48px;
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
      font-size: 20px;
      line-height: 130%;
      background: linear-gradient(
        to bottom,
        ${(props) => props.theme.colors.cover4} 0px,
        ${(props) => props.theme.colors.cover4} 23px,
        ${(props) => props.theme.colors.cover8} 24px,
        ${(props) => props.theme.colors.overlay} 25px,
        ${(props) => props.theme.colors.overlay} 48px
      );
      border-radius: 4px;
      box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.12);
    }

    .unit {
      color: ${(props) => props.theme.colors.text40};
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: column;

      .time {
        margin-right: 0;
      }

      .unit {
        margin-top: 6px;
      }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
      &:not(:last-of-type) {
        margin-right: 24px;
      }
      .time {
        margin-right: 6px;
        font-size: 24px;
      }

      .unit {
        margin-top: 0;
      }
    }
  }
`;

export const CountDown = memo(({ date, onEnd }) => {
  const dispatch = useDispatch();

  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
    onEnd,
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
