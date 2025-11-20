/**
 * Owner: solar.xia@kupotech.com
 */
import { Button, Checkbox, css, MDialog, styled } from '@kux/mui';
import {
  themeBreakPointDownSM,
  themeBreakPointUpSM,
  themeColorCover2,
  themeColorCover8,
  themeColorOverlay,
  themeColorPrimary,
  themeColorText30,
  themeFontLG,
} from 'src/utils/themeSelector';

export const FlexBox = styled.div``;

export const NavTags = styled.ul`
  display: flex;
  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
  }
  max-width: 100%;
  ${(props) => props.theme.fonts.size.md}
  color: rgba(243, 243, 243, 0.6); // 固定
  font-weight: 400;
  li {
    ${(props) =>
      props.omitTag &&
      css`
        min-width: 0;
        overflow: hidden;
        div {
          &:first-of-type {
            width: 100%;
          }
          &:nth-of-type(2) {
            width: 80%;
          }
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      `}
    display: flex;
    align-items: center;
    height: ${(props) => `${props.height || 20}px`};
    background-color: rgba(243, 243, 243, 0.08);
    border-radius: 4px;
    cursor: pointer;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-right: 8px;
      padding: 4px 10px;
    }
    & > *:not(:last-child) {
      margin-right: 6px;
    }

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      color: inherit !important;
      pointer-events: none;
      svg {
        ${(props) => props.theme.breakpoints.up('sm')} {
          margin-right: 4px;
        }
      }
    }
  }
`;
NavTags.defaultProps = {
  mode: 'light',
};
export const StyledPage = styled.main`
  font-family: Roboto;
  background: ${(props) => props.theme.colors.overlay};
  /* min-height: 80vh; */
  /* min-width: 375px; */
  ${(props) => props.theme.breakpoints.up('lg')} {
    min-width: 1200px;
  }
`;
export const StyledBanner = styled.section`
  height: auto;
  background-color: ${themeColorOverlay};
  ${(props) => props.theme.breakpoints.up('lg')} {
    // height: 252px;
  }
`;

export const StyledH5Banner = styled.section`
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  height: 44px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .left {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-style: normal;
    ${(props) => props.theme.fonts.size.x2l}
    text-align: center;
  }
  .right {
    width: 56px;
    height: 20px;
  }
`;
export const BaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 16px;
  padding-right: 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 24px;
    padding-left: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-right: 0;
    padding-left: 0;
  }
`;
export const WrapperCoinTabs = styled.div`
  width: 100%;
  &.fixed {
    background-color: ${(props) => props.theme.colors.overlay};
  }
`;
export const WrapperCoinTabsContainer = styled.div`
  width: 100%;
  height: ${(props) => (props.activityStatus === 3 ? 'auto' : '50px')};
`;
export const WrapperTypeTabs = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.overlay};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  align-self: stretch;
`;
export const OrdersAndChartsContainer = styled(BaseContainer)`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;

export const WrapperOrders = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${(props) => (props.activityStatus > 0 ? '0' : '24px')};

  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px;
    background: ${themeColorOverlay};
    border: 1px solid ${themeColorCover8};
    border-radius: 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${(props) => (props.activityStatus > 0 ? '776px' : '100%')};
  }
`;

export const WrapperCharts = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  figure {
    flex-shrink: 0;
    width: 100%;
    padding: 16px;
    background: ${themeColorOverlay};
    border: 1px solid ${themeColorCover8};
    border-radius: 16px;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    gap: 16px;
    figure {
      flex: 1;
      width: 50%;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: column;
    gap: 24px;
    width: 400px;
    figure {
      width: 100%;
    }
  }
`;

export const WrapperTypeTabsContainer = styled.div`
  width: 100%;
`;

export const StyledBannerContainer = styled(BaseContainer)`
  height: 100%;
  position: relative;
  padding: 0;

  aside {
    img {
      margin-right: 80px;
    }
  }
`;

export const ProcessContainer = styled(BaseContainer)`
  padding-top: 56px;
  padding-bottom: 56px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 64px;
    padding-bottom: 64px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  h2 {
    color: ${(props) => props.theme.colors.text};
    ${(props) => props.theme.fonts.size.x2l}
    text-align: left;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin: 0 auto;
      text-align: center;
      ${(props) => props.theme.fonts.size.x4l}
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      margin: 0;
      text-align: left;
      ${(props) => props.theme.fonts.size.x6l}
    }
  }
