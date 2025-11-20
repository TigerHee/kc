/**
 * Owner: mcqueen@kupotech.com
 */
import { ICStickOutlined } from '@kux/icons';
import { Button } from '@kux/mui-next';
import { throttle } from 'lodash';
import { useEffect, useState } from 'react';
import { useRouter } from 'kc-next/compat/router';
import { useCategoriesStore } from '@/store/categories';
import { trackClick } from 'gbiz-next/sensors';
import styles from './Share/index.module.scss';

export default () => {
  const router = useRouter();
  const coin = router?.query.coin;

  const [visible, setVisible] = useState(false);
  const coinDict = useCategoriesStore((state) => state.coinDict);
  const coinObj = coin ? coinDict[coin as string] : null;

  const scrollTop = () => {
    trackClick(['Return', '1'], { symbol: coinObj?.currencyName || coin });

    document.body.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const onScroll = throttle(() => {
      const top = document.documentElement.scrollTop;
      if (typeof window !== 'undefined' && top >= 2 * window.innerHeight) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }, 200);

    typeof window !== 'undefined' && window.addEventListener('scroll', onScroll);
    return () => {
      typeof window !== 'undefined' && window.removeEventListener('scroll', onScroll);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Button className={styles.buttonWrapper} variant="text" onClick={scrollTop}>
      <ICStickOutlined size="16" color="#1D1D1D" />
    </Button>
  );
};
