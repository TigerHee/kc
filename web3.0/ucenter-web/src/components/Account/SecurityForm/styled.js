/**
 * Owner: willen@kupotech.com
 */

import { styled } from '@kux/mui';

export const FormWrapper = styled.div`
  width: 100%;
  .KuxAlert-description {
    margin-top: 0;
  }

  .KuxAlert-icon {
    padding-right: 8px;
    padding-left: unset;
  }
`;

export const FormTitle = styled.div`
  margin: 48px 0;
  font-weight: 500;
  font-size: 36px;
  line-height: 44px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text100};
`;

export const Tip = styled.div`
  max-width: 580px;
  margin: 0 auto;
  border-radius: 5px;

  [dir='rtl'] & {
    text-align: right;
  }

  u {
    cursor: pointer;
  }
  .ant-alert-message {
    font-size: 13px;
  }

  .KuxAlert-description {
    margin-top: 0;
  }
`;

export const FormBody = styled.div`
  max-width: 100%;
  margin: 0;

  [dir='rtl'] & {
    .KuxForm-itemRowContainer .KuxCol-col {
      text-align: right /* rtl:ignore */;
    }
  }

  [dir='rtl'] & {
    .KuxInput-togglePwdIcon {
      transform: scaleX(-1);
    }
  }
`;

export const AlertMessage = styled.div`
  & > div {
    text-align: left;

    &:nth-child(1) {
      margin-bottom: 0.5em;
    }
  }
`;

export const G2faCode = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 32px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.cover12};
  row-gap: 12px;
  border-radius: 8px;
`;

export const Code = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  word-break: break-all;
  text-align: center;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

export const G2faHelp = styled.div`
  & > div {
    padding-bottom: 0px;
    color: #333;
    font-size: 13px;

    &:not(:first-child) {
      padding-top: 24px;
    }

    // &:not(:last-child) {
    //   border-bottom: 1px solid #f1f1f1;
    // }

    h4 {
      position: relative;
      font-weight: 500;
      font-size: 16px;

      [dir='rtl'] & {
        text-align: right;
      }

      &::before {
        position: absolute;
        top: 50%;
        left: -10px;
        width: 6px;
        height: 6px;
        border: 1px solid #0f7dff;
        border-radius: 6px;
        transform: translateY(-50%);
        content: ' ';
      }
    }
  }

  .desc {
    [dir='rtl'] & {
      text-align: right;
    }
  }
`;

export const AlertWrapper = styled.div`
  margin-bottom: 40px;
  .KuxAlert-description {
    margin-top: 0;
  }
  .KuxAlert-icon {
    padding-right: 8px;
    padding-left: unset;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
  }
`;

export const DepositTip = styled.div`
  display: block;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const AlertContent = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  line-height: 150%;
`;
