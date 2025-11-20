/**
 * Owner: willen@kupotech.com
 */

import { useLocale } from '@kucoin-base/i18n';
import { Link } from 'components/Router';
import LogoPool from 'static/global/logo-pool.svg';
import LogoNewcomerEn from 'static/newcomer/logo-en.svg';
import formatUrlWithLang from 'utils/formatUrlWithLang';
import { useQueryParams } from '../hookTool';

function getLogoSrc(currentLang, isPoolx) {
  if (isPoolx) {
    return LogoPool;
  }
  return LogoNewcomerEn;
}

function Logo() {
  const { currentLang } = useLocale();
  const { isPoolx } = useQueryParams();
  const logoSrc = getLogoSrc(currentLang, isPoolx);
  const backToHomeUrl = isPoolx ? formatUrlWithLang('https://pool-x.io') : '/';
  const imgStyle = {
    height: '56px',
    width: 'auto',
    cursor: 'pointer',
    position: 'relative',
    left: '-24px',
    zIndex: 10,
  };
  return (
    <Link to={backToHomeUrl}>
      <img src={logoSrc} style={imgStyle} alt="" />
    </Link>
  );
}

export default Logo;
