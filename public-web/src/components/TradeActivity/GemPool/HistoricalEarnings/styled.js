/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-13 18:22:34
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-27 21:11:49
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/styled.js
 * @Description:
 */

import { css, styled } from '@kux/mui';
import { Link } from 'components/Router';

export const HistoryHeader = styled.div`
  display: flex;
  padding: 24px 16px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-bottom: 1px solid ${(props) => props.theme.colors.cover8};
  background: ${(props) => props.theme.colors.overlay};
  .headerTitle {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 18px;
    font-family: Roboto;
    font-style: normal;
    line-height: 130%; /* 31.2px */
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 24px 0px;
    font-size: 16px;
    .headerTitle {
      font-size: 24px;
    }
  }
`;

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
    //border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
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
  //padding: 0 16px;
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
`;

export const PaginationWrap = styled.div`
  padding-top: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;

  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-top: 16px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-top: 28px;
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

export const SelectWrapper = styled.div`
  display: flex;
  margin-bottom: 32px;
  margin-left: 2px;
  .KuxSelect-root {
    width: 160px;
    margin-right: 16px;
  }
  &.h5_SelectBox {
    margin-bottom: 4px;
    padding: 0px 16px;
  }
`;

export const TokenItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  font-family: Roboto;
  font-style: normal;
  line-height: 130%;
  justify-content: ${(props) => props.right && 'right'};
  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;

export const GreyToken = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;

export const EarningsSummaryListPage = styled.div`
  padding: 0 16px;
  font-size: 14px;
  .EarningsSummaryListRow {
    height: 80px;
  }
  .EarningsSummaryListRow td {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const PrizePoolItem = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const EarningsRecordItemWrapper = styled.div`
  .KuxDivider-horizontal {
    margin: 0;
  }
`;

export const EarningsRecordItemRow = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  padding: 16px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => (props.gap ? props.gap + 'px' : '0px')};

  ${(props) => {
    if (props.isSummaryItem) {
      return css`
        & > *:nth-child(1) {
          margin-bottom: 16px;
        }
        & > *:nth-child(2) {
          margin-bottom: 20px;
        }
        & > *:nth-child(n + 3) {
          margin-bottom: 20px;
        }
        & > *:last-child {
          margin-bottom: 0;
        }
      `;
    }
  }}
  ${(props) => {
    if (props.isRecordItem) {
      return css`
        & > *:nth-child(1) {
          margin-bottom: 16px;
        }
        & > *:nth-child(n + 2) {
          margin-bottom: 8px;
        }
        & > *:last-child {
          margin-bottom: 0;
        }
      `;
    }
  }}
  ${(props) => {
    if (props.gap) {
      return css`
        padding: 0px;
      `;
    }
  }}
`;

export const EarningsRecordItemRowLine = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  padding: 16px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

export const EarningsRecordItemLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;

export const EarningsRecordItemColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => (props.gap ? props.gap + 'px' : '4px')};
  ${(props) => {
    return (
      props.isEnd &&
      css`
        align-items: flex-end;
      `
    );
  }}
`;

export const ColumnDesc = styled.div`
  ${(props) => {
    return props.isReply
      ? css`
          color: ${props.theme.colors.text60};
          font-weight: 400;
        `
      : css`
          color: ${props.theme.colors.text};
          font-weight: 700;
        `;
  }}
  ${(props) => {
    return (
      props.isTextRight &&
      css`
        text-align: right;
      `
    );
  }}

  color: ${(props) => props.theme.colors.text};
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

export const ColumnTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  /* 16pt/Regular */
  font-family: Roboto;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: stretch;
  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
  }
`;

export const RowTitle = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%; /* 20.8px */
  ${(props) => {
    return (
      props.isTotalIncome &&
      css`
        color: ${props.theme.colors.text};
      `
    );
  }}
`;

export const RowDesc = styled.div`
  color: ${(props) => props.theme.colors.text};
  /* 16pt/Regular */
  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 20.8px */
`;

export const EarningsRecordListPage = styled.div`
  padding: 0 16px;
  font-size: 14px;
  .ticketListRow {
    height: 80px;
  }
  .ticketListRow td {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const LinkWrapper = styled(Link)`
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 400;
  font-size: 14px;
  font-family: Roboto;
  font-style: normal;
  line-height: 130%;
  text-align: right;
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
    margin-left: 4px;
    transform: rotateY(0deg);
    [dir='rtl'] & {
      transform: rotateY(180deg);
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`;
