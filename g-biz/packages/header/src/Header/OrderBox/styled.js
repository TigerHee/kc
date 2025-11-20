import { styled, Accordion, Divider as CusDivider } from '@kux/mui';

import Link from '../../components/Link';

export const OverlayWrapper = styled('div')(
  ({ inDrawer, isLong_language, theme, inTrade }) => `
  width: ${inDrawer ? 'auto' : isLong_language ? '340px' : '320px'};
  margin-bottom: ${inDrawer ? '16px' : '0'};
  border-radius: 4px;
  padding: ${inDrawer ? '0' : '8px 0'};
  background: ${inDrawer ? 'transparent' : theme.colors.layer};
  box-shadow: ${inDrawer ? 'unset' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
  border-radius: ${inDrawer ? 'unset' : '20px'};
  max-height: calc(100vh - 100px);
  overflow: auto;
  margin-top: ${inDrawer ? '0px' : inTrade ? '14px' : '28px'};
  ${theme.breakpoints.down('xl')} {
    margin-top: ${inDrawer ? '0px' : inTrade ? '14px' : '22px'};
  }

  & .textIcon {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: ${inDrawer ? '0 16px 0 12px' : '0 16px 0 24px'};
    &.tradeIcon {
      width: 20px;
      height: 20px;
    }
    [dir='rtl'] & {
      margin: ${inDrawer ? '0 16px 0 12px' : '0 24px 0 16px'};
    }
  }
`,
);

export const MenuItem = styled(Link)(
  ({ inDrawer, theme }) => `
  display: flex;
  width: 100%;
  height: ${inDrawer ? '56px' : '48px'};
  align-items: center;
  cursor: pointer;
  color: ${inDrawer ? theme.colors.text60 : theme.colors.text};
  text-decoration: none !important;
  font-size: ${inDrawer ? '16px' : '14px'};
  position: relative;
  word-break: break-all;
  border-radius: ${inDrawer ? '8px' : 'unset'};
  &:hover {
    color: ${theme.colors.text};
    background: ${theme.colors.cover2};
  }
  @keyframes move {
    0% {
      right: 20px;
    }
    100% {
      right: 18px;
    }
  }

  @keyframes move-rtl {
    0% {
      left: 20px /*! @noflip */;
    }
    100% {
      left: 18px /*! @noflip */;
    }
  }

  @keyframes changeColor {
    0% {
      fill: #737e8d;
    }
    100% {
      fill: #18bb97;
    }
  }
  & .arrow {
    display: none;
  }
  &:hover .arrow {
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    animation: move 0.3s linear forwards;
    -webkit-animation: move 0.3s linear forwards;
    & path {
      animation: changeColor 0.3s linear forwards;
      -webkit-animation: changeColor 0.3s linear forwards;
    }
    [dir='rtl'] & {
      transform: rotate(180deg) translateY(50%);
      right: unset /*! @noflip */;
      left: 20px /*! @noflip */;
      animation: move-rtl 0.3s linear forwards;
      -webkit-animation: move-rtl 0.3s linear forwards;
    }
  }
`,
);

export const MenuItemText = styled.div`
  box-sizing: border-box;
  flex: 1;
  word-break: break-all;
  white-space: break-spaces;
  line-height: 20px;
  padding-right: 24px;
  font-weight: 500;
  [dir='rtl'] & {
    padding-right: 0;
    padding-left: 24px;
  }
`;

export const Divider = styled(CusDivider)`
  width: 85%;
  margin: ${(props) => (props.inDrawer ? '12px 24px' : '8px 24px')};
  background: ${(props) => props.theme.colors.divider4};
`;

export const CusAccordion = styled(Accordion)`
  .KuxAccordion-head {
    padding: 17.61px 12px;
    font-size: 16px;
    line-height: 130%;
    font-weight: 500;
    border-bottom: none;
    border-radius: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 17.61px 6px;
    }
    &:hover {
      background: ${(props) => props.theme.colors.cover2};
    }
  }
  .KuxAccordion-panel {
    padding: 0px;
  }
  .KuxAccordion-activeBg {
    left: 0;
    width: 0;
    background: transparent;
  }
`;

export const TextWrapper = styled.div`
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  & .arrow {
    margin: 2px 0px 0 4px;
    transition: all 0.3s ease;
  }
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    .arrow {
      transform: rotate(-180deg);
    }
  }
  ${(props) => props.theme.breakpoints.down('xl')} {
    font-size: 14px;
  }
`;
