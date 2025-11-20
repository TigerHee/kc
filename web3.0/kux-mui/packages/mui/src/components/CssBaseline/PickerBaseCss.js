import React from 'react';
import useTheme from 'hooks/useTheme';
import { css, Global } from 'emotion/index';

export default function RcPickerCss() {
  const { colors, fonts, breakpoints } = useTheme();
  return (
    <>
      <Global
        styles={css`
          .KuxPicker {
            position: relative;
            display: inline-flex;
          }
          .KuxPicker-rtl {
            direction: rtl;
          }
          .KuxPicker-panel {
            display: inline-block;
            vertical-align: top;
          }
          .KuxPicker-panel-focused {
            border-color: blue;
          }
          .KuxPicker-panel-rtl {
            direction: rtl;
          }
          .KuxPicker-decade-panel,
          .KuxPicker-year-panel,
          .KuxPicker-month-panel,
          .KuxPicker-week-panel,
          .KuxPicker-date-panel,
          .KuxPicker-time-panel {
            display: flex;
            flex-direction: column;
          }
          .KuxPicker-decade-panel table,
          .KuxPicker-year-panel table,
          .KuxPicker-month-panel table,
          .KuxPicker-week-panel table,
          .KuxPicker-date-panel table,
          .KuxPicker-time-panel table {
            text-align: center;
            border-collapse: collapse;
          }
          .KuxPicker-header {
            display: flex;
          }
          .KuxPicker-header > * {
            flex: none;
          }
          .KuxPicker-header-view {
            flex: auto;
            text-align: center;
          }
          .KuxPicker-header-view > button {
            padding: 0;
            border: 0;
            &:last-of-type {
              margin-left: 12px;
              [dir='rtl'] & {
                margin-left: 0px;
                margin-right: 12px;
              }
            }
          }
          .KuxPicker-cell {
            color: #aaa;
          }
          .KuxPicker-cell-disabled {
            opacity: 0.2;
          }
          .KuxPicker-cell-inner {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            height: 20px;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 20px;
            background: transparent;
            border: 0;
            border: none;
            outline: none;
            cursor: pointer;
          }
          .KuxPicker-cell-in-view {
            color: #333;
          }
          .KuxPicker-cell-range-hover-start,
          .KuxPicker-cell-range-hover-end,
          .KuxPicker-cell-range-hover {
            position: relative;
          }
          .KuxPicker-cell-range-hover-start::after,
          .KuxPicker-cell-range-hover-end::after,
          .KuxPicker-cell-range-hover::after {
            position: absolute;
            top: 3px;
            right: 0;
            bottom: 0;
            left: 0;
            border: 1px solid green;
            border-right: 0;
            border-left: 0;
            content: '';
            pointer-events: none;
          }
          .KuxPicker-cell-range-hover-start::after {
            border-left: 1px solid green !important;
          }
          .KuxPicker-cell-range-hover-end::after {
            border-right: 1px solid green !important;
          }
          .KuxPicker-cell-range-start > .KuxPicker-cell-inner,
          .KuxPicker-cell-range-end > .KuxPicker-cell-inner,
          .KuxPicker-cell-selected > .KuxPicker-cell-inner {
            background: rgba(0, 0, 255, 0.2);
          }
          .KuxPicker-presets {
            background: #ccccff;
          }
          .KuxPicker-presets ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .KuxPicker-ranges {
            margin: 0;
            padding: 0;
            overflow: hidden;
            list-style: none;
          }
          .KuxPicker-ranges > li {
            display: inline-block;
          }
          .KuxPicker-ok {
            float: right;
          }
          .KuxPicker-year-panel .KuxPicker-cell-inner,
          .KuxPicker-month-panel .KuxPicker-cell-inner {
            width: 80px;
          }
          .KuxPicker-week-panel-row:hover .KuxPicker-cell {
            background: red;
          }
          .KuxPicker-week-panel-row-selected .KuxPicker-cell {
            background: rgba(0, 0, 255, 0.3);
          }
          .KuxPicker-week-panel-row-range-hover .KuxPicker-cell {
            background: rgba(0, 255, 0, 0.1);
          }
          .KuxPicker-week-panel-row-range-start .KuxPicker-cell,
          .KuxPicker-week-panel-row-range-end .KuxPicker-cell {
            background: rgba(0, 255, 0, 0.3);
          }
          .KuxPicker-week-panel .KuxPicker-cell,
          .KuxPicker-week-panel .KuxPicker-cell-inner {
            width: 20px;
          }
          .KuxPicker-week-panel .KuxPicker-cell-week {
            color: #999;
            font-weight: bold;
            font-size: 12px;
          }
          .KuxPicker-week-panel .KuxPicker-cell:hover > .KuxPicker-cell-inner,
          .KuxPicker-week-panel .KuxPicker-cell-selected > .KuxPicker-cell-inner {
            background: transparent;
          }
          .KuxPicker-date-panel .KuxPicker-cell-inner {
            width: 20px;
          }
          .KuxPicker-time-panel {
            width: auto;
          }
          .KuxPicker-time-panel .KuxPicker-content {
            position: relative;
            display: flex;
            max-height: 200px;
          }
          .KuxPicker-time-panel-column-title {
            font-size: 14px;
            line-height: 20px;
          }
          .KuxPicker-time-panel-column {
            flex: auto;
            width: 50px;
            margin: 0;
            padding: 0 0 180px;
            overflow-x: hidden;
            overflow-y: hidden;
            font-size: 12px;
            text-align: left;
            list-style: none;
            transition: background 0.3s;
          }
          .KuxPicker-time-panel-column-active {
            background: rgba(0, 0, 255, 0.1);
          }
          .KuxPicker-time-panel-column:hover {
            overflow-y: auto;
          }
          .KuxPicker-time-panel-column > li {
            margin: 0;
            padding: 0;
            cursor: pointer;
          }
          .KuxPicker-time-panel-column > li.KuxPicker-time-panel-cell-disabled {
            opacity: 0.5;
          }
          .KuxPicker-time-panel-column > li .KuxPicker-time-panel-cell-inner {
            display: block;
            width: 100%;
            height: 20px;
            margin: 0;
            color: #333;
            line-height: 20px;
            text-align: center;
          }
          .KuxPicker-panel-rtl .KuxPicker-time-panel-column > li .KuxPicker-time-panel-cell-inner {
            padding: 0 12px 0 0;
            text-align: right;
          }
          .KuxPicker-datetime-panel {
            display: flex;
          }
          .KuxPicker-datetime-panel .KuxPicker-time-panel {
            border-left: 1px solid #999;
          }
          .KuxPicker-datetime-panel .KuxPicker-date-panel,
          .KuxPicker-datetime-panel .KuxPicker-time-panel {
            transition: opacity 0.3s;
          }
          .KuxPicker-datetime-panel-active .KuxPicker-date-panel,
          .KuxPicker-datetime-panel-active .KuxPicker-time-panel {
            opacity: 0.3;
          }
          .KuxPicker-datetime-panel-active .KuxPicker-date-panel-active,
          .KuxPicker-datetime-panel-active .KuxPicker-time-panel-active {
            opacity: 1;
          }
          .KuxPicker-input {
            position: relative;
            display: inline-flex;
            width: 100%;
          }
          .KuxPicker-rtl .KuxPicker-input {
            text-align: right;
          }
          .KuxPicker-input-active > input {
            background: rgba(0, 0, 255, 0.05);
          }
          .KuxPicker-input > input {
            width: 100%;
          }
          .KuxPicker-input > input::-moz-placeholder {
            opacity: 1;
          }
          .KuxPicker-input > input:placeholder-shown {
            text-overflow: ellipsis;
          }
          .KuxPicker-input-placeholder > input {
            color: #bfbfbf;
          }
          .KuxPicker-clear {
            position: absolute;
            top: 0;
            right: 4px;
            cursor: pointer;
          }
          .KuxPicker-rtl .KuxPicker-clear {
            right: auto;
            left: 4px;
          }
          .KuxPicker-clear-btn::after {
            content: '×';
          }
          .KuxPicker-dropdown {
            position: absolute;
            box-shadow: 0 0 1px red;
            pointer-events: none;
          }
          .KuxPicker-dropdown-range {
            padding: 10px 0;
          }
          .KuxPicker-dropdown-hidden {
            display: none;
          }
          .KuxPicker-dropdown-placement-topLeft .KuxPicker-range-arrow,
          .KuxPicker-dropdown-placement-topRight .KuxPicker-range-arrow {
            bottom: 10px / 2 + 1px;
            transform: rotate(135deg);
          }
          .KuxPicker-dropdown-placement-bottomLeft .KuxPicker-range-arrow,
          .KuxPicker-dropdown-placement-bottomright .KuxPicker-range-arrow {
            top: 6px;
            transform: rotate(-45deg);
          }
          .KuxPicker-dropdown .KuxPicker-range-arrow {
            position: absolute;
            left: 10px;
            z-index: 1;
            width: 10px;
            height: 10px;
            margin-left: 10px;
            transition: all 0.3s;
          }
          .KuxPicker-dropdown-rtl.KuxPicker-dropdown .KuxPicker-range-arrow {
            right: 10px;
            left: auto;
            margin-right: 10px;
            margin-left: 0;
          }
          .KuxPicker-dropdown .KuxPicker-range-arrow::before,
          .KuxPicker-dropdown .KuxPicker-range-arrow::after {
            position: absolute;
            top: 50%;
            left: 50%;
            box-sizing: border-box;
            transform: translate(-50%, -50%);
            content: '';
          }
          .KuxPicker-dropdown-rtl.KuxPicker-dropdown .KuxPicker-range-arrow::before,
          .KuxPicker-dropdown-rtl.KuxPicker-dropdown .KuxPicker-range-arrow::after {
            right: 50%;
            left: auto;
            transform: translate(50%, -50%);
          }
          .KuxPicker-dropdown .KuxPicker-range-arrow::before {
            width: 10px;
            height: 10px;
            border: 5px solid blue;
            border-color: blue blue transparent transparent;
          }
          .KuxPicker-dropdown .KuxPicker-range-arrow::after {
            width: 8px;
            height: 8px;
            border: 8px / 2 solid blue;
            border-color: #fff0ff #fff0ff transparent transparent;
          }
          .KuxPicker-range {
            position: relative;
            display: inline-flex;
          }
          .KuxPicker-range-wrapper {
            display: flex;
          }
          .KuxPicker-range .KuxPicker-active-bar {
            bottom: 0;
            height: 3px;
            background: green;
            opacity: 0;
            transition: all 0.3s;
            pointer-events: none;
          }
          .KuxPicker-range.KuxPicker-focused .KuxPicker-active-bar {
            opacity: 1;
          }
          .KuxPicker-panel-container {
            display: inline-block;
            vertical-align: top;
            transition: margin 0.3s;
            pointer-events: all;
          }
          .KuxPicker-panel-layout {
            display: flex;
            flex-wrap: nowrap;
            align-items: stretch;
          }
          .KuxPicker-selector {
            width: 100%;
          }
          .KuxPicker-selection-overflow {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            width: 100%;
            border: 1px solid green;
          }
          .KuxPicker-selection-overflow-item {
            flex: none;
            max-width: 100%;
          }
          .KuxPicker-selection-item {
            border: 1px solid blue;
          }
          .KuxPicker-multiple-input {
            width: 10px;
            opacity: 0.1;
          }
        `}
      />
      <Global
        styles={css`
          .KuxDatePicker-Dropdown {
            &.KuxDatePicker-Dropdown-time {
              width: 288px;
            }
            .KuxPicker-dropdown {
              box-shadow: 0px 0px 40px ${colors.cover4} !important;
              background: ${colors.layer};
              border-radius: 8px;
              z-index: 1000;
            }
            .KuxPicker-panel-container {
              width: 100%;
            }
            .KuxPicker-panel {
              width: 100%;
              background: transparent;
              border: none;
              .KuxPicker-month-panel,
              .KuxPicker-date-panel,
              .KuxPicker-year-panel,
              .KuxPicker-decade-panel {
                .KuxPicker-header {
                  height: 46px;
                  padding: 8px 16px 0;
                  border-bottom: 1px solid ${colors.divider4};
                  .KuxPicker-header-super-prev-btn,
                  .KuxPicker-header-super-next-btn,
                  .KuxPicker-header-prev-btn,
                  .KuxPicker-header-next-btn {
                    border: none;
                    outline: none;
                    background: transparent;
                    font-family: ${fonts.family};
                    [dir='rtl'] & {
                      svg {
                        transform: rotate(180deg);
                      }
                    }
                  }
                  .KuxPicker-header-view {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 130%;
                    color: ${colors.text};
                    .KuxPicker-month-btn,
                    .KuxPicker-year-btn,
                    .KuxPicker-decade-btn {
                      border: none;
                      outline: none;
                      background: transparent;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 130%;
                      color: ${colors.text};
                      font-family: ${fonts.family};
                    }
                    .KuxPicker-year-btn {
                      margin-left: 12px;
                      [dir='rtl'] & {
                        margin-left: 0px;
                        margin-right: 12px;
                      }
                    }
                  }
                }
              }
              .KuxPicker-month-panel,
              .KuxPicker-year-panel,
              .KuxPicker-decade-panel {
                .KuxPicker-body {
                  width: 288px;
                  height: 266px;
                  padding: 20px 11px 16px 11px;
                  table {
                    width: 100%;
                    height: 100%;
                    tbody {
                      tr {
                        td {
                          height: 32px;
                          width: 80.66px;
                          .KuxPicker-cell-inner {
                            height: 32px;
                            line-height: 32px;
                            font-size: 14px;
                            font-weight: 500;
                            border-radius: 20px;
                            color: ${colors.text};
                            &:hover {
                              background: ${colors.primary12};
                              color: ${colors.primary};
                            }
                          }
                          &.KuxPicker-cell-selected {
                            .KuxPicker-cell-inner {
                              background: ${colors.primary};
                              color: #fff;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
              .KuxPicker-date-panel {
                .KuxPicker-body {
                  padding: 0 11px 11px;
                  width: 100%;
                  table {
                    border-spacing: 0;
                  }
                  thead {
                    tr {
                      display: flex;
                    }
                    th {
                      width: 38px;
                      height: 38px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      font-size: 14px;
                      color: ${colors.text30};
                      font-weight: 500;
                    }
                  }
                  tbody {
                    tr {
                      display: flex;
                    }
                    td {
                      height: 38px;
                      width: 38px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      color: ${colors.text20};
                      &.KuxPicker-cell-in-view {
                        color: ${colors.text};
                      }
                      &.KuxPicker-cell-today {
                        color: ${colors.primary};
                        background: ${colors.primary12};
                        border-radius: 100%;
                        .KuxPicker-cell-inner {
                          border: none;
                        }
                      }
                      .KuxPicker-cell-inner {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        width: 38px;
                        height: 38px;
                        font-size: 14px;
                        line-height: 130%;
                        border-radius: 100%;
                        font-weight: 500;
                        transition: none;
                        &:hover {
                          color: ${colors.primary};
                          background: ${colors.primary12};
                        }
                      }
                      &.KuxPicker-cell-selected {
                        .KuxPicker-cell-inner {
                          background: ${colors.primary};
                          color: #fff;
                        }
                      }
                      &.KuxPicker-cell-disabled {
                        opacity: 1;
                        .KuxPicker-cell-inner {
                          cursor: not-allowed;
                          color: ${colors.text40};
                          &:hover {
                            background: transparent;
                          }
                        }
                        &.KuxPicker-cell-selected {
                          .KuxPicker-cell-inner {
                            background: ${colors.primary12};
                          }
                        }
                      }
                      &:not(.KuxPicker-cell-in-view) {
                        .KuxPicker-cell-inner:hover {
                          border-radius: 0;
                          background: ${colors.cover4};
                          color: ${colors.text30};
                        }
                      }
                    }
                  }
                }
              }

              .KuxPicker-time-panel {
                width: 288px;
                .KuxPicker-content {
                  padding: 4px 8px;
                  height: 288px;
                  max-height: 288px;
                  .KuxPicker-time-panel-column {
                    width: 33.33%;
                    scrollbar-width: none;
                    &::-webkit-scrollbar {
                      display: none;
                    }
                    li {
                      height: 40px;
                      padding: 0 4px;
                      display: flex;
                      align-items: center;
                      .KuxPicker-time-panel-cell-inner {
                        height: 32px;
                        padding-left: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 14px;
                        color: ${colors.text};
                        font-weight: 500;
                        border-radius: 20px;
                        &:hover {
                          background: ${colors.primary8};
                          color: ${colors.primary};
                        }
                      }
                      &.KuxPicker-time-panel-cell-selected {
                        .KuxPicker-time-panel-cell-inner {
                          background: ${colors.primary};
                          color: #fff;
                          font-weight: 500;
                        }
                      }
                    }
                  }
                }
              }
            }
            .KuxPicker-footer {
              height: 46px;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              background: ${colors.layer};
              border-radius: 0 0 8px 8px;
              .KuxPicker-ranges {
                padding-right: 16px;
                .KuxPicker-now,
                .KuxPicker-ok {
                  padding: 10px 12px;
                  font-size: 14px;
                  font-weight: 500;
                  cursor: pointer;
                  color: ${colors.primary};
                  button {
                    font-family: ${fonts.family};
                  }
                }
                .KuxPicker-ok {
                  margin-left: 12px;
                  button {
                    outline: none;
                    border: none;
                    background: transparent;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    color: ${colors.primary};
                    &:disabled {
                      color: ${colors.text40};
                      cursor: default;
                    }
                  }
                }
              }
            }
          }
        `}
      />
      <Global
        styles={css`
          .KuxRangePicker-Dropdown {
            .KuxPicker-dropdown-range {
              box-shadow: 0px 0px 40px ${colors.cover4} !important;
              background: ${colors.layer};
              border-radius: 8px;
              padding: 0;
              z-index: 1000;
            }
            .KuxPicker-range-arrow {
              display: none;
            }
            .KuxPicker-panels {
              ${breakpoints.down('sm')} {
                display: flex;
                flex-direction: column;
              }
            }
            .KuxPicker-header {
              height: 46px;
              padding: 8px 16px 0;
              border-bottom: 1px solid ${colors.divider4};
            }
            .KuxPicker-header-super-prev-btn,
            .KuxPicker-header-super-next-btn,
            .KuxPicker-header-prev-btn,
            .KuxPicker-header-next-btn {
              border: none;
              outline: none;
              background: transparent;
              font-family: ${fonts.family};
              [dir='rtl'] & {
                svg {
                  transform: rotate(180deg);
                }
              }
            }
            .KuxPicker-header-view {
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 14px;
              font-weight: 500;
              line-height: 130%;
              color: ${colors.text};
              .KuxPicker-month-btn,
              .KuxPicker-year-btn,
              .KuxPicker-decade-btn {
                border: none;
                outline: none;
                background: transparent;
                font-size: 14px;
                font-weight: 500;
                line-height: 130%;
                color: ${colors.text};
                font-family: ${fonts.family};
              }
              .KuxPicker-year-btn {
                margin-left: 12px;
                [dir='rtl'] & {
                  margin-left: 0px;
                  margin-right: 12px;
                }
              }
            }
            .KuxPicker-body {
              padding: 0 11px 16px;
            }
            table {
              width: 100%;
              height: 100%;
            }
            tr {
              display: flex;
            }
            td {
              padding: 0;
            }
            .KuxPicker-cell-inner {
              flex-shrink: 0;
              font-size: 14px;
              font-weight: 500;
              color: ${colors.text20};
            }
            .KuxPicker-month-panel,
            .KuxPicker-year-panel,
            .KuxPicker-decade-panel {
              .KuxPicker-body {
                width: 288px;
                height: 266px;
                padding: 20px 11px 16px 11px;
              }
              tbody {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              tr {
                height: 44.33px;
                justify-content: space-between;
                align-items: center;
              }
              td {
                flex: 1;
                height: 32px;
                display: grid;
                justify-content: center;
                &:first-of-type {
                  justify-content: flex-start;
                }
                &:last-of-type {
                  justify-content: flex-end;
                }
              }
              .KuxPicker-cell-inner {
                width: 80.66px;
                height: 32px;
                line-height: 32px;
                border-radius: 20px;
              }
            }
            .KuxPicker-date-panel {
              th {
                width: 38px;
                height: 38px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                color: ${colors.text30};
                font-weight: 500;
              }
              td {
                width: 38px;
                height: 38px;
              }
              .KuxPicker-cell-inner {
                width: 100%;
                height: 100%;
                line-height: 38px;
                border-radius: 100%;
              }
            }
            .KuxPicker-cell-in-view {
              .KuxPicker-cell-inner {
                color: ${colors.text};
              }
            }
            .KuxPicker-cell-inner:hover {
              color: ${colors.primary};
            }
            .KuxPicker-cell-disabled {
              opacity: 1;
              .KuxPicker-cell-inner {
                cursor: not-allowed;
                color: ${colors.text40};
                border-radius: 0;
                &:hover {
                  background: ${colors.cover4};
                }
              }
            }
            .KuxPicker-month-panel,
            .KuxPicker-year-panel,
            .KuxPicker-decade-panel {
              .KuxPicker-cell-range-start,
              .KuxPicker-cell-range-end {
                .KuxPicker-cell-inner {
                  background: ${colors.primary};
                  color: ${colors.textEmphasis};
                }
              }
              .KuxPicker-cell-range-start,
              .KuxPicker-cell-range-end,
              .KuxPicker-cell-in-range {
                position: relative;
                &:before {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  top: 0;
                  left: 0;
                  content: ' ';
                  background: ${colors.primary12};
                }
              }
              .KuxPicker-cell-range-start {
                .KuxPicker-cell-inner {
                  border-radius: 20px 0 0 20px;
                  [dir='rtl'] & {
                    border-radius: 0 20px 20px 0;
                  }
                }
              }
              .KuxPicker-cell-range-end {
                .KuxPicker-cell-inner {
                  border-radius: 0 20px 20px 0;
                  [dir='rtl'] & {
                    border-radius: 20px 0 0 20px;
                  }
                }
              }
              .KuxPicker-cell-range-start.KuxPicker-cell-range-end {
                .KuxPicker-cell-inner {
                  border-radius: 20px;
                }
                &:before {
                  width: 0;
                }
              }
              .KuxPicker-cell-range-start:before,
              .KuxPicker-cell-range-end:before {
                width: 50%;
              }
              .KuxPicker-cell-range-start:before {
                inset-inline-start: 50%;
              }
              .KuxPicker-cell-range-end:before {
                inset-inline-end: 50%;
              }
            }
            .KuxPicker-date-panel {
              .KuxPicker-cell-range-start,
              .KuxPicker-cell-range-end {
                .KuxPicker-cell-inner {
                  background: ${colors.primary};
                  color: ${colors.textEmphasis};
                }
              }
              .KuxPicker-cell-range-start.KuxPicker-cell-range-end,
              .KuxPicker-cell-in-range {
                .KuxPicker-cell-inner {
                  background: ${colors.primary12};
                }
              }
              .KuxPicker-cell-range-start.KuxPicker-cell-range-end {
                .KuxPicker-cell-inner {
                  color: ${colors.primary};
                }
              }
              .KuxPicker-cell-in-range {
                .KuxPicker-cell-inner {
                  border-radius: 0;
                  color: ${colors.text};
                }
              }
              .KuxPicker-cell-range-start,
              .KuxPicker-cell-range-end {
                position: relative;
              }
              .KuxPicker-cell-range-start:after,
              .KuxPicker-cell-range-end:after {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                content: ' ';
                background: ${colors.primary12};
              }
              .KuxPicker-cell-range-start:after {
                border-radius: 100% 0 0 100%;
                [dir='rtl'] & {
                  border-radius: 0 100% 100% 0;
                }
              }
              .KuxPicker-cell-range-end:after {
                border-radius: 0 100% 100% 0;
                [dir='rtl'] & {
                  border-radius: 100% 0 0 100%;
                }
              }
              .KuxPicker-cell-range-start.KuxPicker-cell-range-end:after {
                border-radius: 100%;
              }
            }
            .KuxPicker-month-panel,
            .KuxPicker-year-panel,
            .KuxPicker-decade-panel {
              .KuxPicker-cell-range-start:after {
                border-radius: 20px 0 0 20px;
                [dir='rtl'] & {
                  border-radius: 0 20px 20px 0;
                }
              }
              .KuxPicker-cell-range-end:after {
                border-radius: 0 20px 20px 0;
                [dir='rtl'] & {
                  border-radius: 20px 0 0 20px;
                }
              }
              .KuxPicker-cell-range-start.KuxPicker-cell-range-end:after {
                border-radius: 20px;
              }
            }
            .KuxPicker-cell:not(.KuxPicker-cell-in-view) {
              &:hover {
                background: ${colors.cover4};
              }
              &.KuxPicker-cell-range-start,
              &.KuxPicker-cell-range-end,
              &.KuxPicker-cell-in-range {
                &:after {
                  width: 0%;
                }
                .KuxPicker-cell-inner {
                  background: transparent;
                  color: ${colors.text20};
                }
              }
            }
          }
        `}
      />
    </>
  );
}
