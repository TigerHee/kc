/**
 * Owner: will.wang@kupotech.com
 */
import useTranslation from '@/hooks/useTranslation';
import styles from './style.module.scss';
import Arrow from '@/assets/coinDetail/more-info-arrow.svg';
import clsx from 'clsx';

export default ({ onClick, reverse }) => {
  const { _t } = useTranslation();
  return (
    <div className={styles.moreBtn} onClick={onClick}>
      <span>{reverse ? _t('2MtbEAqscGgqLzj8Fze5Pk') : _t('eop6xmVZsrG9V5XScbioAS')}</span>{' '}
      <img className={clsx(styles.image, {
        [styles.reverse]: reverse,
      })} src={Arrow}  alt='arrow icon' />
    </div>
  );
};