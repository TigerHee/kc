/*
 * owner: Borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Drawer, MDrawer, styled, useResponsive } from '@kux/mui';
import NoSSG from 'components/NoSSG';
import { forwardRef } from 'react';

export const StyledDrawer = styled(Drawer)`
  .KuxDrawer-content {
    padding: ${(props) => props.contentPadding};
    padding-bottom: 20px;
  }
  .KuxModalHeader-close {
    right: 32px !important;
    left: auto !important;
  }
`;
const StyledMDrawer = styled(MDrawer)`
  width: 100%;
`;

const MuiDrawer = forwardRef((props, ref) => {
  const _show = props.open || props.show;
  const _onClose = props.onCancel || props.onClose;
  const { sm } = useResponsive();
  const isInApp = JsBridge.isApp();

  const commonProps = {
    open: _show,
    show: _show,
    onClose: _onClose,
    onCancel: _onClose,
  };

  return (
    <NoSSG>
      {sm && !isInApp ? (
        <StyledDrawer ref={ref} {...props} {...commonProps} />
      ) : (
        <StyledMDrawer
          ref={ref}
          headerProps={{ border: false }}
          {...props}
          {...commonProps}
          anchor="bottom"
        />
      )}
    </NoSSG>
  );
});

export default MuiDrawer;
