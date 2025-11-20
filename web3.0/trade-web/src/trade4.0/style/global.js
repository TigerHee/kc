/**
 * Owner: borden@kupotech.com
 */
import React from 'react';
import { useTheme } from '@kux/mui/hooks';
import { useIsRTL } from '@/hooks/common/useLang';
import { Global, css, fx } from './emotion';
import { futuresTableStyle } from '../pages/Orders/FuturesOrders/style';

// 全局样式， 可以用className
export const GlobalStyle = () => {
  const isRtl = useIsRTL();
  const { colors, fonts } = useTheme();
  const style = css`
    * {
      box-sizing: border-box;
    }
    body {
      background-color: ${colors.background};
    }
    .ReactVirtualized__Grid,
    .ReactVirtualized__List {
      [dir='rtl'] {
        direction: rtl !important;
      }
    }
    html,
    body,
    #root {
      font-family: ${fonts.family};
      /* -webkit-font-smoothing: unset; */
    }
    /* .anchor */
    a {
      cursor: pointer;
      text-decoration: none;
      color: ${colors.primary};
      &:hover {
        color: ${colors.primary};
      }
    }
    /* 统一整个页面输入框的placeholder颜色以及光标颜色 */
    input {
      caret-color: ${colors.primary};
      &::placeholder {
        color: ${colors.text20} !important;
      }
    }
    * {
      /*&::-webkit-scrollbar {
        background: transparent;
        width: 4px;
        height: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 2px;
      }
      &::-webkit-scrollbar-thumb {
        background: ${colors.divider8};
      } */
      scrollbar-width: none; /* 针对Firefox浏览器 */
      &::-webkit-scrollbar {
        display: none; /* 针对Webkit浏览器，如Chrome和Safari */
      }
    }

    .no-scrollbar {
      &::-webkit-scrollbar {
        background: transparent;
        width: 0;
        height: 0;
      }
    }
    ${isRtl
      ? `
      .horizontal-flip-in-arabic {
        transform: scaleX(-1);
      }
    `
      : ''}
    /** 组件库全局样式覆写-开始 */
    // 加一个form全局label的样式
    .kux-trade4-global-label {
      font-size: 12px;
      line-height: 20px;
      color: ${colors.text60};
      margin-bottom: 8px;
    }
    // 挂在body上的popur样式覆写
    .kux-trade4-tooltip-root {
      background-color: ${colors.tip} !important;
      .KuxTooltip-arrow {
        & > span {
          background-color: ${colors.tip} !important;
        }
      }
      &.kux-trade4-tooltip-small {
        .KuxTooltip-arrow {
          width: 12px;
          & > span {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
    .kux-trade4-datePicker-popup {
      // TODO v3下线后去掉
      /* 解决3.0 src/style/global.less global样式污染的大坑 */
      .rc-picker-panel {
        background: transparent !important;
      }
      &.rc-picker-dropdown
        .rc-picker-panel-container
        .rc-picker-footer
        .rc-picker-ranges
        .rc-picker-ok
        button {
        color: ${colors.primary} !important;
        &:disabled {
          color: ${colors.cover} !important;
        }
      }
    }
    /** 组件库全局样式覆写-结束 */

    [dir='rtl'] & .iconRtl {
      transform: rotateY(-180deg);
    }
    .iconRtl {
      display: flex;
      ${fx.alignItems('center')}
      svg {
        display: block;
      }
    }

    .orderbook-lp {
      display: block;
      /* vertical-align: middle; */
      color: ${colors.text40}!important;
      font-size: 12px;
      font-weight: 500;
    }
    .orderbook-content,
    .recent-trade {
      .ReactVirtualized__List::-webkit-scrollbar {
        display: none;
      }
    }
    .sm .order-book .orderbook-list-sell .orderbook-notfilled {
      display: flex;
      ${fx.alignItems('flex-end')}
      .ReactVirtualized__Grid__innerScrollContainer {
        width: 100% !important;
      }
    }
    ${futuresTableStyle({ colors, fonts })}

    [dir=ltr].symbol-select {
      text-align: left;
    }
    .pnl-alert-dialog {
      .KuxDialog-content {
        overflow: visible;
      }
    }
    .futures-pnl-guides {
      position: absolute;
      right: 5px;
      top: 30px;
    }
  `;
  return <Global styles={style} />;
};
