/**
 * Owner: willen@kupotech.com
 */
import { getCurrentLang } from 'kc-next/boot';
import { Button, useTheme } from '@kux/mui';
import { noop as _noop } from 'lodash-es';
import freezingIconDark from 'static/account/freezing-new-dark.svg';
import freezingIcon from 'static/account/freezing-new.svg';
import { _t } from '@/tools/i18n';
import styles from './styled.module.scss';

interface ReviewFailProps {
  reason?: string;
  logout?: () => void;
  onApply?: () => void;
}

const ReviewFail = (props: ReviewFailProps) => {
  const { reason, logout = _noop } = props;
  const currentLang = getCurrentLang();
  const theme = useTheme();

  const handleApply = () => {
    props.onApply?.();
  };

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
        <div className={styles.error} style={{ marginTop: '13px' }}>
          {_t('unfreeze.failed')}
        </div>
        <div className={styles.error} style={{ marginTop: '8px' }}>
          {reason}
        </div>
      </div>
      <Button
        size="large"
        style={{ maxWidth: '280px', marginTop: '32px' }}
        type="primary"
        onClick={handleApply}
      >
        {_t('reapply.unfreeze')}
      </Button>
      <div className={styles.logOut} onClick={logout}>
        <span>{_t('logout')}</span>
      </div>
    </div>
  );
};

export default ReviewFail;
