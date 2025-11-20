/**
 * Owner: willen@kupotech.com
 */
import { getCurrentLang } from 'kc-next/boot';
import LinkFailed from 'static/account/linkfailed.svg';
import { _t } from '@/tools/i18n';
import styles from '../styled.module.scss';

const CodeError = () => {
  const currentLang = getCurrentLang();
  return (
    <div className={styles.containerWrapper} style={{ paddingTop: '80px' }}>
      <div className={styles.contentWrapper} style={{ alignItems: 'center' }}>
        <img className={styles.failedIcon} alt="failed-icon" src={LinkFailed} />
        <div className={styles.failedText}>{_t('link.failed')}</div>
      </div>
    </div>
  );
};

export default CodeError;
