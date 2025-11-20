/**
 * Owner: garuda@kupotech.com
 */
import AdaptiveModal2 from '@mui/Dialog';

import { styled } from '@/style/emotion';

export const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0 12px;
  padding: 16px 12px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.cover2};
  .result-item {
    &:not(:last-of-type) {
      margin-bottom: 12px;
    }
  }
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ResultLabel = styled.div`
  display: flex;
  justify-content: ${(props) => (props.title ? 'flex-end' : 'flex-start')};
  flex: 1;
  width: ${(props) => (props.title ? '26%' : '35%')};
  max-width: ${(props) => (props.title ? '26%' : '35%')};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
  white-space: normal;
  word-break: break-word;
  text-align: ${(props) => (props.title ? 'right' : 'left')};
  &.result-label {
    &:last-of-type {
      margin-right: 12px;
    }
  }
`;

export const ResultItemValue = styled.div`
  display: flex;
  justify-content: flex-end;
  max-width: 26%;
  width: 26%;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => (props.value ? props.theme.colors.text : props.theme.colors.text30)};
  text-align: right;
  white-space: normal;
  word-break: break-word;
`;

export const SymbolBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 32px;
  .symbol-text,
  .currencyText {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text};
  }
`;

export const TradeSideBox = styled.div`
  display: flex;
  padding: 2px 4px;
  margin-right: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: ${(props) =>
    (props.isLong ? props.theme.colors.primary : props.theme.colors.secondary)};
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.textEmphasis};
`;

export const AdaptiveModal = styled(AdaptiveModal2)`
  .KuxDialog-body {
    max-width: 520px;

    .KuxModalHeader-root {
      min-height: 72px;
      padding: 24px 32px 0;
      border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
      .KuxModalHeader-close {
        width: 32px;
        height: 32px;
        top: 20px;
      }
    }

    .KuxDialog-content {
      padding-top: 24px;
      max-height: 480px;
    }

    .KuxTabs-Container {
      padding: 0;
    }
    .KuxTabs-indicator {
      height: 4px;
      > span {
        height: 4px;
      }
    }
    .KuxInput-suffix {
      margin-right: 0;
    }
    .KuxModalFooter-buttonWrapper {
      .KuxButton-root {
        &:last-of-type {
          margin-left: 24px;
        }
      }
    }
  }
  .KuxButton-text {
    color: ${(props) => props.theme.colors.text60};
  }
  // mobile 样式
  &.KuxDrawer-root {
    height: calc(100% - 32px);
    padding-bottom: 80px;
    .KuxModalHeader-root {
      height: 56px;
      padding: 16px;
    }
    .KuxModalHeader-close {
      top: 14px;
    }
    .KuxTab-TabItem {
      font-size: 18px;
    }
    .KuxTabs-container {
      height: 56px;
      padding-top: 16px;
    }
    .KuxTabs-Container {
      padding: 0;
    }
    .KuxTab-TabItem {
      font-size: 18px;
    }
    .KuxTabs-indicator {
      > span {
        width: 16px;
        height: 4px;
      }
    }
    .KuxTabs-scrollButton {
      align-items: center;
    }
    .KuxModalFooter-root {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: ${(props) => props.theme.colors.layer};
    }
    .KuxModalHeader-title {
      h3 {
        font-size: 18px;
      }
      .symbol-text{
        font-size: 14px;
      }
    }
    .result-box {
      .result-item {
        &:not(:last-of-type) {
          margin-bottom: 10px;
        }
      }
      .result-value {
        font-size: 12px;
      }
    }
  }
`;
