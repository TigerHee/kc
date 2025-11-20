/**
 * Owner: tiger@kupotech.com
 */
import { bootConfig } from 'kc-next/boot';
import Link from '@/components/Router/Link';
import styles from './styles.module.scss';

function Logo() {
  const backToHomeUrl = '/';
  return (
    <Link to={backToHomeUrl}>
      <img className={styles.logoImg} src={bootConfig._BRAND_LOGO_} alt="logo" />
    </Link>
  );
}

export default Logo;
