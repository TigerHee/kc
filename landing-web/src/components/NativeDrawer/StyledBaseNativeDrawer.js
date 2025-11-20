/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { styled } from '@kux/mui/emotion';
import BaseNativeDrawer from 'components/NativeDrawer/BaseNativeDrawer';
import { isIOS } from 'helper';

export const StyledBaseNativeDrawer = styled(BaseNativeDrawer)`
  padding-bottom: ${() => (isIOS() ? '34px' : 0)};
  border-radius: 16px 16px 0 0;
  .KuxModalHeader-root {
    display: none;
  }
  .KuxDrawer-content {
    display: flex;
    flex-direction: column;
    padding-top: 24px;
  }
`;
