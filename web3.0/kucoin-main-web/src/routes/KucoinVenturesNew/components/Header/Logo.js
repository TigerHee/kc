/**
 * Owner: will.wang@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import logo from 'static/ventures/light/logo.svg';
import darkLogo from 'static/ventures/dark/logo.svg';

const Logo = styled.img`
  object-fit: contain;
  width: 520px;
  height: 520px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 350px;
    height: 350px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 240px;
    height: 240px;
  }
`;

export default () => {
  const theme = useTheme();
  const src = theme.currentTheme === 'dark' ? darkLogo : logo;

  return <Logo src={src} alt='ventures logo' />;
};
