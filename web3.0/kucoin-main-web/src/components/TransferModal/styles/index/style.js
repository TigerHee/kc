/**
 * Owner: judith.zhu@kupotech.com
 */
import { Form as KuxForm } from '@kux/mui';
import { styled } from '@kux/mui/emotion';

export const TransferBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 24px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 8px;
  .direction {
    display: inline-block;
    max-width: 80px;
    div {
      height: 40px;
      font-weight: 400;
      font-size: 14px;
      line-height: 40px;
    }
    .arrowBox {
      height: 24px;
      line-height: 24px;
      svg path {
        fill: ${({ theme }) => theme.colors.icon40};
      }
    }
  }
  .reverse {
    flex: 0 0 auto;
    align-self: center;
    width: 48px;
    height: 48px;
    margin-right: 4px;
    margin-left: 14px;
    text-align: center;
    background: #fff;
    border: 1px solid rgba(29, 29, 29, 0.12);
    border-radius: 50%;
    cursor: pointer;
    &.disabled {
      opacity: 0.4;
    }
  }
  .trandseCascader {
    display: flex;
    flex: 1;
    flex-direction: column;
    .dividerbox {
      position: relative;
      display: flex;
      align-items: center;
      height: 24px;
      padding-left: 14px;
      .divider {
        z-index: 99;
        display: inline-block;
        width: 100%;
        height: 1px;
        background-color: rgba(0, 20, 42, 0.04);
      }
    }
    .KuxInput-middleContainer {
      background: none !important;
      box-shadow: none !important;
    }
  }
`;

export const Max = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
`;

export const SMMax = styled.span`
  color: ${({ theme }) => theme.colors.text20};
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const OptionLable = styled.div`
  display: flex;
  align-items: center;
  .accountNameWithIcon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 8px;
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    border-radius: 3px;
  }
  .accountIcon {
    margin-right: 16px;
    color: rgba(140, 140, 140, 0.6);
    line-height: 0;
    vertical-align: middle;
  }
`;

export const AccountBox = styled.div`
  .accountType {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    font-size: 14px;
  }
  .accountName {
    margin-top: 2px;
    font-weight: 700;
    font-size: 16px;
  }
`;

export const FormWrapper = styled.div`
  margin-top: 5px;
  margin-bottom: 32px;
  .MuiFilledInput-root {
    margin-top: 0;
  }
  .coinCurrency {
    display: block;
    margin-top: -16px;
    font-size: 14px;
    line-height: 1;
  }
`;

export const SymbolLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .currency {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    > span:last-of-type {
      color: ${({ theme }) => theme.colors.text40};
    }
  }
  .balance {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    > span:last-of-type {
      color: ${({ theme }) => theme.colors.text40};
    }
  }
`;