`;

export const StyledProcess = styled.section`
  margin-top: 56px;
  background-color: ${themeColorCover2};
  ${themeBreakPointUpSM} {
    margin-top: 100px;
  }
`;

export const ScrollY = styled.div`
  overflow-x: scroll;
  /* &::-webkit-scrollbar {
    width: 0;
    height: 0;
  } */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
`;
export const StyledRoleTabs = styled(ScrollY)`
  ul {
    display: flex;
    margin-top: 24px;
    white-space: nowrap;
    ${(props) => props.theme.breakpoints.up('sm')} {
      justify-content: center;
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      justify-content: left;
    }

    li {
      display: flex;
      align-items: center;
      height: 34px;
      margin-right: 12px;
      padding: 0 16px;
      color: ${(props) => props.theme.colors.text40};
      background-color: ${(props) => props.theme.colors.cover2};
      border: 0.5px solid ${(props) => props.theme.colors.cover12};
      border-radius: 17px;
      cursor: pointer;
      ${(props) => props.theme.fonts.size.lg}
      &.actived {
        color: ${(props) => props.theme.colors.textEmphasis};
        background-color: ${(props) => props.theme.colors.text};
      }
      &:last-of-type {
        margin-right: ${(props) => (!props.isRTL ? 0 : '12px')};
      }
    }
  }
`;
export const StyledSlider = styled.div`
  margin-top: 40px;
  .kux-slick-track {
    .kux-slick-slide {
      direction: ltr;
    }
    // transform: translate3d(0, 0, 0) !important;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 64px;
  }
  ul {
    display: flex;
    flex-direction: column;
    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
    }
    li {
      &:last-of-type {
        article {
          align-items: start;
          height: 120px;
          margin-top: 12px;
          ${(props) => props.theme.breakpoints.up('sm')} {
            margin-top: 20px;
          }
        }
      }
      display: flex;
      flex-direction: row;
      ${(props) => props.theme.breakpoints.up('lg')} {
        flex-direction: column;
        width: calc((100% - 160px) / 3);
        &:not(:last-child) {
          margin-right: 80px;
        }
      }

      section {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;
        ${(props) => props.theme.breakpoints.up('sm')} {
          margin-right: 32px;
        }
        ${(props) => props.theme.breakpoints.up('lg')} {
          position: relative;
          flex-direction: row;
          margin-right: 0;
        }
        img {
          width: 64px;
          height: 64px;
          ${(props) => props.theme.breakpoints.up('sm')} {
            width: 80px;
            height: 80px;
          }
          ${(props) => props.theme.breakpoints.up('lg')} {
            width: 64px;
            height: 64px;
          }
        }
        .divider {
          width: 1px;
          height: 62px;
          background-color: ${(props) => props.theme.colors.cover8};
          ${(props) => props.theme.breakpoints.up('sm')} {
            height: 48px;
          }
          ${(props) => props.theme.breakpoints.up('lg')} {
            position: absolute;
            top: 32px;
            left: 96px;
            width: 299px;
            height: 1px;
          }
        }
      }
      article {
        display: flex;
        align-items: center;
        align-items: start;
        margin-top: 12px;
        ${(props) => props.theme.breakpoints.up('sm')} {
          align-items: center;
          height: 80px;
          margin-top: 6px;
        }
        ${(props) => props.theme.breakpoints.up('lg')} {
          align-items: start;
          height: auto;
          margin-top: 28px;
        }
        h2 {
          color: ${(props) => props.theme.colors.text};
          font-weight: 600;
          ${(props) => props.theme.fonts.size.lg}
          ${(props) => props.theme.breakpoints.up('sm')} {
            font-weight: 700;
            ${(props) => props.theme.fonts.size.x2l}
          }
          ${(props) => props.theme.breakpoints.up('lg')} {
            ${(props) => props.theme.fonts.size.x3l}
          }
        }
        p {
          /* margin-top: 8px; */
          color: ${(props) => props.theme.colors.text};
          ${(props) => props.theme.fonts.size.lg}
          font-weight: 600;
          ${(props) => props.theme.breakpoints.up('sm')} {
            ${(props) => props.theme.fonts.size.xl}
          }
          ${(props) => props.theme.breakpoints.up('lg')} {
            font-weight: 500;
          }
        }
      }
    }
  }
