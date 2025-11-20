import { styled, Accordion, Divider as CusDivider, css, Dropdown, keyframes } from '@kux/mui';
import Link from '../../components/Link';

export const NavWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: ${(props) => (props.inDrawer ? 'column' : 'row')};
`;

export const Ul = styled.ul`
  height: 100%;
  display: flex;
  align-items: center;
  margin: 0px;
  padding: 0px;
  list-style: none;
  flex-direction: ${(props) => (props.inDrawer ? 'column' : 'row')};
  & > li {
    height: 100%;
  }
  & > li > div {
    height: 100%;
  }
  & > *:last-child > div > a {
    margin-right: 0;
  }
  & > *:last-child {
    margin-right: 0;
  }
  [dir='rtl'] & > *:last-child {
    margin-right: 15px;
  }
`;

export const NewBieBox = styled.div`
  display: flex;
  align-items: center;
`;

export const NavItem = (props) => css`
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  width: ${props.inDrawer ? '100%' : 'auto'};
  padding: ${props.inDrawer ? '15.5px 12px' : '0'};
  margin-right: ${props.inDrawer ? 0 : '20px'};
  font-size: 14px;
  color: ${props.theme.colors.text};
  cursor: pointer;
  text-decoration: none !important;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
  ${props.theme.breakpoints.down('xl')} {
    font-size: ${props.inDrawer ? '16px' : '14px'};
  }
  ${props.inTrade && {
    fontSize: '14px',
  }}
  ${props.theme.breakpoints.down('sm')} {
    padding: ${props.inDrawer ? '15.5px 6px' : '0'};
  }
  & .arrowIcon {
    margin-left: 4px;
    margin-top: 1px;
    transition: all 0.3s ease;
  }

  [dir='rtl'] & .arrowIcon {
    margin-left: unset;
    margin-right: 4px;
    transform: rotate(0);
  }

  &:hover {
    color: ${props.inDrawer ? props.theme.colors.text : props.theme.colors.primary};
    background: ${props.inDrawer ? props.theme.colors.cover2 : ''};
    border-radius: ${props.inDrawer ? '8px' : 0};
  }
  &:hover .arrowIcon {
    transform: rotate(-180deg);
  }
  & .stressNav {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    color: #efa842;
    transform: scale(1) translateX(-50%);
    transform-origin: left;
    position: absolute;
    left: 50%;
    top: -17px;
    width: 100%;
    text-align: center;
    white-space: nowrap;
  }
  & .stressImg {
    height: 16px;
    width: 16px;
    position: absolute;
    right: -3px;
    top: -15px;
    object-fit: contain;
  }
  & .oneImg {
    right: 8px;
    top: -14px;
  }
  & .oneNav {
    top: -14px;
  }

  & .newTagNav {
    width: ${props.inDrawer ? '24px' : '22px'};
    height: ${props.inDrawer ? '14px' : '12px'};
    background: linear-gradient(103deg, #48d800 1.93%, #00b98a 98.71%);
    border-radius: 3px;
    font-weight: 600;
    color: #fff;
    justify-content: center;
    align-items: center;
    display: flex;
    position: absolute;
    position: ${props.inDrawer ? 'static' : 'absolute'};
    top: 50%;
    margin-top: ${props.inDrawer ? '0' : '-13px'};
    transform: ${props.inDrawer ? 'unset' : 'translateY(-50%)'};
    right: -12px;
    margin-left: ${props.inDrawer ? '2px' : 0};
    [dir='rtl'] & {
      margin-right: ${props.inDrawer ? '2px' : 0};
      left: -12px;
      right: unset;
    }
    span {
      font-size: 12px;
      line-height: 1;
      transform: ${props.inDrawer ? 'scale(0.75)' : 'scale(0.68)'};
    }
  }

  span.tr {
    color: #f8b200;
    margin-left: 0.3em;
  }
`;

export const OverlayWrapper = styled.div`
  width: ${(props) => (props.inDrawer ? '100%' : 'unset')};
  display: ${(props) => (props.inDrawer ? 'block' : 'flex')};
  margin-top: 0;
  background: ${(props) => props.theme.colors.layer};
  box-shadow: ${(props) => (props.inDrawer ? 'none' : '0px 10px 60px rgba(0, 0, 0, 0.1)')};
  border-radius: ${(props) => (props.inDrawer ? 0 : '20px')};
  max-height: calc(100vh - 100px);
  overflow: auto;
`;

export const OverlayList = styled.div`
  width: ${(props) => (props.inDrawer ? '100%' : '340px')};
  padding-top: ${(props) => (props.inDrawer ? '0' : '12px')};
  padding-bottom: ${(props) => (props.inDrawer ? '0' : '12px')};
  display: flex;
  flex-direction: column;
  & > div {
    width: 100%;
    margin-bottom: 8px;
  }
  & > div > .KuxDropDown-popper {
    transform: translate(338px, 0px) !important;
    [dir='rtl'] & {
      transform: translate(-315px, 0px) !important;
    }
  }
  .KuxDropDown-trigger {
    width: 100%;
  }
`;

export const GrounpDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const GrounpName = styled.div`
  font-weight: 400;
  font-size: ${(props) => (props.inDrawer ? '12px' : '14px')};
  line-height: 130%;
  color: ${(props) => (props.inDrawer ? props.theme.colors.text30 : props.theme.colors.text40)};
  padding: ${(props) => (props.inDrawer ? '8px 16px' : '16px 16px 8px')};
`;

export const LinkMenuItemWapper = styled.div`
  padding-left: ${(props) => (props.inDrawer ? '0' : '12px')};
  padding-right: ${(props) => (props.inDrawer ? '0' : '12px')};
`;

export const MenuItem = styled(Link)(
  ({ inDrawer, theme }) => `
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: ${inDrawer ? '16px 12px' : '12px'};
  margin-bottom: ${inDrawer ? '0px' : '8px'};
  border-radius: ${inDrawer ? '8px' : '12px'};
  color: ${inDrawer ? theme.colors.text60 : theme.colors.text};
  &:last-of-type {
    margin-bottom: 0;
  }
  [dir='rtl'] & {
    padding: ${inDrawer ? '9px 16px' : '12px'};
  }
  cursor: pointer;
  text-decoration: none !important;
  &:hover {
    background: ${theme.colors.cover2};
    color: ${theme.colors.text};
  }
  & .arrow {
    visibility: hidden;
    position: absolute;
    opacity: 0;
    top: 50%;
    margin-top: -10px;
    right: 12px;
    transform: translateX(-10px);
    transition: all .2s ease;
  }
  &:hover .arrow {
    visibility: visible;
    transform: translateX(0);
    fill: ${theme.colors.icon};
    opacity: 0.4;
    [dir='rtl'] & {
      left: 0;
      right: unset;
      transform-origin: center center;
      transform: rotate(180deg);
    }
  }
  & .menuItemIcon {
    width: ${inDrawer ? '28px' : '36px'};
    height: ${inDrawer ? '28px' : '36px'};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${inDrawer ? '12px' : '16px'};
    border-radius: 4px;
    overflow: hidden;
    & img {
      width: ${inDrawer ? '28px' : '36px'};
      height: ${inDrawer ? '28px' : '36px'};
      object-fit: contain;
    }

    [dir='rtl'] & {
      margin-right: 0;
      margin-left: 16px;
    }
  }
  & .menuItemBox {
    flex: 1;
    height: unset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    & .menuItemTitle {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-weight: 500;
      font-size: 16px;
      line-height: 130%;
      position: relative;
      svg.arrow {
        display: ${inDrawer ? 'none' : 'unset'};
      }
      & .menuItemName {
        max-width: 176px;
      }
      & .menuItemIcons {
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        max-width: 176px;
      }
      & .visaIcon {
        height: 12px;
        margin-left: 8px;
      }
      & .flag {
        border-radius: 2px;
        background: #29cd97;
        color: #ffffff;
        font-size: 12px;
        padding: 0 4px;
        height: 16px;
        line-height: 16px;
        position: relative;
        left: 6px;
        transform-origin: left;
        display: inline-block;
        margin-right: 6px;
        word-break: normal;
        min-width: 20px;
        align-items: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        [dir='rtl'] & {
          left: 0;
          right: 6px;
          margin-right: 0;
          margin-left: 6px;
        }
      }
      & .stress {
        background: linear-gradient(180deg, #edb66e 0%, #fff070 100%);
        border-radius: 2px;
        max-width: 112px;
        font-size: 12px;
        color: #01081e;
        padding: 3px 4px;
        min-height: 20px;
        line-height: 14px;
        position: relative;
        left: 10px;
        transform-origin: left;
        display: inline-block;
        word-break: normal;

        [dir='rtl'] & {
          left: 0;
          right: 10px;
        }
      }
      & .stressIcon {
        height: 20px;
        position: relative;
        left: 4px;
        display: inline-block;
        object-fit: contain;

        [dir='rtl'] & {
          left: 0;
          right: 4px;
        }
      }
    }
    & .menuItemSubTitle {
      padding-right: ${inDrawer ? 0 : '20px'};
      color: ${inDrawer ? '#00142A' : theme.colors.text};
      opacity: 0.4;
      font-size: 12px;
      line-height: 130%;
      margin-top: 2px;
      [dir='rtl'] & {
        padding-right: unset;
        padding-left: ${inDrawer ? 0 : '20px'};
      }
    }
  }
`,
);

export const Newbie = (props) => css`
  height: 28px;
  margin-right: 20px;
  padding: 0 10px;

  display: flex;
  /* display: ${props.navStatus < 2 ? 'flex' : 'none'}; */
  align-items: center;
  justify-content: center;
  font-size: 14px;
  line-height: 130%;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  color: ${props.theme.colors.primary};
  background: ${props.theme.colors.primary8};
  max-width: 120px;
  ${props.navStatus >= 2 &&
  css`
      padding: 0;
      width: 28px;
      justify-content: center;
      border-radius: 14px;
    `}
  span.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CusAccordion = styled(Accordion)`
  .KuxAccordion-head {
    padding: 18px 12px;
    font-size: 16px;
    line-height: 130%;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text};
    border-radius: 8px;
    &:hover {
      background: ${(props) => props.theme.colors.cover2};
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 18px 6px;
    }
  }
  .KuxAccordion-panel {
    padding: 0;
  }
  .KuxAccordion-activeBg {
    left: 0;
    width: 0;
    background: transparent;
  }
`;

export const Divider = styled(CusDivider)`
  width: 1px;
  height: 16px !important;
  margin: 0 20px 0 18px;
  [dir='rtl'] & {
    margin: 0 18px 0 20px;
  }
`;

export const BlankNav = styled.div`
  height: 100%;
  width: ${(props) => (props.inDrawer ? '100%' : 'auto')};
  padding: ${(props) => (props.inDrawer ? '10px 16px' : '0')};
  margin-right: 20px;
  font-size: ${(props) => (props.inDrawer ? `14px` : `16px`)};
  color: ${(props) => props.theme.colors.text};
  text-decoration: none !important;
  font-weight: 500;
  white-space: nowrap;
`;

const ContentZoomIn = keyframes`
  0% {
    transform: translateX(-4px);
  }
  100% {
    transform: translateX(0);
  }
`;

const ContentZoomOut = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-4px);
  }
`;

export const CusDropdown = styled(Dropdown)`
  .__AnimateTradeList__ {
    animation-duration: ${(props) => (props.visible ? 0.26 : 0.23)}s;
    animation-timing-function: bezier-curve(0.2, 0, 0, 1);
    animation-name: ${(props) => (props.visible ? ContentZoomIn : ContentZoomOut)};
    animation-fill-mode: forwards;
  }
`;
