/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';
import { ICSuccessFilled, ICSuccessUnselectOutlined, ICSingleSelectOutlined } from '@kux/icons';

export const QuestionContent = styled.div`
  .ratio {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 4px;
    color: var(--color-text40);
  }
  .title {
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 140%;
    color: var(--color-text);
  }
  .tip {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-top: 4px;
    color: var(--color-text40);
  }
  .desc {
    margin-top: 16px;
    div {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
      display: flex;
      align-items: center;
      color: var(--color-text);
      &::before {
        content: '';
        display: flex;
        flex-shrink: 0;
        width: 4px;
        height: 4px;
        border-radius: 2px;
        margin-right: 8px;
        margin-left: 8px;
        background-color: var(--color-text);
      }
      &:not(:last-of-type) {
        margin-bottom: 12px;
      }
    }
  }
  .answerBox {
    margin-top: 24px;
  }
  .inputBox {
    margin-top: 16px;
  }
  .answer {
    cursor: pointer;
    padding: 20px 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 7px;
    border: 1px solid var(--color-divider8);
    &.answerActive {
      border: 1px solid var(--color-text);
    }
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
    span {
      flex: 1;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%;
      color: var(--color-text);
    }
  }
  &.isSmStyle {
    padding-top: 8px;
    .ratio {
      font-size: 12px;
    }
    .tip {
      font-size: 12px;
    }
    .title {
      font-size: 16px;
    }
    .desc {
      margin-top: 8px;
      div {
        font-size: 14px;
        &:not(:last-of-type) {
          margin-bottom: 8px;
        }
      }
    }
    .answer {
      padding: 16px 20px;
      span {
        font-size: 14px;
      }
    }
  }
`;

export const CheckBoxSelectIcon = styled(ICSuccessFilled)`
  font-size: 18px;
  color: var(--color-text);
`;
export const RadioSelectIcon = styled(ICSingleSelectOutlined)`
  font-size: 18px;
  color: var(--color-text);
`;

export const UnSelectIcon = styled(ICSuccessUnselectOutlined)`
  font-size: 18px;
  color: var(--color-icon40);
`;

export const MutiQuestionWrapper = styled.div`
  .subTitle {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 140%;
    color: var(--color-text);
    margin: 32px 0;
  }
  .divider {
    height: 32px;
  }
`;
