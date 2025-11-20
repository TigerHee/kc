/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';

export const cHeader = css`
  position: relative;
  z-index: 100;
  .header,
  .nav {
    padding: 0 64px;
  }
  .header {
    background-color: #131a24;
  }
  .headeroom {
    // transition: all 0.5s ease-in-out;
    .headroom {
      top: 0;
      right: 0;
      left: 0;
      z-index: 1000;
      height: 62px;
      padding: 0;
      line-height: 62px;
      transform: translateY(0);
      transition: backgroud-color 0.2s ease;
    }
    .headroom--unfixed {
      box-shadow: none;
      transform: translateY(0);
    }
    .headroom--scrolled,
    .headroom--unpinned,
    .headroom--pinned {
      position: fixed;
      top: 0;
      background-color: #1f2738 !important;
      transform: translateY(0);
    }
  }

  .nav {
    background-color: #1f2738;
  }
  .cmptHeader,
  .navbar {
    max-width: 1200px;
    margin: 0 auto;
    :global {
      .logo {
        width: 106px !important;
      }
    }
  }
  .cmptHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: #fff;
    font-size: 12px;
    line-height: 30px;
  }

  .cmptHeader a {
    color: #99adbd;
  }

  .active_item {
    color: #8ea0b3;
  }

  .fixedItem {
    margin: 0 16px;
    cursor: pointer;
  }

  .fixedItem:hover {
    color: #8ea0b3;
  }

  .fixedItem:first-of-type {
    margin-left: 0;
  }

  .navbar {
    align-items: center;
    box-sizing: border-box;
    height: 62px;
    overflow: visible;
    color: #a4aab3;
    font-size: 14px;
  }

  .links {
    align-items: center;
  }

  .content {
    height: 100vh;
  }
`;

/* homePagePro */
export const TopLineWraper = styled.div`
  height: 30px;
  background: #131a24;
  line-height: 30px;
  .topLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    a {
      display: inline-block;
      color: #6a7b88;
      font-size: 12px;
      &:hover {
        color: #b1bcc5;
      }
    }
    .linkLeft > a {
      margin-right: 32px;
    }
    .linkRight {
      display: flex;
    }
    .linkRight > a {
      margin-left: 32px;
    }
    .currencySelect {
      display: flex;
      align-items: center;
    }
    .localeIcon {
      width: 16px;
      height: 16px;
      margin-top: -2px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
`;
export const HeaderOption = styled.div`
  display: flex;
  align-items: center;
  .link {
    display: inline-block;
    margin: 0 16px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 12px;
    cursor: pointer;
    &:last-child {
      margin: 0 0 0 16px;
    }
  }
  .currencySelect {
    display: flex;
    align-items: center;
  }
  .selectCurrency {
    width: 400px !important;
  }
  .itemSelectCurrency {
    width: 20% !important;
  }
`;

export const WorldSvg = css`
  display: inline-block;
  width: 12px !important;
  height: 12px !important;
`;
