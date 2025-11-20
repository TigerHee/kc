/**
 * Owner: jessie@kupotech.com
 */
import { Dialog, MDialog, styled } from '@kux/mui';

export const StyledMDialog = styled(MDialog)`
  .KuxModalHeader-root {
    min-height: 56px;
  }

  .KuxDrawer-root {
    max-height: 90%;
  }
`;

export const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-height: 700px;
  }

  .KuxDialog-large {
    .KuxModalHeader-root {
      min-height: 98px;
    }
  }
`;

export const StyledMToolTip = styled(Dialog)`
  .KuxDialog-body {
    max-width: 80%;
  }
  .KuxDialog-content {
    padding: 24px;
  }
`;