`;

export const StyledFAQ = styled.section`
  background-color: ${(props) => props.theme.colors.overlay};
`;

export const FAQContainer = styled(BaseContainer)`
  padding-top: 100px;
  padding-bottom: 80px;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .more {
      font-size: 16px;
    }
  }
  h2 {
    color: ${(props) => props.theme.colors.text};
    ${(props) => props.theme.fonts.size.x2l}
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    h2 {
      ${(props) => props.theme.fonts.size.x5l}
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    h2 {
      ${(props) => props.theme.fonts.size.x6l}
    }
  }
`;

export const StyledPriceBar = styled(BaseContainer)`
  padding: 16px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 16px;
  margin: 16px 16px 24px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 24px;
    padding: 16px 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin: 24px auto;
  }

  .KuxDivider-root {
    margin: 20px 0;
    background: ${(props) => props.theme.colors.cover4};
  }

  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;

    h1 {
      ${(props) => props.theme.fonts.size.x2l}
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: row;
      justify-content: space-between;
      h1 {
        ${(props) => props.theme.fonts.size.x5l}
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
      justify-content: space-between;
      h1 {
        ${(props) => props.theme.fonts.size.x6l}
      }
    }
  }
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  .btn {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
    text-align: right;
    cursor: pointer;

    svg {
      width: 16px;
      min-width: 16px;
      max-width: 16px;
      height: 16px;
      margin-left: 2px;
      color: ${(props) => props.theme.colors.icon};
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-top: 0;
      font-size: 14px;
      .flod {
        width: 140px;
        min-width: 140px;
        max-width: 140px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const PriceItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 100%;
  .title {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
    text-decoration: underline;
    cursor: help;
    text-decoration-style: dashed;
    text-decoration-color: ${(props) => props.theme.colors.text20};
    text-underline-offset: 2px;
  }

  .value {
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;
  }

  &:last-of-type {
    margin-bottom: 0;
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    display: flex;
    flex: unset;
    flex-direction: column;
    align-items: flex-start;
    justify-content: ${(props) => (props.activityStatus < 3 ? '' : 'space-between')};
    width: auto;
    margin-bottom: 0;
    .title {
      margin-right: 0;
      margin-bottom: 4px;
      font-size: 14px;
    }

    .value {
      font-size: 14px;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    display: flex;
    flex: unset;
    flex-direction: column;
    align-items: flex-start;
    width: auto;
    margin-bottom: 0;
    .title {
      margin-right: 8px;
      font-size: 14px;
    }

    .value {
      font-size: 14px;
    }
  }
`;

export const StyledOrderSummary = styled(BaseContainer)`
  width: 100%;
  padding: 16px;
  background: ${(props) => props.theme.colors.cover2};
  border-radius: 16px;
  margin-bottom: 0;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 16px 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin: 0 auto;
  }

  .KuxDivider-root {
    margin: 20px 0;
    background: ${(props) => props.theme.colors.cover4};
  }

  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;

    h1 {
      ${(props) => props.theme.fonts.size.x2l}
    }
    ${(props) => props.theme.breakpoints.up('sm')} {
      flex-direction: row;
      justify-content: space-between;
      h1 {
        ${(props) => props.theme.fonts.size.x5l}
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      flex-direction: row;
      justify-content: space-between;
      h1 {
        ${(props) => props.theme.fonts.size.x6l}
      }
    }
  }
`;

export const StyledMain = styled.section`
  position: relative;
  background-color: ${(props) => props.theme.colors.overlay};
  .main-spin {
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    ${themeBreakPointUpSM} {
      top: 200px;
    }
  }
`;
export const MainContainer = styled.div``;

export const StyledCoinTabs = styled(ScrollY)`
  ${(props) =>
    !props.isInApp &&
    css`
      padding-right: 32px;
    `}
  border-bottom: 1px solid ${(props) => props.theme.colors.cover4};
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 0px;
  }
  .KuxTabs-container {
    height: 49px;
    .KuxTabs-Container {
      padding-top: 14px;
    }
  }
  .KuxTab-TabItem {
    /* height: 18px; */
    font-size: 14px;

    a {
      color: inherit !important;
      pointer-events: none;
    }
  }
  .KuxTabs-scrollButton {
    display: none;
  }
  &.actived:last-of-type {
    &::after {
      transform: translateX(-11px);
    }
  }
  .KuxSelect-searchPlaceholder {
    position: static;
    padding-right: 2px;
    font-size: 14px;
  }
  .KuxSelect-itemLabel {
    font-size: 14px;
  }
  .KuxSelect-dropdownIcon {
    margin-left: 0;
    .ICTriangleTop_svg__icon {
      fill: ${(props) => props.theme.colors.text60};
    }
  }
  .actived {
    .KuxSelect-searchPlaceholder {
      color: ${(props) => props.theme.colors.text};
    }
  }
`;
export const CoinTabsBar = styled.div`
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

export const CoinTabsActions = styled.div`
  position: absolute;
  top: 0;
  right: 16px;
  display: flex;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    right: 16px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    right: 16px;
  }
`;

export const StyledMyOrderLink = styled(Button)`
  align-items: center;
  ${themeFontLG};
  span {
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: inline;
    }
  }
  ${themeBreakPointDownSM} {
    width: 20px;
    height: 20px;
    .KuxButton-startIcon {
      width: 20px;
      height: 20px;
    }
  }
  /* font-weight: 500;
  align-items: center;
  background-color: ${(props) => props.theme.colors.overlay};
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  ${(props) => props.theme.fonts.size.lg}
  ${(props) => props.theme.breakpoints.up('sm')} {
    right: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    right: 0;
  }
  svg {
    width: 16px;
    height: 16px;
    margin-left: 16px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-right: 8px;
    }
  }
  span {
    display: none;
    ${(props) => props.theme.breakpoints.up('sm')} {
      display: block;
    }
  } */
`;

export const StyledAllProjectLink = styled(Button)`
  ${themeFontLG};
  font-weight: 500;
  .KuxButton-endIcon {
    margin-left: 0px;
  }
`;

export const StyledMoreButton = styled.span`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 2px;
  color: ${themeColorPrimary};
  cursor: pointer;
`;

export const StyledTypeTabs = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  .KuxTabs-scrollButton {
    display: none;
  }
  .type-tabs-wrapper {
    display: flex;
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
    button.chose-side {
      display: flex;
      align-items: center;
      height: 40px;
      margin-right: 12px;
      padding: 0 16px;
      padding: 0 16px;
      font-weight: 500;
      background-color: ${(props) => props.theme.colors.cover2};
      border: 0.5px solid ${(props) => props.theme.colors.cover12};
      border-radius: 20px;
      cursor: pointer;
      ${(props) => props.theme.fonts.size.lg}
      ${(props) => props.theme.breakpoints.up('sm')} {
        padding: 0 20px;
        font-weight: 600;
      }
      ${(props) => props.theme.breakpoints.up('lg')} {
        /* ${(props) => props.theme.fonts.size.xl} */
        padding: 0 24px;
      }
      &.actived {
        color: ${(props) => props.theme.colors.textEmphasis};
        background-color: ${(props) => props.theme.colors.text};
      }
    }
  }
  .mask-type-tabs {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30px;
    background: linear-gradient(
      270deg,
      ${(props) => props.theme.colors.overlay} 0%,
      rgba(255, 255, 255, 0) 100%
    );
    pointer-events: none;
    ${themeBreakPointDownSM} {
      display: none;
    }
  }
`;

export const StyledFilterMyAndCreate = styled.div`
  display: flex;
  ${(props) => props.theme.fonts.size.lg}
  .filter-my-btn {
    display: flex;
    align-items: center;
    // margin-right: 24px;
    color: ${(props) => props.theme.colors.text60};
  }
  .sm-create-btn {
    display: flex;
    align-items: center;
    font-weight: 500;
    cursor: pointer;
    ${(props) => props.theme.fonts.size.lg}
    color: ${(props) => props.theme.colors.text};
    svg {
      margin-right: 4px;
      margin-left: 12px;
    }
  }
`;

export const TypeTabsBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => props.theme.colors.overlay};
`;

export const CutOffButton = styled(Button)`
  height: 40px;
  width: 120px;
`;

export const StyledWhite = styled(BaseContainer)`
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: ${(props) => props.height}px;
  }
  background-color: ${(props) => props.theme.colors.overlay};
`;

export const StyledDropDownOption = styled.div`
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 4px 40px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.layer};
  button.create-option {
    ${(props) => props.theme.fonts.size.lg}
    padding: 11px 16px;
    width: 100%;
    color: ${(props) => props.theme.colors.text};
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.colors.cover2};
    }
    /* &:nth-of-type(2n) {
      width: 100%;

    } */
  }
`;

export const StyledFilterRange = styled.div`
  button {
    display: block;
    padding: 0;
    color: inherit;
    font: inherit;
    background: none;
    border: none;
    outline: inherit;
    cursor: pointer;
  }
  .filter-icon {
    margin-top: 6px;
    cursor: pointer;
    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-right: 24px;
    }
  }
  .overlay {
    width: 290px;
    height: 162px;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.overlay};
    border: 1px solid ${(props) => props.theme.colors.cover4};
    border-radius: 8px;
    box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.06);
    .title {
      ${(props) => props.theme.fonts.size.lg}
    }
    .value-range {
      display: flex;
      margin-top: 16px;
      .item {
        flex: 1;
        &:first-of-type {
          margin-right: 18px;
        }
      }
    }
    .confirm-btn {
      display: flex;
      margin-top: 16px;
      .item {
        flex: 1;
        &:first-of-type {
          margin-right: 12px;
        }
      }
    }
  }
`;
export const StyledFilteredInSm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const StyledFilterRangeBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 24px;
  .input-group {
    display: flex;
    gap: 6px;
    align-items: center;
    color: ${themeColorText30};
    .KuxInputNumber-container {
      width: 160px;
    }
  }
  .button-group {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

export const StyledCreateOrderButton = styled(Button)`
  ${themeBreakPointDownSM} {
    position: fixed;
    right: 16px;
    bottom: 48px;
    z-index: 999;
  }
`;

export const StyledOnlyMyOrder = styled(Checkbox)`
  ${(props) => props.theme.fonts.size.md}
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.up('sm')} {
    ${(props) => props.theme.fonts.size.xl}
  }
`;

export const StyledHeader = styled.div`
  position: relative;
  height: 44px;
  padding-top: 40px;
  box-sizing: content-box;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.overlay};

  .app-custom-header {
    position: fixed;
    top: 0px;
    z-index: 1000;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    width: 100%;
    height: 44px;
    padding-top: 40px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    background: ${(props) => props.theme.colors.overlay};
    ${(props) => props.theme.fonts.size.x2l}
    display: flex;
    .title-text {
      position: absolute;
      top: 40px;
      left: 50%;
      display: flex;
      align-items: center;
      height: 44px;
      transform: translate(-50%, 0);
    }
    button {
      padding: 0;
      color: inherit;
      font: inherit;
      background: none;
      border: none;
      outline: inherit;
      cursor: pointer;
    }
    .back-arrow-icon {
      height: 20px;
      padding-left: 16px !important;

      svg {
        width: 20px;
        height: 20px;
        transform: rotateY(180deg);

        [dir='rtl'] & {
          transform: rotateY(0deg);
        }
      }
    }
    .title-text.transparent {
      color: transparent;
    }

    .buttonWrapper {
      display: flex;
      align-items: center;
    }
    .my-order-icon {
      height: 20px;
      padding-right: 16px !important;
      visibility: hidden;

      svg {
        width: 20px;
        height: 20px;
        color: ${(props) => props.theme.colors.text};
        [dir='rtl'] & {
          transform: rotateY(180deg);
        }
      }

      &.visible {
        visibility: visible;
      }
    }
  }

  /* .title-text {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    } */
  /* } */
`;

export const StyledFooter = styled.div`
  padding-bottom: ${(props) => (props.isInApp ? '20px' : 0)};
`;

export const StyleSortItem = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 12px;
    height: 12px;
    margin-left: 2px;
    color: ${(props) => props.theme.colors.icon60};
  }
`;

export const SortItemText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text40)};
`;

export const SortOverlay = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const SortOptionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  svg {
    width: 20px;
    height: 20px;
    color: ${(props) => props.theme.colors.primary};
  }

  &.active {
    background: ${(props) => props.theme.colors.cover2};
  }
`;

export const SortOptionItemText = styled.span`
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

export const FilterOverlay = styled.div`
  padding: 16px 16px 8px;

  .KuxDivider-root {
    margin: 16px 0;
    background: ${(props) => props.theme.colors.cover4};
  }

  .only-my-order {
    .title {
      margin-bottom: 8px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }

    .KuxCheckbox-wrapper {
      display: inline-flex;
      align-items: center;
      span {
        font-weight: 500;
      }
      .KuxCheckbox-checkbox {
        top: 0;
        .KuxCheckbox-inner {
          width: 16px;
          height: 16px;
        }
      }
    }
  }

  .filter-range {
    .title {
      margin-bottom: 8px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
    }
    .value-range {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .range-split {
        margin: 0 16px;

        .split-mark {
          width: 11px;
          height: 1px;
          background: ${(props) => props.theme.colors.text30};
          border: none;
        }
      }

      .KuxInputNumber-controlsRoot {
        display: none;
      }

      .KuxInputNumber-container {
        padding: 0 12px;

        fieldset {
          border-radius: 80px !important;
        }

        input {
          text-align: center;
        }
      }
    }
  }
`;

export const FilterDialog = styled(MDialog)`
  min-height: 200px;
  padding-bottom: ${(props) => (props.isInApp ? '16px' : 0)};
`;

export const StyledChart = styled.div`
  width: 100%;
  // height: 264px;
`;

export const ChartTitle = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;

  .title {
    margin-right: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
  }

  .operator {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;

    .KuxDivider-root {
      margin: 0 16px;
    }

    .KuxTabs-Container {
      .KuxTab-selected {
        color: ${(props) => props.theme.colors.textEmphasis};
        background: ${(props) => props.theme.colors.text};
      }
      .KuxTab-TabItem {
        margin: 0;
      }
    }

    .label {
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text40};
      text-decoration: underline;
      cursor: help;
      text-decoration-style: dashed;
      text-underline-offset: 2px;
      text-decoration-color: ${(props) => props.theme.colors.text30};
    }
  }
`;

export const ChartTitleSm = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .operator {
    display: flex;
    align-items: center;
    max-width: 50%;
    font-weight: 500;
    font-size: 12px;
    line-height: 130%;

    .label {
      margin-right: 6px;
      color: ${(props) => props.theme.colors.text40};
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 2px;
      text-decoration-color: ${(props) => props.theme.colors.text30};
    }
  }

  .KuxTabs-Container {
    .KuxTab-selected {
      color: ${(props) => props.theme.colors.textEmphasis};
      background: ${(props) => props.theme.colors.text};
    }
    .KuxTab-TabItem {
      margin: 0;
    }
  }
`;

export const DataChartWrapper = styled.div`
  padding: 16px;
`;

export const EmptyWrapper = styled.div`
  height: 260px;
  text-align: center;
  padding-top: 50px;
`;

export const BreadcrumbWrapper = styled.div`
  padding: 0 16px 12px;
  a {
    color: inherit;
    text-decoration: none;
    border: none;
    outline: none;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 26px 0 12px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 26px 0 12px;
  }
`;

export const MoreOverlay = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 24px 16px;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 76px;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
      color: ${(props) => props.theme.colors.text};
      background: ${(props) => props.theme.colors.cover4};
      border-radius: 40px;
      svg {
        width: 20px;
        height: 20px;
      }
    }

    .text {
      color: ${(props) => props.theme.colors.text60};
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      text-align: center;
    }
  }
`;
