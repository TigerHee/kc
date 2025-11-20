/*
 * owner: Borden@kupotech.com
 */
import React from 'react';
import { Global, css } from '@kux/mui/emotion';
import { useTheme } from '@emotion/react';
import { useIsRTL } from '@/hooks/common/useLang';
import { TABSET_RADIUS, SPLITTER_SIZE } from '../constants';

// 拖拽层的zIndex
const ZINDEX_FOR_DRAG = 1000;
// 拖拽矩形样式
const getOutlineRectStyle = colors => `
  z-index: 1000;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  background: ${colors.primary8};
  border: 2px solid ${colors.primary};
`;

const FlexLayoutStyle = React.memo(() => {
  const isRtl = useIsRTL();
  const { colors } = useTheme();
  return (
    <Global
      styles={css`
        .flexlayout__center_box {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flexlayout__layout {
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          overflow: hidden;
        }
        .flexlayout__splitter {
          background-color: ${colors.background};
        }
        @media (hover: hover) {
          .flexlayout__splitter:hover {
            background-color: ${colors.primary12};
            transition: background-color ease-in 0.1s;
            transition-delay: 0.05s;
          }
        }
        /* .flexlayout__splitter_border {
          z-index: 10;
        } */
        // 拖动时的分割线
        .flexlayout__splitter_drag {
          z-index: ${ZINDEX_FOR_DRAG};
          background-color: ${colors.primary12};
        }
        /* .flexlayout__splitter_extra {
          background-color: red;
        } */
        // 拖动矩形
        .flexlayout__outline_rect {
          position: absolute;
          ${getOutlineRectStyle(colors)}
        }
        // 跨模块放置区时的拖动矩形
        .flexlayout__outline_rect_edge {
          ${getOutlineRectStyle(colors)}
        }
        // 上下左右4个跨模块放置区
        .flexlayout__edge_rect {
          position: absolute;
          z-index: ${ZINDEX_FOR_DRAG};
          background-color: ${colors.cover16};
          pointer-events: none;
        }
        // 拖动过程中的Tab
        .flexlayout__drag_rect {
          position: absolute;
          cursor: move;
          color: ${colors.text60};
          background-color: ${colors.layer};
          border: 1px solid ${colors.divider8};
          border-radius: 8px;
          z-index: 1000;
          text-align: center;
          display: flex;
          justify-content: center;
          flex-direction: column;
          overflow: hidden;
          padding: 7px 8px;
          word-wrap: break-word;
          font-size: 13px;
          .flexlayout__sideTool_iconBox {
            display: none;
          }
          .flexlayout__sideTool_name {
            width: 100%;
          }
        }
        .flexlayout__tabset {
          display: flex;
          flex-direction: column;
          /* overflow: hidden; */
          background: ${colors.overlay};
          font-size: 13px;
          border-radius: ${TABSET_RADIUS}px;
        }
        /* .flexlayout__tabset_tab_divider {
          width: 4px;
        } */
        .flexlayout__tabset_content {
          display: flex;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
        }
        .flexlayout__tabset_header {
          display: flex;
          align-items: center;
          /* padding: 3px 3px 3px 5px; */
          /* Dark/Background/Overlay */
          /* background: ${colors.background}; */
          /* Dark/Divider/8% */
          /* border-bottom: 1px solid ${colors.divider8}; */
          /* color: ${colors.text60}; */
          /* box-shadow: inset 0 0 3px 0 rgba(136, 136, 136, 0.54); */
        }
        .flexlayout__tabset_header_content {
          flex-grow: 1;
        }
        .flexlayout__tabset_tabbar_outer {
          background-color: ${colors.overlay};
          overflow: hidden;
          display: flex;
        }
        // 模块header和内容的分割线
        .flexlayout__tabset_tabbar_outer_top {
          border-bottom: 1px solid ${colors.divider4};
          border-top-left-radius: ${TABSET_RADIUS}px;
          border-top-right-radius: ${TABSET_RADIUS}px;
        }
        /* .flexlayout__tabset_tabbar_outer_bottom {
          border-top: 1px solid blue;
        } */
        .flexlayout__tabset_tabbar_inner {
          position: relative;
          display: flex;
          flex-grow: 1;
          overflow: hidden;
        }
        .flexlayout__tabset_tabbar_inner_tab_container {
          display: flex;
          /* padding-left: 4px;
          padding-right: 4px; */
          position: absolute;
          top: 0;
          bottom: 0;
          width: 10000px;
        }
        /* .flexlayout__tabset_tabbar_inner_tab_container_top {
          border-top: 2px solid transparent;
        }
        .flexlayout__tabset_tabbar_inner_tab_container_bottom {
          border-bottom: 2px solid transparent;
        } */
        /* .flexlayout__tabset-selected {
          background-color: red;
        } */
        /* .flexlayout__tabset-maximized {
          background-color: red;
        } */
        .flexlayout__tab_button_stamp {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }
        // 模块内容区域
        .flexlayout__tab {
          /* overflow: auto; */
          position: absolute;
          background-color: ${colors.overlay};
          color: ${colors.text};
          border-bottom-left-radius: ${TABSET_RADIUS}px;
          border-bottom-right-radius: ${TABSET_RADIUS}px;
        }
        .flexlayout__tab_button {
          display: flex;
          align-items: center;
          padding: 0 4px 0 8px;
          cursor: pointer;
          border-right: 1px solid ${colors.divider4};
        }
        .flexlayout__tab_button_top {
          flex-direction: ${isRtl ? 'row-reverse' : 'row'};
        }
        .flexlayout__tab_button--selected {
          background-color: ${colors.cover4};
          color: ${colors.text};
        }
        @media (hover: hover) {
          .flexlayout__tab_button:hover {
            background-color: ${colors.cover4};
            color: ${colors.text};
          }
        }
        .flexlayout__tab_button--unselected {
          background-color: transparent;
          color: ${colors.text60};
        }
        .flexlayout__tab_button_leading {
          display: flex;
        }
        .flexlayout__tab_button_content {
          display: flex;
        }
        .flexlayout__tab_button_textbox {
          border: none;
          font-size: 13px;
          /* color: var(--color-tab-textbox); */
          /* background-color: red; */
          /* border: 1px inset var(--color-1); */
          border-radius: 3px;
          width: 10em;
        }
        .flexlayout__tab_button_textbox:focus {
          outline: none;
        }
        .flexlayout__tab_button_trailing {
          display: flex;
          visibility: hidden;
          border-radius: 4px;
        }
        .flexlayout__tab_custom_disabled {
          cursor: default;
        }
        /* .flexlayout__tab_button_trailing:hover {
          background-color: red;
        } */
        @media (hover: hover) {
          .flexlayout__tab_button:not(.flexlayout__tab_custom_disabled):hover {
            .flexlayout__tab_button_trailing {
              visibility: visible;
            }
          }
        }
        .flexlayout__tab_button--selected:not(.flexlayout__tab_custom_disabled) {
          .flexlayout__tab_button_trailing {
            visibility: visible;
          }
        }
        .flexlayout__tab_button_overflow {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          border: none;
          color: ${colors.text};
          font-size: inherit;
          background-color: transparent;
          cursor: pointer;
        }
        .flexlayout__tab_button_overflow_count {
          margin-right: 2px;
        }
        .flexlayout__tab_toolbar {
          display: flex;
          align-items: center;
          padding-left: 0.5em;
          padding-right: 0.3em;
        }
        /* .flexlayout__tab_toolbar_button {
          border: none;
          outline: none;
          font-size: inherit;
          margin: 0px;
          background-color: transparent;
          border-radius: 4px;
          padding: 1px;
        } */
        @media (hover: hover) {
          .flexlayout__tab_toolbar_button:hover {
            /* background-color: red; */
          }
        }
        .flexlayout__tab_toolbar_sticky_buttons_container {
          display: flex;
          padding-left: 5px;
          align-items: center;
        }
        .flexlayout__tab_floating {
          overflow: auto;
          position: absolute;
          /* color: yellow; */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .flexlayout__tab_floating_inner {
          overflow: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .flexlayout__tab_floating_inner div {
          margin-bottom: 5px;
          text-align: center;
        }
        .flexlayout__tab_floating_inner div a {
          color: royalblue;
        }
        .flexlayout__border {
          overflow: hidden;
          display: flex;
          font-size: 12px;
          color: ${colors.text24};
          background-color: ${colors.overlay};
        }
        .flexlayout__border_right {
          border-left: ${SPLITTER_SIZE}px solid ${colors.background};
          align-content: center;
          flex-direction: column;
          [dir='rtl'] & {
            border-right: ${SPLITTER_SIZE}px solid ${colors.background};
          }
        }
        .flexlayout__border_inner {
          position: relative;
          display: flex;
          overflow: hidden;
          flex-grow: 1;
        }
        .flexlayout__border_inner_tab_container {
          white-space: nowrap;
          display: flex;
          align-items: center;
          padding-left: 5px;
          padding-right: 5px;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 10000px;
        }
        .flexlayout__border_inner_tab_container_right {
          transform-origin: top left;
          transform: rotate(90deg);
          [dir='rtl'] & {
            transform-origin: top right;
          }
        }
        .flexlayout__border_inner_tab_container_left {
          flex-direction: row-reverse;
          transform-origin: top right;
          transform: rotate(-90deg);
        }
        /* .flexlayout__border_tab_divider {
          width: 4px;
        } */
        .flexlayout__border_button {
          height: fit-content;
          display: flex;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
          /* box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15); */
          border-radius: 3px;
          transform: rotate(-90deg);
          margin-left: 9px;
          &:not(:first-of-type) {
            margin-left: 12px;
          }
        }
        // 工具栏工具被选择后
        /* .flexlayout__border_button--selected {
          background-color: red;
          color: ${colors.text};
        }
        @media (hover: hover) {
          .flexlayout__border_button:hover {
            background-color: red;
            color: ${colors.text};
          }
        } */
        .flexlayout__border_button--unselected {
          background-color: transparent;
          color: ${colors.text24};
        }
        .flexlayout__border_button_leading {
          display: flex;
        }
        .flexlayout__border_button_content {
          display: flex;
        }
        .flexlayout__border_button_trailing {
          display: none;
        }
        @media (hover: hover) {
          .flexlayout__border_button:hover .flexlayout__border_button_trailing {
            visibility: visible;
          }
        }
        .flexlayout__border_button--selected .flexlayout__border_button_trailing {
          visibility: visible;
        }
        .flexlayout__border_toolbar {
          display: flex;
          align-items: center;
        }
        .flexlayout__border_toolbar_left, .flexlayout__border_toolbar_right {
          display: none;
        }
        .flexlayout__border_toolbar_top, .flexlayout__border_toolbar_bottom {
          padding-left: 0.5em;
          padding-right: 0.3em;
        }
        .flexlayout__border_toolbar_button {
          border: none;
          outline: none;
          font-size: inherit;
          background-color: transparent;
          border-radius: 4px;
          padding: 1px;
        }
        .flexlayout__border_toolbar_button_overflow {
          display: flex;
          align-items: center;
          border: none;
          color: yellow;
          font-size: inherit;
          background-color: transparent;
        }
        .flexlayout__popup_menu {
          font-size: 13px;
        }
        .flexlayout__popup_menu_item {
          padding: 11px 12px;
          white-space: nowrap;
          font-size: 14px;
          line-height: 130%;
          cursor: pointer;
        }
        @media (hover: hover) {
          .flexlayout__popup_menu_item:hover {
            background-color: ${colors.cover4};
          }
        }
        .flexlayout__popup_menu_container {
          background: ${colors.layer};
          border: 1px solid ${colors.cover4};
          box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          color: ${colors.text};
          position: absolute;
          z-index: 1000;
          max-height: 50%;
          transform: translate3d(4px, 26px, 0);
          overflow: auto;
        }
        .flexlayout__floating_window _body {
          height: 100%;
        }
        .flexlayout__floating_window_content {
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          position: absolute;
        }
        .flexlayout__floating_window_tab {
          overflow: auto;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          background-color: ${colors.overlay};
        }
        .flexlayout__error_boundary_container {
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          position: absolute;
          display: flex;
          justify-content: center;
        }
        .flexlayout__error_boundary_content {
          display: flex;
          align-items: center;
        }
        .flexlayout__tabset_sizer {
          padding-top: 5px;
          padding-bottom: 3px;
          font-size: 13px;
        }
        .flexlayout__tabset_header_sizer {
          padding-top: 3px;
          padding-bottom: 3px;
          font-size: 13px;
        }
        .flexlayout__border_sizer {
          padding-top: 6px;
          padding-bottom: 5px;
          font-size: 13px;
        }
      `}
    />
  );
});

export default FlexLayoutStyle;
