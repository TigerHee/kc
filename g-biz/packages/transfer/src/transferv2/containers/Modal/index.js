/**
 * Owner: solar@kupotech.com
 */

import { useResponsive } from '@kux/mui';

import { StyledMDrawer, StyledKuxDialog } from './style';

export default function Modal({ children, onClose, visible, title }) {
  const { sm } = useResponsive();
  if (sm) {
    return (
      <StyledKuxDialog
        size="medium"
        open={visible}
        destroyOnClose
        onClose={onClose}
        onCancel={onClose}
        title={title}
        footer={null}
      >
        {children}
      </StyledKuxDialog>
    );
  }
  return (
    <StyledMDrawer
      back={false}
      headerBorder
      title={title}
      anchor="bottom"
      show={visible}
      maskClosable={false}
      onClose={onClose}
    >
      {children}
    </StyledMDrawer>
  );
}
