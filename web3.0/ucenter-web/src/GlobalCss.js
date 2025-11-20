/**
 * Owner: willen@kupotech.com
 */

import { css, CssBaseline, Global, keyframes } from '@kux/mui';

import { THEME_VARS } from './theme/vars';

const nprogressSpinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const animation0 = css`
  animation: ${nprogressSpinner} 400ms linear infinite;
`;

const globalCss = css`
  .KuxInput-clearIcon + .KuxInput-togglePwdIcon {
    margin-left: 12px;
  }

  .KuxInput-suffixWrapper {
    .KuxDivider-vertical {
      width: 0px;
      margin: 0 6px;
    }
  }

  .KuxAlert-icon {
    margin-top: 2px;
  }
  .KuxDialog-body {
    margin: auto 16px !important;
  }
  html {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  * {
    margin: 0;
    padding: 0;
  }
  *,
  :after,
  :before {
    box-sizing: inherit;
  }
  body {
    width: 100%;
    font-family: Kufox Sans, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei';
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior-y: none;
    &[data-responsive='responsive'] {
      width: 100%;
      min-width: 0;
    }
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0.5em;
    font-weight: 500;
  }
  a {
    color: #24ae8f;
    cursor: pointer;
    &:hover {
      color: #01bc8d;
    }
  }
  a,
  a:active,
  a:hover,
  a:focus {
    text-decoration: none;
    outline: none;
  }
  ul,
  ol {
    list-style: none;
  }

  div {
    box-sizing: border-box;
    background-clip: padding-box !important;
  }

  b {
    font-weight: 500;
  }

  #root {
    width: 100%;
  }
  #hook_indexes {
    height: 136px;
  }
  .side-menu-layout {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 1240px;
    margin: 28px auto;
    .content_menu {
      flex: 1;
    }
    .content_main {
      width: 1036px;
      margin-left: 24px;
      & > .ant-card {
        .ant-card-body {
          min-height: 680px;
        }
      }
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .flex-center {
    display: flex;
    align-items: center;
  }
  .pull-right {
    float: right;
  }
  .pull-left {
    float: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }
  .text-left {
    text-align: left;
  }
  .wrap {
    white-space: normal;
  }
  .full-width {
    width: 100%;
  }
  .color-white {
    color: #fff;
  }
  .color-light-gray {
    color: #cdcdcd;
  }
  .color-gray {
    color: rgba(0, 0, 0, 0.4);
  }
  .color-pro-gray {
    color: #8093a1;
  }
  .color-gray1 {
    color: rgba(0, 0, 0, 0.53);
  }
  .color-high {
    color: ${THEME_VARS.colorHigh};
  }
  .color-low {
    color: ${THEME_VARS.colorLow};
  }
  .color-buy {
    color: ${THEME_VARS.colorBuy};
  }
  .color-title {
    color: #7685a9;
  }
  .color-sell {
    color: ${THEME_VARS.colorSell};
  }
  .color-success {
    color: ${THEME_VARS.colorSuccess};
  }
  .color-warn {
    color: ${THEME_VARS.warningColor};
  }
  .color-danger {
    color: ${THEME_VARS.colorDanger};
  }
  .color-primary {
    color: ${THEME_VARS.colorPrimary};
  }
  .color-otc-red {
    color: #c63c4d;
  }
  .font-weight {
    font-weight: 500;
  }
  .font-lg {
    font-size: ${THEME_VARS.fontSizeLg};
  }
  .font-lg-x {
    font-size: ${THEME_VARS.fontSizeXLg};
  }
  .font-lg-xx {
    font-size: ${THEME_VARS.fontSizeXXLg};
  }
  .blocked {
    display: block;
  }
  .pointer {
    cursor: pointer;
  }
  .circle-wraper {
    display: inline-block;
    width: 24px;
    height: 24px;
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    text-align: center;
    border: 2px solid;
    border-radius: 24px;
  }
  .link-gray {
    color: rgba(0, 0, 0, 0.7);
    &:hover {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /* 居中对话框 */
  .vertical-center-modal {
    text-align: center;
  }
  .vertical-center-modal:before {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
    content: '';
  }
  .vertical-center-modal .ant-modal {
    top: 0;
    display: inline-block;
    text-align: left;
    vertical-align: middle;
  }
  .ant-btn-primary.disabled,
  .ant-btn-primary[disabled],
  .ant-btn-primary.disabled:hover,
  .ant-btn-primary[disabled]:hover,
  .ant-btn-primary.disabled:focus,
  .ant-btn-primary[disabled]:focus,
  .ant-btn-primary.disabled:active,
  .ant-btn-primary[disabled]:active,
  .ant-btn-primary.disabled.active,
  .ant-btn-primary[disabled].active {
    &.ant-btn {
      color: #fff;
      background-color: #73b6f6;
      border-color: #73b6f6;
    }
  }
  .drop-nowrap-select .ant-select-dropdown-menu-item {
    white-space: normal;
  }

  .control-divider {
    &.ant-divider-horizontal {
      display: inline-block;
      width: 8px;
      height: 1px;
      margin: 0 4px;
      background: #e5e9eb;
    }
  }
  .filter-radio-button {
    &.kc-radio-group {
      .kc-radio-btn {
        color: #333;
        font-size: 12px;
        background: transparent;
        border-color: transparent;
        border-radius: 2px;
        &.ant-radio-button-wrapper {
          height: 24px;
          line-height: 24px;
          &:not(:first-of-type)::before {
            background: transparent;
          }
          span {
            padding: 0 13px;
          }
        }
      }
    }
    &.ant-radio-group-solid {
      .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
        color: #333;
        background: rgba(15, 125, 255, 0.08);
        border-color: transparent;
        &:hover {
          color: #333;
          background: rgba(15, 125, 255, 0.08);
          border-color: rgba(15, 125, 255, 0.08);
        }
      }
    }
    .ant-radio-button-wrapper-checked {
      box-shadow: none !important;
    }
  }
  body {
    .ant-card {
      .ant-card-head {
        border-bottom: 1px solid #edf1f3;
      }
    }
    .ant-card-head-wrapper {
      .ant-card-head-title {
        font-size: 16px;
        line-height: 20px;
      }
    }
    .ant-table-thead {
      & > tr > th {
        background-color: #fff;
      }
    }
    .ant-input-affix-wrapper:hover .ant-input:not(.ant-input-disabled) {
      border-color: rgba(0, 0, 0, 0.1);
      border-right-width: 1px !important;
    }
    .ant-menu-inline .ant-menu-item,
    .ant-menu-inline .ant-menu-submenu-title {
      width: 100%;
    }
    #launcher {
      bottom: 60px !important;
      display: none !important; //zendesk help 按钮隐藏
    }
  }
  #nprogress {
    pointer-events: none;
    .bar {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1024;
      width: 100%;
      height: 2px;
      background: ${THEME_VARS.processColor};
    }
    .peg {
      position: absolute;
      right: 0;
      display: block;
      width: 100px;
      height: 100%;
      box-shadow: ${`0 0 10px ${THEME_VARS.processColor}, 0 0 5px ${THEME_VARS.processColor}`};
      transform: rotate(3deg) translate(0px, -4px);
      opacity: 1;
    }
    .spinner {
      position: fixed;
      top: 15px;
      right: 15px;
      z-index: 1031;
      display: block;
    }
    .spinner-icon {
      box-sizing: border-box;
      width: 18px;
      height: 18px;
      border: solid 2px transparent;
      border-top-color: ${THEME_VARS.processColor};
      border-left-color: ${THEME_VARS.processColor};
      border-radius: 50%;
      :local {
        ${animation0}
      }
    }
  }
  .nprogress-custom-parent {
    position: relative;
    overflow: hidden;
    #nprogress {
      .bar,
      .spinner {
        position: absolute;
      }
    }
  }
  .zEWidget-launcher {
    display: none;
  }

  .redPacketModal {
    .ant-modal-content {
      background-color: transparent !important;
      box-shadow: none;
    }
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  // 为避免帮助模块遮住底部banner
  #ada-button-frame {
    right: -8px !important;
    bottom: 76px !important;
  }
  #ada-intro-frame {
    right: -3px !important;
    bottom: 128px !important;
  }

  /* rtl:begin:ignore */
  [dir='rtl'] {
    .KuxCheckbox-inner:after {
      right: unset;
      left: 2px;
      border-top: 0;
      border-right: 1px solid #ffffff;
      border-bottom: 1px solid #ffffff;
      border-left: 0;
      transform: rotate(45deg) scale(1) translate(-50%, -50%);
    }

    .left_svg__icon,
    .right_svg__icon {
      transform: rotate(180deg);
    }

    .MuiFormLabel-root {
      text-align: right;
    }
  }
  /* rtl:end:ignore */

  body fieldset {
    min-width: initial;
    margin: initial;
    padding: initial;
    border: initial;
    margin-inline-start: 2px;
    margin-inline-end: 2px;
    padding-block-start: 0.35em;
    padding-inline-start: 0.75em;
    padding-inline-end: 0.75em;
    padding-block-end: 0.625em;
  }
  body legend {
    width: initial;
    padding: initial;
    padding-inline-start: 2px;
    padding-inline-end: 2px;
  }
  .side-menu-layout {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    max-width: 1200px;
    margin: 28px auto;
    .content_menu {
      flex: 1;
    }
    .content_main {
      width: 1036px;
      margin-left: 24px;
      & > .ant-card {
        .ant-card-body {
          min-height: 680px;
        }
      }
    }
  }
  .KuxDrawer-mask:has(> .thKycDrawer) {
    z-index: 999;
  }
`;

