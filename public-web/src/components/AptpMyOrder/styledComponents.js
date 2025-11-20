/**
 * Owner: solar.xia@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import {
  themeBreakPointUpSM,
  themeColorComplementary,
  themeColorCover2,
  themeColorPrimary,
  themeColorSecondary,
  themeColorText,
  themeColorText40,
  themeFontMD,
  themeRadiusMiddle,
} from 'src/utils/themeSelector';
const BaseContainer = styled.div`
  margin: 0 auto;
  /* min-width: 375px; */
  ${(props) => props.theme.breakpoints.up('lg')} {
    max-width: 1200px;
  }
  padding-left: 16px;
  padding-right: 16px;
`;
export const StyledHeader = styled(BaseContainer)`
  /* height: 80px; */
  display: flex;
  justify-content: space-between;
  .left {
    padding-top: 10px;
    padding-bottom: 10px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    ${(props) => props.theme.fonts.size.x2l}
    ${(props) => props.theme.breakpoints.up('sm')} {
      padding-top: 24px;
      padding-bottom: 24px;
      ${(props) => props.theme.fonts.size.x4l}
    }
  }
  .right {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
    ${(props) => props.theme.fonts.size.lg}
    ${(props) => props.theme.breakpoints.up('sm')} {
      ${(props) => props.theme.fonts.size.xl}
    }
    span {
      margin-right: 4px;
    }
    img {
      [dir='rtl'] & {
        transform: rotateY(180deg);
      }
    }
  }
`;
export const StyledTabs = styled(BaseContainer)`
  border-top: 1px solid ${(props) => props.theme.colors.divider8};
  padding-top: 14px;
  padding-bottom: 16px;
  ${(props) => props.theme.fonts.size.lg}
  display: flex;
  ${(props) => props.theme.breakpoints.up('sm')} {
    ${(props) => props.theme.fonts.size.x3l}
    padding-top: 39px;
    padding-bottom: 31px;
  }
  div:first-of-type {
    margin-right: 24px;
  }
  div {
    color: ${(props) => props.theme.colors.text30};
    font-weight: 500;
    cursor: pointer;
    &.actived {
      color: ${(props) => props.theme.colors.text};
      font-weight: 700;
    }
  }
`;
export const StyledTable = styled(BaseContainer)`
  margin-top: 24px;
  th {
    padding: 10px 6px 12px 6px;
  }
  td {
    height: 80px;
    padding: 0 6px;
    // padding-bottom: 0;
    .KuxBox-root {
      .KuxEmpty-root {
        margin-bottom: 160px;
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      &:first-of-type {
        max-width: 90px;
      }
    }
    ${(props) => props.theme.breakpoints.up('lg')} {
      &:first-of-type {
        max-width: unset;
      }
    }
  }
  tr.expanded td {
    border-bottom: 0;
  }
  tr.nested-row td {
    height: auto;
  }
  /* tr.parent-row.expanded:hover + tr.nested-row {
    background-color: red;
  } */
  .value {
    margin-right: 4px;
    color: ${(props) => props.theme.colors.text};
  }
  .currency {
    color: ${(props) => props.theme.colors.text40};
  }
  .buy {
    display: inline-block;
    padding: 0 6px;
    color: #01bc8d;
    background: rgba(1, 188, 141, 0.08);
    border-radius: 4px;
  }
  .sell {
    display: inline-block;
    padding: 0 6px;
    color: #f65454;
    background: rgba(246, 84, 84, 0.08);
    border-radius: 4px;
  }
  .mr-6 {
    margin-right: 6px;
  }
  .cancel-btn {
    cursor: pointer;
  }
`;
export const StyledAptpMyOrder = styled.div`
  background-color: ${(props) => props.theme.colors.overlay};
  font-family: 'Roboto';
  min-height: 80vh;
`;
export const StyledXsTableCol = styled.div`
  padding: 16px 0;
  /* border-bottom: 1px solid rgba(29, 29, 29, 0.04); */
  header {
    display: flex;
    justify-content: space-between;
    .left {
      .currencyPair {
        ${(props) => props.theme.fonts.size.xl}
        color: ${(props) => props.theme.colors.text};
        font-weight: 700;
      }
      .time {
        ${(props) => props.theme.fonts.size.lg}
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
      }
    }
    .right {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.colors.text};
      cursor: pointer;
      &.actived {
        color: #01bc8d;
        &.disabled {
          color: ${(props) => props.theme.colors.text30};
          cursor: auto;
        }
      }
    }
  }
  main {
    margin-top: 16px;
    .row {
      display: flex;
      justify-content: space-between;
      ${(props) => props.theme.fonts.size.lg}
      margin-bottom: 8px;
      &:last-of-type {
        margin-bottom: 0px;
      }
      .col {
        &:nth-of-type(2n + 1) {
          color: ${(props) => props.theme.colors.text40};
        }
        &:nth-of-type(2n) {
          color: ${(props) => props.theme.colors.text};
          font-weight: 500;
        }
        .side {
          padding: 2px 6px;
        }
      }
    }
  }
