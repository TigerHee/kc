/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import Popover from '@kux/mui/Popover';

const MPopover = styled(Popover)`
  .KuxPopover-root,
  .KuxPopover-arrow span {
    background: #2d2d2f;
  }
  .KuxPopover-root {
    max-width: 400px;
  }
  ${({ minWidth }) => {
    if (minWidth) {
      return `.KuxPopover-root {
        min-width: ${minWidth}
      }`;
    }
  }}
`;
export default ({ className, ...rest }) => {
  return <MPopover className={`bot-popover ${className}`} {...rest} />;
};
