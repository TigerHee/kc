/**
 * Owner: solar@kupotech.com
 */
import { useResponsive, Dialog, MDialog, styled } from '@kux/mui';
import useUpdateEffect from '../hooks/useUpdateEffect';

const StyledMDrawer = styled(MDialog)`
  .KuxDrawer-content {
    padding: 16px;
  }
`;

export default function Modal({ open, onCancel, title, onClose, children }) {
  const { sm } = useResponsive();
  useUpdateEffect(() => {
    onClose?.();
  }, [sm]);
  if (sm) {
    return (
      <Dialog
        size="medium"
        maskClosable
        open={open}
        onCancel={onCancel}
        footer={null}
        title={title}
        destroyOnClose
        // {...restProps}
      >
        {children}
      </Dialog>
    );
  }
  return (
    <StyledMDrawer
      headerBorder
      title={title}
      anchor="bottom"
      show={open}
      onClose={onCancel}
      width="100%"
      back={false}
      footer={null}
    >
      {children}
    </StyledMDrawer>
  );
}
