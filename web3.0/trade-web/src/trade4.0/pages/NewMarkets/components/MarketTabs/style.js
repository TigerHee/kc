/*
 * @Owner: Clyne@kupotech.com
 */
import { styled, fx, colors } from '@/style/emotion';

export const TabWrapper = styled.div`
  padding: 0 12px;
  .item-label {
    display: flex;
    ${fx.alignItems('center')}
    svg {
      display: block;
    }
  }
  .first-tabs {
    display: flex;
    min-height: 40px;
    box-shadow: 0px -0.5px 0px 0px rgba(188, 200, 224, 0.12) inset;
    ${fx.alignItems('center')}
    .market-first-tabs {
      flex: 1;
    }
    .change-type {
      margin-left: 8px;
    }
    svg {
      display: block;
      ${fx.cursor()}
      ${(props) => fx.color(props, 'icon')}
    }
    .KuxTabs-scrollButton {
      ${fx.display('flex')}
      height: 36px;
      padding: 0;
      ${fx.alignItems('center')}
    }
  }

  .market-second-tabs,
  .market-third-tabs {
    padding: 4px 0 0 0;
    box-sizing: content-box;
    .KuxTabs-scroller {
      height: auto;
    }
    .KuxTabs-scrollButton {
      ${fx.display('flex')}
      height: 40px;
      padding: 0;
      ${fx.alignItems('center')}
    }
    .KuxTab-TabItem {
      padding: 4px 10px;
      height: 24px;
      line-height: 24px;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      margin: 0;
      border: 1px solid transparent;
      background-color: transparent;
      border-radius: 80px;
      &:active {
        border: 1px solid transparent;
      }
    }
    .KuxTab-selected {
      ${(props) => fx.color(props, 'primary')}
      ${(props) => {
        return fx.backgroundColor(props, 'primary8');
      }}
      border: 1px solid ${(props) => colors(props, 'primary12')};
    }
  }
  .market-third-tabs {
    padding: 0;
    height: auto;
    .KuxTab-TabItem {
      border: none;
      background-color: transparent;
      &:active {
        border: none;
        background-color: transparent;
      }
      &:first-of-type {
        padding-left: 0;
      }
    }
    .KuxTabs-scrollButton {
      height: 24px;
    }
    .KuxTab-selected {
      ${(props) => fx.color(props, 'primary')}
      background-color: transparent;
      border: none;
    }
  }
`;
