/**
 * Owner: solar@kupotech.com
 */
import { MDrawer, styled, Dialog, Dialog as KuxDialog } from '@kux/mui';

export const StyledMDrawer = styled(MDrawer)`
  max-height: 100%;
  .KuxDrawer-content {
    padding: 16px;
    padding-bottom: 0;
  }
  .KuxModalHeader-root {
    flex: 0 0 56px;
  }
`;

export const StyledKuxDialog = styled(KuxDialog)`
  .KuxModalHeader-root {
    flex: 0 0 98px;
  }
  .KuxDialog-body {
    max-height: 100%;
  }
  .KuxForm-itemError {
    padding-left: 0;
  }
`;

export const StyledDialog = styled(Dialog)`
  max-height: 100%;
  overflow-y: scroll;
`;
