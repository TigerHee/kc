/**
 * Owner: willen@kupotech.com
 */

import { css, styled } from '@kux/mui';
export const Container = styled.div`
  width: 55.71%;
  height: 376px;
  margin-left: 8px;
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid rgba(0, 0, 0, 0.01);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  ${(props) => props.theme.breakspoint.down('sm')} {
    width: 100%;
    margin-top: 6px;
    margin-left: 0;
  }
  .interestRate,
  .period {
    &.hideAnnualInterestRate {
      width: 30%;
    }
  }
  .interestRate {
    width: 30%;
  }
  .annualInterestRate {
    width: 20%;
  }
  .period {
    justify-content: center;
    width: 16%;
    text-align: center;
  }

  .content {
    padding-left: 2px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    .interestRate,
    .period,
    .annualInterestRate {
      display: flex;
      align-items: center;
    }
  }

  .totalAmount {
    flex: 1;
    direction: ltr /* rtl:ignore */;
    text-align: right /* rtl:right */;
  }

  .list {
    height: 320px;
    overflow-y: auto;
  }
  .loadingBox {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 320px;
  }

  .row {
    display: flex;
    color: ${(props) => props.theme.colors.text};
    font-size: 12px;
    &.header {
      margin-bottom: 9px;
      color: rgba(0, 20, 42, 0.6);
      font-size: 12px;
      ${(props) => props.theme.breakspoint.down('sm')} {
        margin-bottom: 0px;
      }
    }
  }

  .titleLine {
    display: flex;
    justify-content: space-between;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
  }

  .selectDeadLine {
    padding-right: 8px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 12px;
    text-align: right;
  }
  .selectedLabel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .divider {
    display: none !important;
    width: 120% !important;
    margin: 0 -20px 12px -20px !important;
    ${(props) => props.theme.breakspoint.down('sm')} {
      display: block !important;
    }
  }

  .amount {
    margin-left: 4px /* rtl:ignore */;
    color: ${(props) => props.theme.colors.text60};
  }

  .KcOptionItem {
    svg.confirm_svg__icon {
      display: none; // 隐藏原本的选中icon
    }

    .new_confirm_svg__icon {
      display: inline-block;
    }
  }
`;

export const blockCss = (block) => css`
  display: ${block ? 'block' : 'inline-block'};
  line-height: 10px;
  ${(props) => props.theme.breakspoint.down('sm')} {
    font-size: 12px;
  }
`;

export const CurrencyBox = styled.span`
  display: flex;
  flex-direction: column;
  // font-weight: 500;
  // font-size: 12px;
  line-height: 16px;
  direction: ltr /* rtl:ignore */;
  ${(props) => props.theme.breakspoint.down('sm')} {
    padding: 0;
  }
`;
