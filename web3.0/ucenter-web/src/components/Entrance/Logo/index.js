/**
 * Owner: willen@kupotech.com
 */

import { styled } from '@kux/mui';
import { Link } from 'components/Router';

const LogoImg = styled.img`
  height: 56px;
  width: auto;
  cursor: pointer;
  position: relative;
  left: -24px;
  z-index: 10;
`;

function Logo() {
  const backToHomeUrl = '/';
  return (
    <Link to={backToHomeUrl}>
      <LogoImg src={window._BRAND_LOGO_} alt="logo" />
    </Link>
  );
}

export default Logo;
