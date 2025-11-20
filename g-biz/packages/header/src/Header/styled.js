/**
 * Owner: iron@kupotech.com
 */
import { styled } from '@kux/mui';
import { CONTAINER_HEIGHT } from './config';

const Nav = styled.div`
  padding: 0 24px;
  transition: all 0.3s ease;
  ${(props) => props.theme.breakpoints.down('xl')} {
    padding: 0 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
  ${(props) =>
    props.inTrade && {
      padding: '0 24px',
    }}
`;
const NavBar = styled.div`
  display: flex;
  position: relative;
  flex: auto;
  width: 100%;
  height: 80px;
  margin: 0 auto;
  transition: all 0.3s ease;
  width: 100%;
  height: ${(props) => CONTAINER_HEIGHT[props.miniMode ? 'mini' : 'common'].max}px;
  justify-content: space-between;
  ${(props) => !props.inTrade && props.theme.breakpoints.down('sm')} {
    height: ${CONTAINER_HEIGHT.common.min}px;
  }
  ${(props) =>
    props.inTrade && {
      height: `${CONTAINER_HEIGHT.trade}px`,
    }}
`;
const Links = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;
const NavUserDom = styled.div`
  display: flex;
  align-items: center;
`;
const LogoLink = styled.a`
  display: flex;
  align-items: center;
  margin-right: 14px;
  [dir='rtl'] & {
    margin-right: 0px;
    margin-left: 14px;
  }
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImg = styled.img`
  width: 101px;
  transition: all 0.3s ease;
  ${(props) => props.theme.breakpoints.down('xl')} {
    width: 103.71px;
  }
  ${(props) =>
    props.inTrade && {
      width: '103.71px',
    }}
`;

const UnionBox = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex: 1;
  align-items: center;
  margin-left: 16px;
  margin-right: 16px;
  gap: 14px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 22px;
  font-weight: 600;
  line-height: 120%;
  overflow: hidden;

  span {
    text-overflow: ellipsis;
    overflow: hidden;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-left: 8px;
    gap: 8px;
    font-size: 20px;
  }
`;

const MenuBox = styled.div`
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  display: ${(props) => (props.status !== 0 ? 'flex' : 'none')};
  [dir='rtl'] & {
    margin-right: 12px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 14px;
  }
  &:hover {
    svg {
      fill: ${(props) => props.theme.colors.primary};
    }
  }
  ${(props) =>
    props.inTrade && {
      width: '32px',
      height: '32px',
    }}
`;
const NavLinks = styled.nav`
  height: 100%;
  margin-left: 14px;
`;

const NavLinksWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
`;

const Root = styled.header`
  position: relative;
  z-index: 100;
  width: 100%;
  & .logo {
    vertical-align: middle;
  }
`;

// 用于控制组件的上下左右「margin」距离
const MarginWrapper = styled.div`
  margin-top: ${(props) => props.mt || 0}px;
  margin-bottom: ${(props) => props.mb || 0}px;
  margin-left: ${(props) => props.ml || 0}px;
  margin-right: ${(props) => props.mr || 0}px;
`;

const HeaderNavLoadingMask = styled.div`
  height: 100%;
  width: calc(100% - 121px);
  min-width: 500px;
  background-color: ${(props) => props.theme.colors.overlay};
  transition: all 0.38s ease;
  position: absolute;
  z-index: 2;
  padding-left: 20px;
  ${(props) => props.theme.breakpoints.down('xl')} {
    padding-left: 0px;
  }
  margin-left: 121px;
  display: flex;
  align-items: center;
  column-gap: 20px;
`;

export {
  Nav,
  Links,
  NavUserDom,
  LogoLink,
  LogoImg,
  UnionBox,
  MenuBox,
  NavLinks,
  NavLinksWrapper,
  Root,
  NavBar,
  MarginWrapper,
  HeaderNavLoadingMask,
};
