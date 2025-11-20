/**
 * Owner: will.wang@kupotech.com
*/
import useTranslation from '@/hooks/useTranslation';
import styles from './style.module.scss';

const Header = () => {
  const { _t } = useTranslation()

  return (
    <div className={styles.priceAllHeader} data-inspector="inspector_header">
      <div className={styles.headingWrap}>
        <h1 className={styles.headingTitle}>{_t('vkKn6Tn3LhGJRCXaBrMHVp')}</h1>
        <h2 className={styles.headingText}>{_t('nGuZq9ndd7dV7ou3vQE9JL')}</h2>
      </div>
    </div>
  );
};

export default Header;