`;
export const StyledCondition = styled(BaseContainer)`
  /* display: flex;
  column-gap: 12px;
  row-gap: 12px;
  flex-wrap: wrap;
  grid-template-columns: repeat(2, 1fr); */
`;
export const StyledAppFooter = styled.div`
  padding-bottom: 40px;
`;

export const StyledFoldColumn = styled.div`
  .taxInfo {
    display: flex;
    align-items: center;
    svg {
      width: 16px;
      height: 16px;
      margin-left: 2px;
      color: ${(props) => props.theme.colors.icon60};
      cursor: pointer;
    }
  }

  &.sm {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    svg {
      margin-right: 2px;
    }
  }
`;

export const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    .KuxModalHeader-root {
      min-height: 68px;
      padding: 24px 24px 16px;

      .KuxModalHeader-close {
        top: 24px;
        right: 24px;
        width: 28px;
        height: 28px;
      }
    }

    .KuxDialog-content {
      padding: 0 24px 32px;
      font-size: 14px;
    }

    .KuxModalFooter-root {
      padding: 0 24px 24px !important;
    }
  }
`;

export const StyledApplyCancelActionRecordList = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 12px;
  padding: 8px 16px;
  font-weight: 400;
  background-color: ${themeColorCover2};
  border-radius: ${themeRadiusMiddle};
  .expand-button {
    .KuxButton-endIcon {
      width: 12px;
      height: 12px;
      margin-inline-start: 2px;
    }
  }
  ${themeBreakPointUpSM} {
    position: ${(props) => (props.hasExpandButton ? 'relative' : 'static')};
    margin-top: 0;
    margin-bottom: 19px;
    padding: 12px;
    padding-inline-start: ${(props) => (props.hasExpandButton ? '36px' : '12px')};
    .expand-button {
      position: absolute;
      width: auto;
      height: auto;
      inset-inline-start: 12px;
      inset-block-start: 22px;
      .KuxButton-endIcon {
        width: 16px;
        height: 16px;
        margin-inline-start: 0;
      }
    }
  }
`;

export const StyledApplyCancelActionRecord = styled.div`
  .time {
    ${themeFontMD};
    color: ${themeColorText40};
  }
  .content {
    margin-top: 2px;
    color: ${themeColorText};
    ${themeFontMD};
    .summary {
      color: ${themeColorPrimary};
    }
  }
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 10px;
  }
  ${themeBreakPointUpSM} {
    display: flex;
    justify-content: space-between;
    width: 100%;
    .action-buttons {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 0;
      .KuxButton-root {
        font-weight: 500;
        font-size: 13px;
      }
    }
  }
`;

export const StyledApplyCancelStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  font-weight: 400;
  font-size: 13px;
  &.pending {
    color: ${themeColorComplementary};
  }
  &.reject {
    color: ${themeColorSecondary};
  }
`;

export const StyledPlaceholderWrapper = styled.span`
  color: ${themeColorText40};
`;
