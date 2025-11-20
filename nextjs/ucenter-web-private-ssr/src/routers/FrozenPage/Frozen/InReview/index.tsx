/**
 * Owner: willen@kupotech.com
 */
import { getCurrentLang } from 'kc-next/boot';
import { useTheme } from '@kux/mui';
import { noop as _noop } from 'lodash-es';
import freezingIconDark from 'static/account/freezing-new-dark.svg';
import freezingIcon from 'static/account/freezing-new.svg';
import { _t } from '@/tools/i18n';
import styles from './styled.module.scss';

interface InReviewProps {
  logout?: () => void;
}

export default ({ logout = _noop }: InReviewProps) => {
  const currentLang = getCurrentLang();
  const theme = useTheme();
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <img
          src={theme.currentTheme === 'light' ? freezingIcon : freezingIconDark}
          alt="freezing-icon"
        />
      </div>
      <div style={{ marginTop: '32px' }}>
        <div className={styles.title}>{_t('osQ4aYcG6fazfTLcst7jDu')}</div>
        <div className={styles.desc}>{_t('application.submited')}</div>
      </div>
      <div className={styles.logOut} onClick={logout}>
        <span>{_t('logout')}</span>
      </div>
    </div>
  );
};
