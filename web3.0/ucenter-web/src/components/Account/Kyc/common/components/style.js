/**
 * Owner: willen@kupotech.com
 */
import { css } from '@kux/mui';

export const useStyle = ({ font, color }) => {
  return {
    info: css`
      display: flex;
      padding: 12px;
      color: ${color.body};
      background-color: ${color.tableHeader};
      position: relative;
      margin-bottom: 8px;
      font-size: 10px;
      line-height: 16px;
    `,

    iconWrapper: css`
      width: 16px;
      height: 16px;
      margin-right: 4px;
      margin-top: 2px;
      vertical-align: 0;
    `,
    icon: css`
      vertical-align: 0;
    `,
    bold: css`
      font-weight: bold;
      color: ${color.text};
    `,
    demo: css`
      color: ${color.primary};
      cursor: pointer;
      &:hover {
        & img {
          transform: translateX(0);
          visibility: visible;
          opacity: 1;
        }
      }
    `,
    demoCard: css`
      position: absolute;
      top: -360px;
      right: 0;
      width: 400px;
      height: 400px;
      transition: all 0.3s;
      visibility: hidden;
      opacity: 0;
      transform: translateX(10px);
    `,
    tipsWrapper: css`
      padding: 12px;
      padding-left: 0px;
      font-size: 10px;
      line-height: 16px;
      color: ${color.body};
      background-color: ${color.tableHeader};
      margin-bottom: 8px;
    `,
    topWrapper: css`
      width: 100%;
      display: flex;
      position: relative;
      & a {
        color: ${color.primary};
        cursor: pointer;
        &:hover {
          color: ${color.primary};
        }
      }
    `,
    bottomWrapper: css`
      width: 100%;
      margin-left: 20px;
    `,
    data: css`
      color: ${color.text};
    `,
  };
};
