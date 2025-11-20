/**
 * Owner: garuda@kupotech.com
 */

import { styled } from '../../builtinCommon';
import { AdaptiveDrawer } from '../../builtinComponents';

export const Drawer = styled(AdaptiveDrawer)`
  .drawerContent {
    width: 480px;
    padding: 24px 32px;
    position: relative;
    height: 100%;
    flex: 1;
    overflow-y: auto;

    .topArea {
      .label {
        color: ${(props) => props.theme.colors.text40};
        font-size: 12px;
        font-weight: 400;
        line-height: 1.3;
        margin-bottom: 4px;
      }

      .value {
        font-size: 24px;
        font-weight: 600;
        line-height: 1.3;
        color: ${(props) => props.theme.colors.primary};

        .unit {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          margin-left: 4px;
        }
      }
    }

    div.item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.3;
      margin-bottom: 10px;

      &.accord {
        > div {
          width: 100%;
        }
      }

      .label {
        color: ${(props) => props.theme.colors.text40};
      }

      .amount {
        text-align: right;
        color: ${(props) => props.theme.colors.text};
      }

      .contracts {
        color: ${(props) => props.theme.colors.primary};
        display: flex;
        align-items: center;
        cursor: pointer;

        svg {
          width: 16px;
          height: 16px;
          color: ${(props) => props.theme.colors.text40};
        }

        > span {
          text-align: right;
        }
      }
    }

    .flexBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
    }

    .icon {
      transition: transform 0.35s;
    }

    .iconActive {
      transform: rotate(-180deg);
    }

    .contractListWrapper {
      padding: 8px 12px;
      border-radius: 8px;
      background-color: ${(props) => props.theme.colors.cover2};
      font-size: 13px;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      line-height: 1.5;
      margin-top: 8px;

      > div {
        display: inline-flex;
      }

      .split {
        margin: 0 8px 0 0;
      }

      :global {
        .currencyText {
          padding-right: 2px;
        }
      }
    }

    .itemTitle {
      color: ${(props) => props.theme.colors.text};
      font-size: 14px;
      font-weight: 500;
      line-height: 1.3;
      margin-bottom: 10px;
    }

    .rules {
      p {
        font-size: 14px;
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        line-height: 1.3;
        margin: 0 0 4px;
      }

      a {
        margin-top: 9px;
        font-size: 14px;
        color: ${(props) => props.theme.colors.primary};
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;

        svg {
          width: 20px;
          height: 20px;
          margin-left: 2px;
        }
      }
    }

    .KuxDivider-horizontal {
      margin: 16px 0;
    }

    .KuxAccordion-head {
      padding: 0;
      border: none;
    }

    .KuxAccordion-activeBg {
      width: 100%;
      background: transparent;
    }

    .KuxAccordion-panel {
      padding: 0;
    }
    .KuxAccordion-iconWrapper {
      height: 14px;
      margin-left: 2px;
    }
  }
`;
