import { Divider, Empty } from '@kux/design';
import { _t } from 'src/tools/i18n';
import * as styles from './styles.module.scss';

export default function ResultVerifying() {
  return (
    <div className={styles.content}>
      <Empty name="wait" size="small" />
      <div className={styles.title}>{_t('psdn5kGQkt7YtnVnA2oDE3')}</div>
      <div className={styles.desc}>{_t('67f2f3c511e34000ac64')}</div>
      <Divider />
      <div className={styles.tips}>{_t('9c4a3aa4f0ce4000ae68')}</div>
    </div>
  );
}
