/*
 * @Owner: Clyne@kupotech.com
 */
import { fx, styled } from '@/style/emotion';

const padFx = `
  font-size: 12px;
  font-weight: 400;
  padding: 0 4px;
  border-radius: 4px;
`;

export const MidCellWrapper = styled.div`
  display: flex;
  align-items: center;
  .text-tip + svg {
    margin: 0 0 0 8px!important;
  }
  .pad {
    svg {
      margin: 0 0 0 6px!important;
    }
  }
`;

export const CellWrapper = styled.div`
  display: flex;
  align-items: center;
  .text-tip + svg {
    margin: 0 0 0 8px!important;
  }
  .pad {
    svg {
      margin: 0 0 0 6px!important;
    }
  }
`;

export const SymbolWrapper = styled.div`
  display: flex;
  flex-wrap: inherit;
  align-items: center;
  ${(props) => (props.screen !== 'md' || props.wrap ? fx.flexFlow('wrap') : '')}
  .symbol-margin-mode, .symbol-lev {
    ${(props) => fx.backgroundColor(props, 'cover8')}
    border-radius: 4px;
    line-height: 16px;
    ${padFx}
  }
  .marginL + .marginL {
    margin-left: 4px;
  }
  .marginL6 {
    margin-left: 6px;
  }
  .symbol-box {
    display: flex;
    align-items: center;
    margin-bottom: 2px;
  }
  .nowap {
    white-space: nowrap;
  }
  .symbol-other {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    .trial-fund-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 4px 0 8px;
    }
  }
  .trial-fund-tip,
  .trial-fund-icon {
    cursor: help;
  }
  .symbol-side {
    &.sell {
      ${padFx}
      ${(props) => fx.color(props, 'secondary')}
      ${(props) => fx.backgroundColor(props, 'secondary12')}
    }
    &.long {
      ${padFx}
      ${(props) => fx.color(props, 'primary')}
      ${(props) => fx.backgroundColor(props, 'primary12')}
    }
  }
  .symbol-base {
    ${(props) => fx.color(props, 'text')}
  }

  html[dir='rtl'] & .currencyText {
    margin-left: 0;
    padding-left: 0;
  }
  .currencyText {
    ${(props) => fx.color(props, 'text60')}
  }
  svg {
    ${(props) => fx.color(props, 'icon60')}
  }
  [dir='rtl'] & .iconRtl {
    margin-right: 4px;
    margin-left: 0;
    padding-left: 0;
  }
  [dir='rtl'] & .symbol-lev .iconRtl {
    padding-right: 4px;
  }
`;
