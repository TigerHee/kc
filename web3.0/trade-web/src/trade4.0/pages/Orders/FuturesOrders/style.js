/**
 * Owner: charles.yang@kupotech.com
 */
import { fx, styled } from '@/style/emotion';

export const SymbolCellWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.flexFlow('wrap')} // justify-content: space-between;
`;

export const MarginAutoWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

export const Contract = styled.div`
  ${fx.flex(1)}
  ${(props) => fx.color(props, 'text')}
  ${fx.fontSize(12)}
`;

export const LineSpan = styled.span`
  ${(props) => fx.color(props, 'text30')}
`;
export const ProfitSpan = styled.span`
  ${(props) => {
    const { price } = props;
    if (price) {
      return fx.color(props, 'primary');
    } else {
      return fx.color(props, 'text30');
    }
  }}
`;

export const LossSpan = styled.span`
  ${(props) => {
    const { price } = props;
    if (price) {
      return fx.color(props, 'secondary');
    } else {
      return fx.color(props, 'text30');
    }
  }}
`;

export const MobileSymbolCellContent = styled.span`
  ${fx.flex(1)}
  ${fx.display('flex')}
  ${(props) => (props.screen !== 'md' ? fx.flexFlow('wrap') : '')}
`;

export const CoinWrapper = styled.div`
  span {
    ${(props) => fx.color(props, 'text60')}
    font-weight: 400;
  }
`;

// 挂在都global style上面的，全局合约table样式
export const futuresTableStyle = ({ colors }) => `
.md .open-order-bar {
  .KuxCheckbox-wrapper {
    & > span:last-of-type {
      text-align: left;
    }
  }
}
/* 合约平仓dialog复写 */
  .close-pos {
    .KuxDialog-body .KuxDialog-content {
      padding-bottom: 0;
    }
    .KuxButton-text {
      color: ${colors.text60};
    }
  }
  /* 合约自动追加dialog复写 */
  .auto-append {
    .ku-box {
      border: none;
      align-items: flex-start;
    }
  }
/* 合约专业版 start */
.futures-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

/* 合约专业版 mobile md pad断点处理，交易大厅应该无需处理 */
.auto-wrapper-sm, .auto-wrapper-md, .auto-wrapper-pad {
  .table-wrapper {
    padding: 0 16px;
  }
  position: absolute!important;
  .futures-table::-webkit-scrollbar {
    display: none;
  }
  .futures-empty {
    display: block;
    margin: 0 auto;
    position: static;
    top: 0;
    left: 0;
    transform: none;
  }
}

/* 合约专业版 end */
.futures-table::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.futures-table::-webkit-scrollbar-thumb {
  border-radius: 12px;
  background-color: ${colors.text20};
}

.futures-table::-webkit-scrollbar-track {
  background: transparent;
  border: transparent;
}

.futures-table.futures-positions {
  .card-xs-tr:after,
  .card-content:after{
    width: 100%;
    margin: 0;
  }
}
.futures-table {
  .pretty-size {
    color: ${colors.text};
  }
  word-break: break-word;
  .card-content, .card-xs-tr {
    position: relative;
  }
  .card-content:after,
  .card-xs-tr:after{
    position: absolute;
    bottom: 1px;
    left: 0;
    display: block;
    content: ' ';
    width: calc(100% - 24px);
    height: 1px;
    margin: 0 12px;
    background-color: ${colors.divider8};
  }
  .card-xs-tr{
    padding-left: 12px;
    padding-right: 12px;
  }
  .text-60 {
    color: ${colors.text60};
  }
  .coinCurrency {
    span {
      color: ${colors.text40};
    }
  }
  .text-color {
    color: ${colors.text};
    svg {
      color: ${colors.icon};
    }
  }
  .table-content-td,.card-value, .card-value-sm {
    color: ${colors.text};
  }
  .table-content-td, 
  .table-header-th {
    word-break: break-word;
  }
  .table-content-tr {
    min-height: 39px;
    max-height: auto;
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
    .table-content-td:first-of-type {
      padding-left: 0;
    }
    .table-content-td:last-of-type {
      padding-right: 0;
    }
  }
  .table-header-tr {
    max-height: initial;
    padding-left: 12px;
    padding-right: 12px;
    box-sizing: border-box;
    .table-header-td:first-of-type,
    .table-header-th:first-of-type {
      padding-left: 0;
    }
    .table-header-td:last-of-type,
    .table-header-th:last-of-type {
      padding-right: 0;
    }
  }
  .tr-settle {
    background-color: rgba(248, 178, 0, 0.04);
  }
  .order-text {
    color: ${colors.text};
    font-weight: 500;
  }
  .fontWei-400 {
    font-weight: 400;
  }
}


.lg1.futures-table {
  .card-tr {
    .card-items {
      max-width: 25%;
      min-width: 25%;
    }
    .card-items:nth-of-type(n+4) {
      text-align: right;
      .card-title, .card-value {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .card-tr.symbol {
    .card-items {
      max-width: initial;
      min-width: initial;
    }
  }
}

.lg.futures-table {
  .card-tr {
    .card-items:nth-of-type(n+3) {
      text-align: right;
      .card-title, .card-value {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
.card-xs-tr {
  padding: 12px 0;
  .card-items-sm:first-of-type {
    .card-value-sm {
      display: block;
      text-align: left;
    }
  }
  .card-items-sm {
    .card-value-sm, .sm-item {
      display: flex;
      justify-content: flex-end;
      text-align: right;
    }
  }
}

.primary-text {
  color: ${colors.primary};
}
.noWrapper-padding {
  .table-content-tr, .table-header-tr {
    padding-left: 0;
    padding-right: 0;
  }
  .card-content {
    padding: 0 0 12px 0;
  }
  .card-xs-tr {
    padding: 12px 0;
  }
}
`;

export const PnlWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LineCancelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .symbol-box {
    margin-right: 16px;
  }
  &.md {
    justify-content: ${(props) => (props?.isMd ? 'space-between' : 'flex-start')};
    .symbol-cell {
      flex-flow: column;
      align-items: self-start;
    }
    .symbol-box {
      margin-bottom: 4px;
    }
    .symbol-cell {
      margin-right: 4px;
    }
  }
  &.pnl-list {
    justify-content: space-between;
    .symbol-cell {
      flex-flow: wrap;
      align-items: center;
    }
  }
`;
