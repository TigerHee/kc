/**
 * Owner: solar@kupotech.com
 */

import { Form, styled, Divider, Button } from '@kux/mui';

export const StyledForm = styled(Form)``;
export const StyledFormItem = styled(Form.FormItem)`
  .KuxForm-itemError {
    padding-left: 0;
  }
`;
export const { FormItem } = Form;
export const StyledHiddenFormItemWrapper = styled.div`
  visibility: hidden;
  height: 0;
`;
export const TransferBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.cover2};
  border-radius: 8px;
  .direction {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: ${({ theme }) => theme.colors.text};
    div {
      line-height: 140%;
      font-weight: 400;
      font-size: 14px;
    }
    .arrowBox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20px 0;
    }
  }
  .account-container {
    flex: 1 1 0%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .KuxForm-item {
      flex: 0 0 48px;
      display: flex;
      align-items: center;
      .KuxRow-row {
        width: 100%;
      }
      .KuxForm-itemHelp {
        display: none;
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
    /* border: 1px solid rgba(29, 29, 29, 0.12); */
    border: 1px solid ${({ theme }) => theme.colors.cover12};
    border-radius: 50%;
    cursor: pointer;
    &.disabled {
      opacity: 0.4;
      cursor: auto;
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

export const StyledDivider = styled(Divider)`
  width: calc(100% - 20px);
  margin: 13px 0px 13px 16px;
`;
