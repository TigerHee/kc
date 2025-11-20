/**
 * Owner: iron@kupotech.com
 */
import { css } from '@emotion/react';

export const useStyle = ({ color }) => {
  return {
    info: css`
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 22px;
      position: relative;
      margin: 10px 0 16px;
    `,
    neededAssign: css`
      font-size: 14px;
      background: ${color.cover4};
      padding: 16px;
      color: ${color.text};
    `,
    assignTip: css`
      font-weight: 500;
      line-height: 20px;
      color: ${color.text};
    `,
    neededAssetsTip: css`
      margin: 12px 0;
      color: ${color.text60};
      line-height: 22px;
    `,
    neededAssetsItem: css`
      display: flex;
      align-items: center;
      font-weight: 500;
    `,
    neededItemsPrefix: css`
      line-height: 20px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: ${color.text60};
      margin-right: 8px;
      [dir='rtl'] & {
        margin-right: unset;
        margin-left: 8px;
      }
    `,
    iconWrapper: css`
      width: 16px;
      height: 16px;
      margin-right: 4px;
      margin-top: 2px;
      vertical-align: 0px;
      [dir='rtl'] & {
        margin-right: unset;
        margin-left: 4px;
      }
    `,
    icon: css`
      vertical-align: 0;
    `,
    bold: css`
      font-weight: bold;
      color: #000;
    `,
    demo: css`
      font-weight: bold;
      color: ${color.primary};
      cursor: pointer;
      &:hover {
        & img {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      }
    `,
    demoCard: css`
      position: absolute;
      top: -400;
      right: 0;
      width: 400px;
      height: 400px;
      transition: all 0.3s;
      visibility: hidden;
      opacity: 0;
      transform: translateX(10px);
    `,
    uploadLoading: css`
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #00142a99;
      [dir='rtl'] & {
        left: unset;
        right: 0;
      }
    `,
    viewVideo: css`
      font-weight: bold;
      color: ${color.primary};
      cursor: pointer;
      margin-left: 12px;
      [dir='rtl'] & {
        margin-left: unset;
        margin-right: 12px;
      }
    `,
    showVideo: css`
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: ${color.text60};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9;
      [dir='rtl'] & {
        left: unset;
        right: 0;
      }
    `,
    video: css`
      outline: none !important;
    `,
    tipColor: css`
      color: #1abb97;
    `,
    warnTxt: css`
      color: ${color.secondary};
    `,
  };
};
