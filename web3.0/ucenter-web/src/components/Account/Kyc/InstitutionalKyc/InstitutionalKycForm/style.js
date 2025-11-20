/**
 * Owner: willen@kupotech.com
 */
import { css } from '@kux/mui';

export const useStyle = ({ color, breakpoints }) => {
  return {
    root: css`
      width: 100%;
      max-width: 1200px;
    `,
    part: css`
      margin-top: 13px;
    `,
    labelDot: css`
      width: 6px;
      height: 6px;
      border-radius: 100%;
      background: ${color.secondary};
      margin-right: 4px;
    `,
    partLabel: css`
      font-size: 16px;
      line-height: 26px;
      color: ${color.text};
      font-weight: 500;
      margin-bottom: 22px;
      display: flex;
      align-items: center;
    `,
    partLabelTips: css`
      margin-bottom: 21px;
      font-size: 14px;
      line-height: 22px;
      color: ${color.text60};
      a {
        color: ${color.primary};
        cursor: pointer;
        &:hover {
          color: ${color.primary};
        }
      }
    `,
    row: css`
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: 9px;
      align-items: center;
      ${breakpoints.down('md')} {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
      }
      ${breakpoints.down('sm')} {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
      }
    `,
    uploadWrapper: css`
      display: flex;
      flex-direction: column;
    `,
    item1: css`
      width: 100%;
    `,
    item2: css`
      width: 49.6%;
      ${breakpoints.down('md')} {
        width: 100%;
      }
      ${breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    item3: css`
      width: 33%;
      ${breakpoints.down('md')} {
        width: 100%;
      }
      ${breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    item4: css`
      width: 24.5%;
      ${breakpoints.down('md')} {
        width: 100%;
      }
      ${breakpoints.down('sm')} {
        width: 100%;
      }
    `,
    label: css`
      font-size: 14px;
      line-height: 22px;
      color: ${color.text};
      font-weight: 500;
    `,
    notice: css`
      font-size: 12px;
      line-height: 20px;
      color: ${color.text60};
      margin-top: 8px;
      margin-bottom: 8px;
    `,
    button: css`
      width: 100%;
      margin-top: 25px;
    `,
    CheckboxStyle: css`
      margin-top: 24px;
    `,
    CheckboxLabel: css`
      font-size: 14px;
      color: ${color.text};
    `,
    autoComplete: css`
      margin-top: 7px;
    `,
    input: css`
      height: 40px;
    `,
    autoCompleteTip: css`
      font-size: 12px;
      color: ${color.text60};
    `,
    expiryCheck: css`
      margin-left: 24px;
      ${breakpoints.down('md')} {
        margin-left: 0;
      }
      ${breakpoints.down('sm')} {
        margin-left: 0;
      }
    `,
    expiryWrapper: css`
      display: inline-block;
      ${breakpoints.down('md')} {
        margin-top: 0;
      }
      ${breakpoints.down('sm')} {
        margin-top: 0;
      }
    `,
  };
};
