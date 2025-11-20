/**
 * Owner: ella.wang@kupotech.com
 */
import fingerDown from '@/assets/price/fingerDown.svg';
import fingerUp from '@/assets/price/fingerUp.svg';
import maskDown from '@/assets/price/maskDown.svg';
import maskUp from '@/assets/price/maskUp.svg';
import pk from '@/assets/price/pk.svg';
import styles from './NewContent.module.scss';
import useTranslation from '@/hooks/useTranslation';
import clsx from 'clsx';

export default ({ upOnClick, downOnClick }) => {
  const { _t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <button className={styles.leftBtn} onClick={upOnClick}>
        <div className={styles.upWrapper}>
          <img src={maskUp} alt="icon" />
        </div>
        <div className={styles.parallelism}>
          <div className={styles.text}>
            <img src={fingerUp} alt="up" />
            {_t('d9H68hcdjwVYsjCXmTrNK5')}
          </div>
        </div>
      </button>
      <canvas className={styles.canvas} id="thumsCanvas" width="200" height="400" style={{ width: 80, height: 160 }} />
      <img className={styles.maskPK} src={pk} alt="pk" />
      <button className={styles.rightBtn} onClick={downOnClick}>
        <div className={styles.rightParallelism}>
          <div className={clsx(styles.text, styles.textRight)}>
            <img src={fingerDown} alt="down" />
            {_t('9zoV7uMpnfaFg1YGQ9CNxd')}
          </div>
        </div>
        <div className={styles.downWrapper}>
          <img src={maskDown} alt="icon" />
        </div>
      </button>
    </div>
  );
};
