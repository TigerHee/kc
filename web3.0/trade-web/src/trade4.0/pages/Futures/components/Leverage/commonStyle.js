/**
 * Owner: garuda@kupotech.com
 */

import { styled } from '@kux/mui/emotion';

import Alert from '@mui/Alert';
import AdaptiveModal2 from '@mui/Dialog';
import MuiSlider from '@mui/RadioSlider';

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

export const KuxAlertRisk = styled(Alert)`
  [dir='rtl'] & {
    .KuxAlert-icon {
      /* @noflip */
      padding-right: unset;
      /* @noflip */
      padding-left: 8px;
    }
  }
`;

export const KuxAlertWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
`;

export const Slider = styled(MuiSlider)`
  &.rc-slider {
    margin-bottom: 32px;
  }
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
      .KuxModalHeader-title {
        position: absolute;
        top: 20px;
        width: 80%;
      }
    }

    .KuxDialog-content {
      padding-top: 24px;
      max-height: 480px;
      min-height: 220px;
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
    .mobile-btn {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: ${(props) => props.theme.colors.layer};
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

export const IsolatedLeverageTips = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.primary};
`;
