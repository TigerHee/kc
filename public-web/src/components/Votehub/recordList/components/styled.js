/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 18:22:34
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 22:23:16
 * @FilePath: /public-web/src/components/Votehub/recordList/components/styled.js
 * @Description:
 */

import { styled } from '@kux/mui';

export const TabBox = styled.div`
  display: flex;
  margin-top: 40px;
  margin-bottom: 24px;
  justify-content: space-between;
  .KuxTabs-container {
    height: max-content;
  }
  .KuxTabs-indicator {
    height: 4px;
    border-radius: 2px;
    & > span {
      height: 4px; // 覆盖原本样式的6px
    }
  }
  .KuxTab-TabItem {
    padding-bottom: 12px;
    font-size: 20px;
    font-family: Roboto;
    line-height: 1.3;
    :not(:first-of-type) {
      margin-left: 24px;
    }
  }
  .KuxTab-selected {
    font-weight: 700;
  }

  &.h5_TabBox {
    margin: 20px 0px;
    padding: 0px 16px;
    border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
    .KuxTabs-container {
      height: max-content;
    }
    .KuxTab-TabItem {
      padding-bottom: 12px;
      font-size: 14px;
      font-family: Roboto;
      line-height: 1.3;
      :not(:first-of-type) {
        margin-left: 24px;
      }
    }
    .KuxTab-selected {
      font-weight: 600;
    }
  }

  .right_svg__icon {
    [dir='rtl'] & {
      transform: rotateY(0deg);
    }
  }

  .left_svg__icon {
    [dir='rtl'] & {
      transform: rotateY(0deg);
    }
  }
`;

export const ContentBody = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  .KuxSpin-root {
    flex: 1;
    width: 100%;
  }
  .KuxSpin-container {
    width: 100%;
    height: 100%;
  }
  .KuxSpin-wrapper {
    [dir='rtl'] & {
      top: 50%;
      right: 50%;
      transform: translate3d(50%, -50%, 0);
    }
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0;
    &.h5_ContentBody {
      padding: 0px 16px;
    }
  }
`;

export const BaseContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  //  padding: 0 16px;
  h1 {
    padding: 0 16px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 24px;
    h1 {
      padding: 40px 0 0;
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0;
    h1 {
      padding: 40px 0 0;
    }
  }
  nav.KuxPagination-navigation {
    .KuxPagination-item {
      button {
        display: inline-flex;
        color: ${(props) => props.theme.colors.text40};
        font: initial;
        background: initial;
        border: 1px solid ${(props) => props.theme.colors.cover8};
        outline: initial;
        cursor: pointer;
      }
      &.KuxPagination-item-selected {
        button {
          color: ${(props) => props.theme.colors.text};
          border: 1px solid ${(props) => props.theme.colors.text};
        }
      }
    }
  }
  .h5_TabBox .KuxTabs-scrollButton {
    padding-top: 5px;
  }
`;

export const InfiniteScrollList = styled.div`
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding-bottom: 40px;
  -webkit-overflow-scrolling: touch; /* 在iOS设备上使用流畅的滚动 */

  /* 中屏 大屏样式 */
  ${(props) => props.theme.breakpoints.up('md')} {
    ::-webkit-scrollbar {
      width: 6px;
      height: 2px;
      background: transparent;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 20, 42, 0.2);
      border-radius: 8px;
    }
  }
  .loader {
    width: 100%;
    margin: 4px 0;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 500;
    font-size: 12px;
    font-style: normal;
    line-height: 1.3;
    text-align: center;
  }
`;

export const EmptyWrapper = styled.div`
  height: 260px;
  text-align: center;
  padding-top: 50px;
`;

export const StyledHeader = styled.h1`
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margin-bottom: 40px;
  margin-top: 40px;
  color: ${(props) => props.theme.colors.text};

  > div {
    display: flex;
    align-items: center;
  }

  svg {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    transform: rotate(180deg);
  }
`;
