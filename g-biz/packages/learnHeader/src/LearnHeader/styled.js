/**
 * Owner: iron@kupotech.com
 */
import { Divider, styled } from '@kux/mui';
import Link from '../components/Link';

const Nav = styled.div`
  padding: 0 16px;
`;
const Navbar = styled.div`
  width: 100%;
  height: 80px;
  margin: 0 auto;
  display: flex;
  @media screen and (max-width: 768px) {
    height: 60px;
  }
  position: relative;
  flex: auto;
  transition: all 0.3s;
`;
const Links = styled.div`
  display: flex;
  align-items: center;
`;
const NavUserDom = styled.div`
  display: flex;
  align-items: center;
`;
const LogoLink = styled.a`
  display: flex;
  align-items: center;
  min-width: 91px;
  & div {
    display: flex;
    align-items: center;
  }
  & img {
    margin-right: 0 !important;
  }
  &:hover {
    opacity: 0.6;
  }
`;
const MenuBox = styled.div`
  width: 50px;
  margin-left: 8px;
  height: 100%;
  align-items: center;
  display: ${(props) => (props.show ? 'flex' : 'none')};
`;
const NavLinks = styled.div`
  height: 100%;
  display: ${(props) => (props.show ? 'block' : 'none')};
`;

const MenuDivider = styled(Divider)`
  background: ${(props) => props.color};
`;

const Search = styled(Link)`
  color: inherit;
  display: flex;
  justify-content: center;
  align-items: center;
  [dir='rtl'] & {
    margin-left: 16px;
  }
`;

export { Nav, Navbar, Links, NavUserDom, LogoLink, MenuBox, NavLinks, MenuDivider, Search };
