/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { useTheme } from '@kux/mui';
import { Global, css } from '@kux/mui/emotion';

// 全局样式， 可以用className
const GlobalStyle = React.memo(() => {
  const { colors } = useTheme();
  const style = css`
    .bot-order,
    .bot-create,
    .bot-dialog,
    .bot-popover,
    .bot-drawer {
      .Flex {
        display: flex;
      }

      .inlineflex {
        display: inline-flex;
      }

      .flex1 {
        flex: 1;
      }
      .fe {
        justify-content: flex-end;
      }

      .vc {
        align-items: center;
      }

      .ve {
        align-items: flex-end;
      }

      .hc {
        justify-content: center;
      }

      .sb {
        justify-content: space-between;
      }

      .sa {
        justify-content: space-around;
      }

      .v {
        flex-direction: column;
      }
      .cursor-pointer {
        cursor: pointer;
      }
      .left {
        text-align: left;
      }

      .center {
        text-align: center;
      }

      .right {
        text-align: right;
      }
      .ellipsisx {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .overflowX {
        overflow-x: auto;
      }
      .overflowY {
        overflow-y: auto;
      }
      .color-primary {
        color: ${colors.primary};
      }
      .color-secondary {
        color: ${colors.secondary};
      }
      .fullHeight {
        height: 100%;
      }
      .fullWidth {
        width: 100%;
      }
      .learnmore {
        cursor: pointer;
      }
      .bot-update-form .trade-form-item {
        margin-bottom: 0;
      }
    }
  `;
  return <Global styles={style} />;
});

export default GlobalStyle;
