/**
 * Owner: terry@kupotech.com
 */
import checkIcon from "assets/invite/header/check-icon.svg";
import { ReactComponent as _KucoinLogo } from 'assets/invite/header/kucoin-logo.svg';
import { ReactComponent as ArrowLeftIcon } from "assets/invite/header/arrow-left-icon.svg";
import { ReactComponent as ShareIcon } from "assets/invite/header/share-icon.svg";
import triangleIcon from "assets/invite/header/triangle-icon.svg";
import whiteTriangleIcon from "assets/invite/header/white-triangle-icon.svg"
import { Button } from "@kufox/mui";
import { getIsAndroid } from 'helper';
import { styled, css } from '@kufox/mui/emotion';
import { getTop } from '../utils';

export const KucoinLogo = styled(_KucoinLogo)`
  ${(props) =>
    props.isSticky &&
    `
    path {
      fill: #fff;
    }
  `}
`;
export const StyledArrowLeftIcon = styled(ArrowLeftIcon)`
  color: #000d1d;
  ${props => props.theme.breakpoints.down('md')} {
    color: ${(props) => (props.isSticky ? "#fff" : "#000d1d")};
  }
`;


export const StyledShareIcon = styled(ShareIcon)`
  cursor: pointer;
  margin-left: 12px;
  color: ${(props) => (props.isSticky ? "#fff" : "#000d1d")};
  ${props => props.theme.breakpoints.down('md')} {
    margin-left: 16px;
  }
`;

export const RestrictNoticeWrapper = styled.div`
  background: #fff;
`;

export const StyledHeaderWrapper = styled.section`
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
`;

export const StyledHeader = styled.div`
  background: unset;
  background-size: 150%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  height: 80px;
  padding: 0 24px;
  ${(props) => (props.isSticky ? `background: rgba(0, 0, 0, 0.6);` : "")}
  ${props => props.theme.breakpoints.down('md')} {
    height: ${(props) => (props.isInApp ? (getIsAndroid() ? "64px" : "88px") : "44px")};
    padding: ${(props) => (props.isInApp ? `${getTop()}px 16px 0` : "0 16px 0")};
  }
  .KuxButton-outlined {
    /* border: 1px solid ${props => props.theme.colors.text}; */
    border: 1px solid ${(props) => (props.isSticky ? "#fff" : "#000d1d")} !important;
    color: #000d1d;
    :hover {
      color: #01bc8d;
    }
    ${props => props.theme.breakpoints.down('md')} {
      color: #000d1d;
    }
  }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
`;

export const LangSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  ${props => props.theme.breakpoints.down('md')} {
    margin-left: 16px;
  }

  .select {
    display: flex;
    align-items: center;
    box-shadow: none;
    background: none;
    padding: 0;
    div {
      font-family: "Roboto" !important;
      color: ${(props) => (props.isSticky ? "#fff" : "#000d1d")} !important;
      font-weight: 500;
    }
    & > div {
      position: relative;
      left: unset;
      right: unset;
      font-size: 14px !important;
      padding-right: 0 !important;
    }
    &:hover {
      background: none !important;
    }
    span {
      position: relative;
      right: unset;
      transition: 0.3s;
      transform: ${({ expand }) =>
        expand ? "rotate(-180deg)" : "rotate(0deg)"};
      width: 18px !important;
      height: 18px !important;
      margin-left: 0 !important;
      background-image: url(" ${props => {
          return props.isSticky ? whiteTriangleIcon : triangleIcon
        }} ");
      ${props => props.theme.breakpoints.down('md')} {
        width: 12px !important;
        height: 12px !important;
      }
    }
    svg {
      display: none;
    }
  }
`;

export const StyledButton = styled(Button)`
  font-family: "Roboto";
  font-weight: 600;
  height: 32px;
  border-radius: 4px;
  color: ${props => props.theme.colors.textEmphasis};
  background: ${props => props.isSticky ? 'transparent' : props.theme.colors.text};
  ${props => props.theme.breakpoints.down('md')} {
    height: 28px;
    background: ${(props) => (props.isSticky ? "#fff" : "#000d1d")};
    color: ${(props) => (props.isSticky ? "#000d1d" : "#fff")};
  }
  &:hover {
    border-color: none;
    background: #01BC8D;
  }
`;

export const StyledLoginBtn = styled(StyledButton)`
  color: ${props => props.theme.colors.text};
  background: ${(props) => (props.isSticky ? "#fff" : "transparent")};
  border: 1px solid ${(props) => (props.isSticky ? "transparent" : props.theme.colors.primary)} !important;
  &:hover {
    border: 1px solid ${props => props.theme.colors.primary} !important;
    background: transparent;
    color: ${props => props.theme.colors.primary};
  }
  ${props => props.theme.breakpoints.down('md')} {
    color: ${(props) => (props.isSticky ? "#000d1d" : "#fff")};
    background: ${(props) => (props.isSticky ? "#fff" : "transparent")} !important;
    &:hover {
      background: ${(props) => (props.isSticky ? "#fff" : "transparent")} !important;
      color: ${(props) => (props.isSticky ? "#000d1d" : props.theme.colors.primary)} !important;
    }
  }
`;

export const LabelWrapper = styled.div`
  color: ${(props) =>
    props.selected ? '#fff' : "rgba(255, 255, 255, 0.5)"} !important;
  flex-grow: 0 !important;
`;

export const globalStyle = css`
  .dropdownContainer {
    right: 0 !important;
    background: #212631 !important;
    border-radius: 8px !important;
    border: none !important;
    width: 174px !important;
    > div:first-child > div:first-child {
      ::-webkit-scrollbar {
        width: 6px;
        max-height: 33px;
      }
      ::-webkit-scrollbar-thumb {
        max-height: 33px !important;
        border: 2px solid transparent;
        background-clip: padding-box;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.12) !important;
      }
    }
    ::-webkit-scrollbar {
      width: 6px !important;
    }

    ::-webkit-scrollbar-track {
      background-color: #323942 !important;
    }

    ::-webkit-scrollbar-thumb {
      height: 33px !important;
      border: 2px solid transparent;
      background-clip: padding-box;
      border-radius: 1px;
      background-color: rgba(255, 255, 255, 0.12);
    }
  }

  div.optionItem {
    color: rgba(255, 255, 255, 0.5) !important;
    font-family: "Roboto" !important;
    font-style: normal;
    font-weight: 400 !important;
    font-size: 14px !important;
    line-height: 130% !important;
    &:hover {
      background: rgba(255, 255, 255, 0.04) !important;
    }
    span {
      width: 16px;
      height: 16px;
      background-image: url(" ${checkIcon} ");
      svg {
        display: none;
      }
    }
  }

  .select {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    & > div {
      > div > div, > div {
        color: #000D1D !important;
      }
      text-align: end;
      line-height: 32px !important;
    }
    span {
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      background-image: url(" ${triangleIcon} ");
      background-position: center;
      background-size: contain;
    }
  }
`;
