import React from 'react';
import useTheme from 'hooks/useTheme';
import { css, Global } from 'emotion/index';
import { fade } from 'utils/colorManipulator';

export default function RcMPickerCss() {
  const theme = useTheme();
  return (
    <Global
      styles={css`
        .rmc-picker,
        .rmc-multi-picker {
          height: 160px;
          /*32*5*/
        }
        .rmc-multi-picker {
          display: -webkit-box;
          display: flex;
          -webkit-box-align: center;
          align-items: center;
        }
        .rmc-picker-item {
          font-size: 16px;
          height: 32px;
          line-height: 32px;
          padding: 0 10px;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          color: ${theme.colors.text};
          font-weight: 500;
          width: 100%;
          box-sizing: border-box;
        }
        .rmc-picker {
          display: block;
          position: relative;
          overflow: hidden;
          width: 100%;
          -webkit-box-flex: 1;
          flex: 1;
          text-align: center;
        }
        .rmc-picker-mask {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          margin: 0 auto;
          width: 100%;
          z-index: 3;
          background-image: -webkit-gradient(
              linear,
              left top,
              left bottom,
              from(${fade(theme.colors.layer, 0.95)}),
              to(${fade(theme.colors.layer, 0.6)})
            ),
            -webkit-gradient(linear, left bottom, left top, from(${fade(theme.colors.layer, 0.95)}), to(${fade(theme.colors.layer, 0.6)}));
          background-image: linear-gradient(
              to bottom,
              ${fade(theme.colors.layer, 0.95)},
              ${fade(theme.colors.layer, 0.6)}
            ),
            linear-gradient(
              to top,
              ${fade(theme.colors.layer, 0.95)},
              ${fade(theme.colors.layer, 0.6)}
            );
          background-position: top, bottom;
          background-size: 100% 204px;
          background-repeat: no-repeat;
        }
        .rmc-picker-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          z-index: 1;
        }
        .rmc-picker-indicator {
          box-sizing: border-box;
          width: 100%;
          height: 32px;
          position: absolute;
          left: 0;
          top: 102px;
          z-index: 3;
          background: ${theme.colors.primary8};
        }
        .rmc-date-picker,
        .rmc-multi-picker {
          height: 100%;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-align: center;
          align-items: center;
          padding: 16px 0;
          .rmc-picker:first-of-type {
            .rmc-picker-indicator {
              border-radius: 24px 0 0 24px;
              [dir='rtl'] & {
                border-radius: 0 24px 24px 0;
              }
            }
          }
          .rmc-picker:last-of-type {
            .rmc-picker-indicator {
              border-radius: 0 24px 24px 0;
              [dir='rtl'] & {
                border-radius: 24px 0 0 24px;
              }
            }
          }
        }
        .rmc-date-picker-item {
          -ms-flex: 1;
          flex: 1;
          text-align: center;
        }
      `}
    />
  );
}
