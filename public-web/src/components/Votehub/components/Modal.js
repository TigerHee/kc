/**
 * Owner: jessie@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { _t } from 'tools/i18n';
import { StyledDialog, StyledMDialog } from './styledComponents';

export default function Modal({
  children,
  open,
  onClose = () => {},
  onConfirm = () => {},
  disabledConfirm = false,
  ...others
}) {
  const { sm } = useResponsive();

  if (!sm) {
    return (
      <StyledMDialog
        show={open}
        anchor="bottom"
        onClose={() => {
          onClose();
        }}
        headerProps={{
          back: false,
        }}
        okButtonProps={{
          disabled: disabledConfirm,
        }}
        {...others}
      >
        {children}
      </StyledMDialog>
    );
  }

  return (
    <StyledDialog
      open={open}
      okText={_t('u9QAZW6WNmKYHB6do1KwgQ')}
      cancelText={_t('cancel')}
      onOk={() => {
        onConfirm();
      }}
      onCancel={() => {
        onClose();
      }}
      okButtonProps={{
        disabled: disabledConfirm,
      }}
      {...others}
    >
      {children}
    </StyledDialog>
  );
}
