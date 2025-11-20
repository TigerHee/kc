/**
 * Owner: will.wang@kupotech.com
 */
import useTranslation from '@/hooks/useTranslation';
import styles from './Percent.module.scss';
import { toPercent } from '@/tools/helper';


export default ({ risePercent, fallPercent }) => {
  const { _t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftBtn} style={{ flex: (risePercent / fallPercent) === Infinity ? 5 : (risePercent / fallPercent) }}>
        <div className={styles.upWrapper}>
          <div className={styles.percentText}>
            <span>{_t('d9H68hcdjwVYsjCXmTrNK5')}</span>
            {toPercent(+risePercent)}
          </div>
        </div>
        <div className={styles.parallelism} />
      </div>
      <div className={styles.rightBtn}>
        <div className={styles.rightParallelism} />
        <div className={styles.downWrapper}>
          <div className={styles.percentTextRight}>
            <span>{_t('9zoV7uMpnfaFg1YGQ9CNxd')}</span>
            {toPercent(+fallPercent)}
          </div>
        </div>
      </div>
    </div>
  );
};