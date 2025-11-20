import { styled, Tooltip as CusTooltip, Accordion } from '@kux/mui';

import Link from '../../components/Link';

export const OverlayWrapper = styled('div')(
  ({ inDrawer, isLong_language, theme, inTrade }) => `
  width: ${inDrawer ? 'auto' : isLong_language ? '340px' : '320px'};
  margin-bottom: ${inDrawer ? '12px' : '0'};
  padding: ${inDrawer ? '0' : '0 0 16px'};
  background: ${inDrawer ? 'transparent' : theme.colors.layer};
  box-shadow: ${inDrawer ? 'unset' : '0px 10px 60px rgba(0, 0, 0, 0.1)'};
  border-radius: ${inDrawer ? 'unset' : '20px'};
  overflow: auto;
  margin-top: ${inDrawer ? '0px' : inTrade ? '14px' : '28px'};
  ${theme.breakpoints.down('xl')} {
    margin-top: ${inDrawer ? '0px' : inTrade ? '14px' : '22px'};
  }

  & hr {
    margin: 8px 28px;
  }
  & .textIcon {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 16px;
    [dir='rtl'] & {
      margin-right: 0;
      margin-left: 16px;
    }
  }
`,
);

export const MenuItem = styled(Link)`
  display: flex;
  width: 100%;
  height: ${(props) => (props.inDrawer ? '56px' : '48px')};
  padding: ${(props) => (props.inDrawer ? '0 12px' : `0 24px`)};
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: ${(props) => (props.inDrawer ? props.theme.colors.text60 : props.theme.colors.text)};
  text-decoration: none !important;
  font-size: ${(props) => (props.inDrawer ? '16px' : '14px')};
  line-height: 1.6;
  position: relative;
  border-radius: ${(props) => (props.inDrawer ? '8px' : 'unset')};
  &:hover {
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.cover2};
  }
  .text {
    display: flex;
    align-items: center;
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
      left: 20px;
    }
    100% {
      left: 18px;
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
    transform-origin: center center;
    transform: translateY(-50%);
    right: -16px;
    animation: move 0.3s linear forwards;
    -webkit-animation: move 0.3s linear forwards;
    & path {
      animation: changeColor 0.3s linear forwards;
      -webkit-animation: changeColor 0.3s linear forwards;
    }
    [dir='rtl'] & {
      left: -16px;
      right: unset;
      transform: rotate(180deg) translateY(50%);
      -webkit-animation: move-rtl 0.3s linear forwards;
      animation: move-rtl 0.3s linear forwards;
    }
  }
`;

export const MenuTitleItem = styled(Link)`
  display: block;
  padding: 24px 24px 20px 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none !important;
  font-size: ${(props) => (props.inDrawer ? '14px' : '16px')};
  line-height: 1.6;
  position: relative;
  &:hover {
    background: ${(props) => props.theme.colors.cover2};
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
      left: 20px;
    }
    100% {
      left: 18px;
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
    transform-origin: center center;
    transform: translateY(-50%);
    right: -16px;
    animation: move 0.3s linear forwards;
    -webkit-animation: move 0.3s linear forwards;
    & path {
      animation: changeColor 0.3s linear forwards;
      -webkit-animation: changeColor 0.3s linear forwards;
    }
    [dir='rtl'] & {
      left: -16px;
      right: unset;
      transform: rotate(180deg) translateY(50%);
      -webkit-animation: move-rtl 0.3s linear forwards;
      animation: move-rtl 0.3s linear forwards;
    }
  }
`;

export const MenuItemText = styled.span`
  box-sizing: border-box;
  flex: 1;
  word-break: break-all;
  white-space: break-spaces;
  line-height: 20px;
  font-weight: 500;
`;

export const MenuTitleItemText = styled.span`
  white-space: break-spaces;
  line-height: 20px;
`;

export const AssetsDetail = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
  flex-wrap: wrap;
  & svg {
    width: 20px;
    height: 20px;
    color: #fff;
    margin-left: 6px;
    margin-right: 8px;
    flex-shrink: 0;
  }
`;

export const AssetsCount = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  line-height: 1.6;
  & .account {
    color: ${(props) => props.theme.colors.text};
    font-size: 20px;
    font-weight: 500;
    line-height: 1.6;
    margin-right: 8px;
  }
`;

export const AssetsLoading = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 20px;
  line-height: 1.6;
  word-break: break-word;
  white-space: normal;
`;

export const LegalCurrency = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  line-height: 1.4;
`;

export const BottomMenu = styled.div`
  padding: ${(props) => (props.inDrawer ? `12px 0` : '12px 24px')};
  padding-bottom: ${(props) => (props.inDrawer ? `0` : '8px')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  & span {
    flex: 1;
  }
  & .item {
    width: 100%;
    padding: ${(props) => (props.inDrawer ? '11px 12px' : '7px 12px')};
    border: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${(props) => (props.inDrawer ? '16px' : '14px')};
    line-height: 130%;
    color: ${(props) => props.theme.colors.text};
    text-decoration: none !important;
    font-weight: 500;
    :first-of-type {
      margin-bottom: ${(props) => (props.inDrawer ? '12px' : '6px')};
    }
    & img {
      width: 44px;
    }

    &:hover {
      background: ${(props) => props.theme.colors.cover2};
    }
  }
`;

export const Tooltip = styled(CusTooltip)`
  z-index: 12000;
  & > div {
    background: #4a5368;
    border-radius: 4px;
    color: #fff;
  }
  & > div > div {
    color: #fff;
  }
  & > div > span {
    border-color: #4a5368 transparent transparent transparent !important;
  }
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
