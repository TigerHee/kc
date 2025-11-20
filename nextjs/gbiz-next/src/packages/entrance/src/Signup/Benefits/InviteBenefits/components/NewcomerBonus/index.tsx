/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Trans } from 'tools/i18n';
import { bootConfig } from 'kc-next/boot';
import logoSrc from '../../../../../../static/bouns_logo.svg';
import { useFormat } from '../../hooks/useFormat';
import { useInviteBenefits } from '../../store';
import styles from './index.module.scss';

const padStart = (number: number, len: number, fill: string) => number.toString().padStart(len, fill);

const getCountdown = (deadline: number) => {
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
  }
  return { days: '00', hours: '00', minutes: '00', seconds: '00', done: true };
};

export const ONE_DAY = 24 * 60 * 60 * 1000;

export function NewcomerBonus() {
  const config = useInviteBenefits().config;
  const taskList = useInviteBenefits().taskList;
  const { totalRewardAmount: amount = 0, effectiveDays } = (config as any) || {};
  const { now = Date.now() } = (taskList as any) || {};
  const deadline = now + 1000 + ONE_DAY * (effectiveDays || 0);
  const [countdown, setCountdown] = useState(getCountdown(deadline));
  const timerRef = useRef<any>(null);
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

  if (!config) return null;

  return (
    <div className={styles.container}>
      <div className={styles.layoutLeft}>
        <div className={styles.title}>
          <Trans
            i18nKey="ovfZ3U3zJEuq4C2Je5Yx1K"
            ns="entrance"
            values={{
              amount: formatNum(amount, { interceptDigits: 2, maximumFractionDigits: 2 }),
              currency: bootConfig._BASE_CURRENCY_,
            }}
            components={{
              div1: <div />,
              div2: <div className="row2" />,
              span3: <span className="highlight" />,
            }}
          />
        </div>
        <div className={styles.countdown}>
          <span className={styles.value} data-unit="D">
            {countdown.days}
          </span>
          <span className={styles.dot} />
          <span className={styles.value} data-unit="H">
            {countdown.hours}
          </span>
          <span className={styles.dot} />
          <span className={styles.value} data-unit="M">
            {countdown.minutes}
          </span>
          <span className={styles.dot} />
          <span className={styles.value} data-unit="S">
            {countdown.seconds}
          </span>
        </div>
      </div>
      <div className={styles.layoutRight}>
        <img src={logoSrc} alt="Newcomer Bonus" />
      </div>
    </div>
  );
}

export default NewcomerBonus;
