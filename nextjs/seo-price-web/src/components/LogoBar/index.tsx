/**
 * Owner: will.wang@kupotech.com
 */
import Image from "next/image";
import styles from './styles.module.scss';
import Logo from '@/assets/price/logo.svg';

export default () => {
  const IS_KC_SITE = typeof window !== 'undefined' && window._BRAND_SITE_ === 'KC';
  return (
    IS_KC_SITE && (
      <div className={styles.logoWrapper}>
        <Image src={Logo} alt="logo" width={10} height={10} />
      </div>
    )
  );
};