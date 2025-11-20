/**
 * Owner: mage.tai@kupotech.com
 */
import { Button, useTheme } from '@kux/mui-next';
import { trackClick } from 'gbiz-next/sensors';
import { useCallback } from 'react';
// import { ReactComponent as RegisterIcon } from '@/assets/price/register.svg';
import RegisterIcon from '@/assets/price/register.svg'; 
import styles from './style.module.scss';
import useTranslation from '@/hooks/useTranslation';

const RegisterCard = () => {
  const { _t } = useTranslation();
  
  const signHandle = useCallback((e) => {
    trackClick(['BScoinDetail', ['InRegistration', '1']]);
    // if (!md) {
      window.location.href = '/ucenter/signin';
    // } else {
      // TODO 展示登录弹窗
      // dispatch({ type: 'entranceDrawer/update', payload: { loginOpen: true } });
    // }
  }, []);

  return (
    <section className={styles.wrapper}>
      <header className={styles.textIcon}>
        <div className={styles.iconWrapper}>
          <img src={RegisterIcon} />
        </div>
        <h2 className={styles.words}>{_t('3XFnxZenmhUFuWanCjgsze')}</h2>
      </header>
      <Button onClick={signHandle} size="large">
        {_t('heMN4P2owjZYR9CDYWvjHk')}
      </Button>
    </section>
  );
};

export default RegisterCard;