/* 
.loopingClass (@index) when (@index > 0) {
  @indexDouble: (@index * 2);
  .mr-@{indexDouble} {
    margin-right: (@indexDouble) * 1px;
  }
  .ml-@{indexDouble} {
    margin-left: (@indexDouble) * 1px;
  }
  .mt-@{indexDouble} {
    margin-top: (@indexDouble) * 1px;
  }
  .mb-@{indexDouble} {
    margin-bottom: (@indexDouble) * 1px;
  }
  .pr-@{indexDouble} {
    padding-right: (@indexDouble) * 1px;
  }
  .pl-@{indexDouble} {
    padding-left: (@indexDouble) * 1px;
  }
  .pt-@{indexDouble} {
    padding-top: (@indexDouble) * 1px;
  }
  .pb-@{indexDouble} {
    padding-bottom: (@indexDouble) * 1px;
  }
  .font-size-@{indexDouble} {
    font-size: (@indexDouble) * 1px;
  }
  .loopingClass(@index - 1);
  .horizontal-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .horizontal-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.loopingClass(15);
.ant-message {
  z-index: 9999999;
}
.ant-input-number .ant-input-number-handler-wrap {
  opacity: 1;
}
*/

const generateLoopingStyles = (maxIndex) => {
  let styles = '';
  for (let index = maxIndex; index > 0; index--) {
    const indexDouble = index * 2;
    styles += `
      .mr-${indexDouble} { margin-right: ${indexDouble}px; }
      .ml-${indexDouble} { margin-left: ${indexDouble}px; }
      .mt-${indexDouble} { margin-top: ${indexDouble}px; }
      .mb-${indexDouble} { margin-bottom: ${indexDouble}px; }
      .pr-${indexDouble} { padding-right: ${indexDouble}px; }
      .pl-${indexDouble} { padding-left: ${indexDouble}px; }
      .pt-${indexDouble} { padding-top: ${indexDouble}px; }
      .pb-${indexDouble} { padding-bottom: ${indexDouble}px; }
      .font-size-${indexDouble} { font-size: ${indexDouble}px; }
    `;
  }

  styles += `
    .horizontal-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .horizontal-center {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ant-message {
      z-index: 9999999;
    }
  `;

  return css`
    ${styles}
  `;
};

const loopingStyles = generateLoopingStyles(15);

const composeCss = css([globalCss, loopingStyles]);

const GlobalCss = () => {
  return (
    <>
      <CssBaseline />
      <Global styles={composeCss} />
    </>
  );
};

export default GlobalCss;
