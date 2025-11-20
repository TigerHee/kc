/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';
import { styled } from '@kux/mui/emotion';
import { _t } from 'utils/lang';
import { Dialog } from '@kux/mui';
import { isRTLLanguage } from 'utils/langTools';
import MobileDialog from './MobileDialog';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

const WrapperDialog = styled(Dialog)`
  &.adaptive-dialog {
    .KuxDialog-body {
      max-width: 500px;
    }
  }
  .KuxDialog-content {
    border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
    padding-bottom: 20px;
  }
  .KuxModalFooter-root {
    padding: 20px 32px;
  }
`;

const AdaptiveModal = (props) => {
  const {
    onClose,
    cancelButtonProps,
    okText = _t('security.form.btn'),
    cancelText = _t('trade.confirm.cancel'),
    okButtonProps,
    className = '',
    ...rest
  } = props;
  const isMobile = useIsH5();
  const isRtl = isRTLLanguage();
  return (
    <>
      {isMobile ? (
        <MobileDialog onClose={onClose} cancelText={cancelText} okText={okText} {...rest} />
      ) : (
        <WrapperDialog
          className={`adaptive-dialog ${className}`}
          cancelButtonProps={{
            ...cancelButtonProps,
            variant: 'text',
            style: {
              marginRight: isRtl ? '0px' : '24px',
              height: '40px',
              marginLeft: isRtl ? '24px' : '0px',
            },
          }}
          okButtonProps={{
            ...okButtonProps,
            style: { height: '40px' },
          }}
          cancelText={cancelText}
          okText={okText}
          anchor="bottom"
          onCancel={onClose}
          {...rest}
        >
          {props.children}
        </WrapperDialog>
      )}
    </>
  );
};

export default AdaptiveModal;
