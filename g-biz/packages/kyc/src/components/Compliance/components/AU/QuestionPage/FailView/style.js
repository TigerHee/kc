/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICCloseOutlined, ICHookOutlined } from '@kux/icons';

export const FailContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .top {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }
  img {
    width: 200px;
    height: 200px;
    margin-bottom: 32px;
  }
  .title {
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text};
  }
  .desc {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 160%;
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.colors.text60};
    background-color: ${({ theme }) => theme.colors.cover2};
    b {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.text};
    }
  }
  &.isSmStyle {
    img {
      width: 136px;
      height: 136px;
      margin-bottom: 12px;
    }
    .title {
      font-size: 24px;
      margin-bottom: 12px;
    }
    .desc {
      font-size: 14px;
      gap: 24px;
    }
  }
`;
export const BtnBox = styled.div`
  width: 100%;
  flex-shrink: 0;
  display: flex;
  gap: 24px;
  flex-direction: row-reverse;
  padding: 20px 32px;
  box-shadow: 0px 1px 0px 0px #00000014 inset;
  &.isSmStyle {
    flex-direction: column;
    gap: 16px;
    box-shadow: none;
  }
`;

export const ResultContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .top {
    flex: 1;
  }
  .ratio {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text40};
  }
  .title {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    margin-top: 4px;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.colors.text};
  }
  .tip {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 24px;
    color: ${({ theme }) => theme.colors.text40};
  }
  .answerBox {
  }
  .answer {
    padding: 16px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid ${({ theme }) => theme.colors.divider8};
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
    span {
      flex: 1;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
      color: ${({ theme }) => theme.colors.text};
    }
  }
  .answerError {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .answerSuccess {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &.isSmStyle {
    .ratio {
      font-size: 12px;
    }
    .title {
      font-size: 16px;
    }
    .answer {
      span {
        font-size: 14px;
      }
    }
  }
`;

export const StatusTagWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 8px;
  height: fit-content;
  font-size: 12px;
  background-color: ${({ theme, isSuccess }) =>
    isSuccess ? theme.colors.primary8 : theme.colors.secondary8};
  b {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    color: ${({ theme, isSuccess }) => (isSuccess ? theme.colors.primary : theme.colors.secondary)};
  }
`;

export const ErrorIcon = styled(ICCloseOutlined)`
  font-size: 12px;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SuccessIcon = styled(ICHookOutlined)`
  font-size: 12px;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.primary};
`;
