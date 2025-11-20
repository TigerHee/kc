import { Button, Empty } from '@kux/design';
import { tenantConfig } from 'src/config/tenant';
import { _t, _tHTML } from 'src/tools/i18n';
import * as styles from './styles.module.scss';

export default function ResultFailed({ reason, onRetry }) {
  return (
    <div className={styles.content}>
      <Empty name="error" size="small" />
      <div className={styles.title}>{_t('43d7592551924000aa37')}</div>
      <div className={styles.reasons}>{reason}</div>
      <ul className={styles.helper}>
        <li>{_tHTML('965aec9aaa2c4000a18c', { url: tenantConfig.resetSecurity.supportUrl })}</li>
      </ul>
      <div className={styles.btnWrapper}>
        <Button type="primary" size="large" fullWidth onClick={onRetry}>
          {_t('e730df44e23a4000a5ec')}
        </Button>
      </div>
    </div>
  );
}
