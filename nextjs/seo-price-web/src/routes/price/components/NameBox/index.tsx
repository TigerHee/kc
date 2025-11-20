/**
 * Owner: mage.tai@kupotech.com
 */
import { Avatar, useTheme } from '@kux/mui-next';
import useScreen from 'src/hooks/useScreen';
import styles from './style.module.scss';
import clsx from 'clsx';

import coinSrc from '@/assets/price/coinicon-default.svg';

const NameBox = ({ iconUrl, fullName, code, isInTable = false, href, ...others }: any) => {
  const theme = useTheme();
  const { isH5 } = useScreen();

  const content = (
    <>
      <div className={clsx(styles.avatar, styles["KuxAvatar-circle"])}>
        <img width={24} height={24} src={iconUrl || coinSrc} alt='coin logo' />
      </div>
      <div className={styles.nameBlock} data-isintable={isInTable}>
        <span className={styles.fullName} data-isintable={isInTable}>
          {fullName}
        </span>
        <span className={styles.coinCode} data-isintable={isInTable}>
          {code}
        </span>
      </div>
    </>
  )

  if (isInTable) {
    return (
      <div className={styles.wrapNameBox} data-isintable={isInTable} {...others}>
        <div className={clsx(styles.avatar, styles["KuxAvatar-circle"])}>
          <img width={24} height={24} src={iconUrl || coinSrc} alt='coin logo' />
        </div>
        <div className={styles.nameBlock} data-isintable={isInTable}>
          <span className={styles.fullName} data-isintable={isInTable}>
            {fullName}
          </span>
          <span className={styles.coinCode} data-isintable={isInTable}>
            {code}
          </span>
        </div>
      </div>
    )
  }

  return (
    <a className={styles.wrapNameBox} data-isintable={isInTable} href={href} {...others}>
      {content}
    </a>
  );
};

export default NameBox;