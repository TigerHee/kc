/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { _tHTML } from 'src/tools/i18n';
import logoSrc from 'static/ucenter/signUp/bouns_logo.svg';
import { useFormat } from '../../hooks/useFormat';
import { useCtx } from '../Context';

const Container = styled.div`
  display: flex;
  margin-top: 40px;
  padding-bottom: 40px;
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.cover12};
`;

const LayoutRight = styled.div`
  line-height: 0;
`;

const LayoutLeft = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 24px 0;
  flex: 1;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 150%;
  .row2 {
    display: inline-block;
    margin-top: 0;
  }
  .highlight {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Countdown = styled.div`
  display: flex;
  align-items: center;
`;

const Unit = styled.span`
  display: flex;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
`;

const Dot = styled(Unit)`
  padding: 0 8px;
  color: ${({ theme }) => theme.colors.text30};
  ::after {
    content: ':';
  }
`;

const Value = styled(Unit)`
  padding: 3px 8px;
  border-radius: 6px;
  align-items: flex-end;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  background: ${({ theme }) => theme.colors.cover2};
  color: ${({ theme }) => theme.colors.text};
  ::after {
    margin-left: 3px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    content: '${({ unit }) => unit}';
  }
`;

const padStart = (number, len, fill) => {
  return number.toString().padStart(len, fill);
};

const getCountdown = (deadline) => {
  const now = Date.now();
  if (deadline > now) {
    const days = Math.floor((deadline - now) / (24 * 60 * 60 * 1000));
    const duration = moment.duration(moment(deadline).diff(now));
    return {
      days: padStart(days, 2, '0'),
      hours: padStart(duration.hours(), 2, '0'),
      minutes: padStart(duration.minutes(), 2, '0'),
      seconds: padStart(duration.seconds(), 2, '0'),
      done: false,
    };
  } else {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      done: true,
    };
  }
};

// 倒计时小于一天，显示 时分秒
export const ONE_DAY = 24 * 60 * 60 * 1000;

export function NewcomerBonus() {
  const { config, taskList } = useCtx();
  const { totalRewardAmount: amount = 0, effectiveDays } = config || {};
  const { now = Date.now() } = taskList || {};
  const deadline = now + 1000 + ONE_DAY * effectiveDays;
  const [countdown, setCountdown] = useState(getCountdown(deadline));
  const timerRef = useRef(null);
  const { formatNum } = useFormat();

  useEffect(() => {
    setCountdown(getCountdown(deadline));
  }, [deadline]);

  useEffect(() => {
    if (!countdown.done) {
      timerRef.current = setTimeout(() => {
        setCountdown(getCountdown(deadline));
      }, 1000);
    }
    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [countdown]);

  if (!config) {
    return null;
  }

  return (
    <Container>
      <LayoutLeft>
        <Title>
          {_tHTML('ovfZ3U3zJEuq4C2Je5Yx1K', {
            amount: formatNum(amount, { interceptDigits: 2, maximumFractionDigits: 2 }),
            currency: window._BASE_CURRENCY_,
          })}
        </Title>
        <Countdown>
          <Value unit="D">{countdown.days}</Value>
          <Dot />
          <Value unit="H">{countdown.hours}</Value>
          <Dot />
          <Value unit="M">{countdown.minutes}</Value>
          <Dot />
          <Value unit="S">{countdown.seconds}</Value>
        </Countdown>
      </LayoutLeft>
      <LayoutRight>
        <img src={logoSrc} alt="Newcomer Bonus" />
      </LayoutRight>
    </Container>
  );
}
