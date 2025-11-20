/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo } from 'react';
import styled from '@emotion/styled';
import RcCascader from 'rc-cascader';
import { Global, css } from '@emotion/react';
import { useTheme } from '@kux/mui';

export const RcCascaderWrapper = styled(RcCascader)`
  .input {
    &,
    & > * {
      background-color: transparent !important;
    }
    width: 100%;
    cursor: pointer;
    input {
      padding-right: 28px;
      cursor: pointer;
      caret-color: transparent;
    }
  }
  &.picker {
    position: relative;
    display: inline-block;
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    border-radius: 4px;
    outline: 0;
    cursor: pointer;
    &:hover {
      .pickerClear {
        opacity: 1;
      }
    }
    &.disabled {
      color: fade(#01081e, 38);
      background: transparent;
      cursor: not-allowed;
      .input {
        cursor: not-allowed;
      }
    }

    fieldset {
      border: none;
    }
  }
  &.withValue {
    .pickerLabel {
      // color: transparent;
      opacity: 0;
    }
  }
  .pickerLabel {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 18px 0 16px;
    // overflow: hidden;
    font-size: 16px;
    line-height: 100%;
    font-weight: 700;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
  }

  .pickerClear {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 2;
    width: 14px;
    height: 14px;
    margin-top: -7px;
    line-height: 14px;
    background: ${(props) =>
      (props.theme.currentTheme === 'dark' ? '#2E2E2F' : '#f5f5f6')};
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
  }
  .pickerArrow {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 1;
    margin-left: 6px;
    transform: translateY(-50%) rotate(-180deg);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: ${(props) => props.theme.colors.text60};

    &Expand {
      transform: translateY(-50%) rotate(0deg);
    }
  }
`;

export const SelectedOption = styled.div`
  .isolatedLabel {
    display: flex;
    align-items: center;
    svg {
      path {
        fill: ${({ theme }) => theme.colors.icon60};
      }
      flex-shrink: 0;
      margin-right: 16px;
    }
    .account {
      font-weight: 700;
      font-size: 16px;
    }
    .symbol {
      margin-top: 2px;
      color: ${({ theme }) => theme.colors.text30};
      font-weight: 500;
      font-size: 14px;
    }
  }
`;

// 全局样式， 可以用className
export const GlobalStyle = memo(() => {
  const { colors } = useTheme();
  const style = css`
    .popup {
      position: absolute;
      z-index: 9999;
      padding: 8px 0;
      font-size: 13px;
      white-space: nowrap;
      background: ${colors.layer};
      border-radius: 4px;
      /* box-shadow: 0 1px 6px ${colors.cover20}; */
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1),
        8px 0px 24px rgba(0, 0, 0, 0.16);

      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
        background: transparent;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        /* background: fade(#01081e, 16); */
        border-radius: 2px;
      }
    }

    .kc-cascader-20210430-menu {
      display: inline-block;
      min-width: 320px;
      max-height: 320px;
      margin: 0;
      padding: 0;
      overflow: auto;
      vertical-align: top;
      list-style: none;
      &:not(:first-of-type) {
        border-left: 1px solid ${colors.divider8};
      }
      &-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        color: ${colors.text};
        font-size: 14px;
        cursor: pointer;
        &:hover {
          background: ${colors.cover2};
        }
        &-disabled {
          color: ${colors.text40};
          cursor: not-allowed;
          &:hover {
            background: transparent;
          }
        }
        &-active {
          background: ${colors.cover2};
          &:not(&-disabled) {
            &,
            &:hover {
              font-weight: 500 !important;
              background: ${colors.cover2};
            }
          }
        }

        &-expand-icon {
          display: flex;
          align-items: center;
        }
      }
    }

    @keyframes kcSlideUpOut {
      0% {
        transform: scaleY(1);
        transform-origin: 0% 0%;
        opacity: 1;
      }
      100% {
        transform: scaleY(0.8);
        transform-origin: 0% 0%;
        opacity: 0;
      }
    }

    @keyframes kcSlideDownIn {
      0% {
        transform: scaleY(0.8);
        transform-origin: 100% 100%;
        opacity: 0;
      }
      100% {
        transform: scaleY(1);
        transform-origin: 100% 100%;
        opacity: 1;
      }
    }

    @keyframes kcSlideDownOut {
      0% {
        transform: scaleY(1);
        transform-origin: 100% 100%;
        opacity: 1;
      }
      100% {
        transform: scaleY(0.8);
        transform-origin: 100% 100%;
        opacity: 0;
      }
    }

    .kc-cascader-20210430 {
      &-menus {
        &-empty,
        &-hidden {
          display: none;
        }
        &.slide-up-enter.slide-up-enter-active&-placement-bottomLeft,
        &.slide-up-appear.slide-up-appear-active&-placement-bottomLeft {
          animation-name: kcSlideUpIn;
        }

        &.slide-up-enter.slide-up-enter-active&-placement-topLeft,
        &.slide-up-appear.slide-up-appear-active&-placement-topLeft {
          animation-name: kcSlideDownIn;
        }

        &.slide-up-leave.slide-up-leave-active&-placement-bottomLeft {
          animation-name: kcSlideUpOut;
        }

        &.slide-up-leave.slide-up-leave-active&-placement-topLeft {
          animation-name: kcSlideDownOut;
        }
      }
    }
  `;
  return <Global styles={style} />;
});
