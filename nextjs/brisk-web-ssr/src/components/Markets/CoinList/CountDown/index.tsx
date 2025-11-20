import { useEffect, useState } from 'react';
import useInterval from '@/hooks/useInterval';
import useTranslation from '@/hooks/useTranslation';
import styles from './styles.module.scss';

const getTime = s => {
  if (s <= 0) return [0, 0, 0];
  const h = Math.floor(s / 3600); // 小时
  s %= 3600;
  const m = Math.floor(s / 60); // 分钟
  s %= 60; // 秒
  return [h, m, s];
};

const CountDown = ({ seconds }) => {
  const { Trans } = useTranslation();

  const [time, setTime] = useState(seconds);

  useEffect(() => {
    setTime(seconds);
  }, [seconds]);

  const clear = useInterval(() => {
    if (time > 0) {
      setTime(time - 1);
    } else {
      clear();
    }
  }, 1000);

  const times = getTime(time).map(el => String(el).padStart(2, '0'));

  return (
    <div className={styles.countdown}>
      <div>
        <Trans i18nKey="sEfuzzRAmUmJ4FWdpHRid9" values={{ HH: times[0] }} components={{ span: <span /> }} />
      </div>
      <div>
        <Trans i18nKey="3H9htVrpi46bL2tpACZHjm" values={{ mm: times[1] }} components={{ span: <span /> }} />
      </div>
      <div>
        <Trans i18nKey="sRu7n3kqwscrAJTakoebws" values={{ ss: times[2] }} components={{ span: <span /> }} />
      </div>
    </div>
  );
};

export default CountDown;
