/**
 * Owner: solar.xia@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import {
  themeBreakPointDownSM,
  themeBreakPointUpLG,
  themeBreakPointUpSM,
  themeColorCover12,
  themeColorCover4,
  themeColorCover8,
  themeColorPrimary,
  themeColorText40,
  themeFontLG,
  themeFontXL,
} from 'src/utils/themeSelector';
export const StyledEmptyText = styled.div``;
export const StyledNotInProcess = styled.div`
  width: 100%;
  padding: 32px 24px 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  ${(props) => props.theme.fonts.size.lg}
  ${themeBreakPointDownSM} {
    background: linear-gradient(
      180deg,
      ${themeColorCover4} 0%,
      ${(props) =>
          props.theme.currentTheme === 'dark'
            ? 'rgba(243, 243, 243, 0.00)'
            : 'rgba(29, 29, 29, 0.00)'}
        100%
    );
    border: 1px solid ${themeColorCover12};
    border-radius: 16px;
  }
  ${themeBreakPointUpSM} {
    padding: 40px 0;
  }
  img {
    width: 120px;
    height: 120px;
    ${themeBreakPointUpSM} {
      width: 136px;
      height: 136px;
    }
    ${themeBreakPointUpLG} {
      width: 148px;
      height: 148px;
    }
  }
  span {
    margin-top: 8px;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    ${themeBreakPointUpLG} {
      ${themeFontLG};
    }
  }
`;
export const StyledActivityEnd = styled.div`
  display: flex;
  padding: 40px 0px;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  align-self: stretch;
  ${themeBreakPointDownSM} {
    padding: 48px 24px;
    background: linear-gradient(
      180deg,
      ${themeColorCover4} 0%,
      ${(props) =>
          props.theme.currentTheme === 'dark'
            ? 'rgba(243, 243, 243, 0.00)'
            : 'rgba(29, 29, 29, 0.00)'}
        100%
    );
    border: 1px solid ${themeColorCover12};
    border-radius: 16px;
  }
  .delivery-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: stretch;
    color: ${themeColorText40};
    font-weight: 400;
    text-align: center;
    ${themeFontLG};
  }
  .delivery-foot {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
    align-self: stretch;
    color: ${themeColorText40};
    font-weight: 500;
    text-align: center;
    div {
      align-self: stretch;
    }
    ${themeFontLG};
    ${themeBreakPointUpSM} {
      font-weight: 400;
      ${themeFontXL};
    }
    a {
      color: ${themeColorPrimary};
      ${themeBreakPointUpSM} {
        font-weight: 500;
      }
    }
  }
`;
export const StyledTable = styled.div`
  width: 100%;
  // padding-bottom: 56px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: -24px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    // padding-bottom: 80px;
    thead {
      tr {
        th {
          padding-right: 4px;
          padding-left: 4px;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 12px 4px;
          .KuxEmpty-root {
            margin-top: -40px;
          }
        }
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    // padding-bottom: 100px;
    thead {
      tr {
        th {
          padding-right: 6px;
          padding-left: 6px;
        }
      }
    }
    tbody {
      tr {
        td {
          height: 65px;
          padding: 12px 6px;
          .KuxEmpty-root {
            margin-top: -40px;
          }
        }
      }
    }
  }

  .aptp-table {
    width: 100%;
  }
  .user-container {
    position: relative;
    min-height: 40px;
    .user-flag {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border: 1px solid ${themeColorCover8};
      border-radius: 50%;
      ${(props) => props.theme.fonts.size.lg}
      color: ${(props) => props.theme.colors.text};
    }
    .my-order-flag {
      position: absolute;
      top: -12px;
      left: 0;
      /* transform: translateY(-51px); */
    }
  }
  .buy-price {
    color: rgba(246, 84, 84, 1);
  }
  .sell-price {
    color: rgba(1, 188, 141, 1);
  }
  .empty-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 0 56px;
    ${(props) => props.theme.breakpoints.up('sm')} {
      padding: 24px 0 0;
    }
  }
  .text-center {
    text-align: center;
  }
  .main-column {
    .main-header {
      display: flex;
      justify-content: space-between;
      .left-header {
        .price-label {
          font-weight: 400;
          ${(props) => props.theme.fonts.size.lg}
          color: ${(props) => props.theme.colors.text40};
        }
        .price-value {
          margin-top: 4px;
          font-weight: 700;
          ${(props) => props.theme.fonts.size.xl}
          color: ${(props) => props.theme.colors.text};

          &.sell {
            color: ${(props) => props.theme.colors.secondary};
          }

          &.buy {
            color: ${(props) => props.theme.colors.primary};
          }
        }
      }
      .action {
        display: flex;
        align-items: center;
      }
      .deal-time {
        display: flex;
        align-items: center;
        color: ${(props) => props.theme.colors.text};
        ${(props) => props.theme.fonts.size.lg}
        font-weight: 500;
      }
    }
    .main-content {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding-top: 16px;
      ${(props) => props.theme.breakpoints.up('sm')} {
        padding-top: 24px;
      }
      ${(props) => props.theme.fonts.size.lg}
      .label {
        color: ${(props) => props.theme.colors.text40};
        text-align: left;
        span {
          /* border-bottom: 1px dashed rgba(29, 29, 29, 0.2); */
        }
      }

      .value {
        color: ${(props) => props.theme.colors.text};
        text-align: right;
      }

      .side-value {
        padding: 1px 6px;
        font-weight: 500;
        font-size: 12px;
        line-height: 130%;
        border-radius: 4px;

        &.sell {
          color: ${(props) => props.theme.colors.secondary};
          background: ${(props) => props.theme.colors.secondary8};
        }

        &.buy {
          color: ${(props) => props.theme.colors.primary};
          background: ${(props) => props.theme.colors.primary8};
        }
      }

      ${(props) => props.theme.breakpoints.up('lg')} {
        flex: 1;
        padding-top: 0;
        padding-left: 32px;
      }
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
`;

export const StyledActionButtonWrapper = styled.div`
  .KuxButton-root {
    &.buy {
      color: #ffffff;
      background-color: #01bc8d;
    }
    &.sell {
      color: #ffffff;
      background-color: #f65454;
    }
  }
`;

export const StyledButton = styled(Button)`
  padding-right: 20px;
  padding-left: 20px;
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: 20px;
    padding-left: 20px;
  }
`;

export const StyledFoldSortHeader = styled.div`
  div.item {
    display: flex;
    align-items: center;
    &:first-of-type {
      margin-bottom: 8px;
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
  }
`;

export const StyledIconGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 18px;
  svg {
    width: 12px;
    height: 12px;
    min-height: 12px;
    transform: translateY(0px);
    &:last-of-type {
      transform: translateY(-6px);
    }

    &.active {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

export const StyledFoldSortColumn = styled.div`
  > div:first-of-type {
    margin-bottom: 4px;
  }
`;

export const StyledFoldText = styled.div`
  > span {
    display: inline-block;
    max-width: 120px;
  }
`;
