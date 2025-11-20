/**
 * owner: june.lee@kupotech.com
 */

import { useSnackbar } from '@kux/mui';
import loadable from '@loadable/component';
import { useTranslation } from '@tools/i18n';
import { memo, useCallback, useEffect, useState } from 'react';

const AgreeDialog = loadable(() => import('./AgreeDialog'));
const ResultDialog = loadable(() => import('./ResultDialog'));

/**
 * 协议重签弹窗
 */
const AgreeDialogEntry = ({ isSub, onSuccess, resultProps, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');
  const { open: openFromProps, onCancel: onCancelFromProps } = otherProps;
  const { message } = useSnackbar();
  const [open, setOpen] = useState(false);

  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(
    (...rest) => {
      setOpen(true);
      if (onSuccess) onSuccess(...rest);
    },
    [onSuccess],
  );

  useEffect(() => {
    if (openFromProps && isSub) {
      message.error(_t('bca93a8787b24000a4c8'));
      onCancelFromProps?.();
    }
  }, [isSub, message, onCancelFromProps, openFromProps]);

  return (
    <>
      <AgreeDialog onSuccess={handleSuccess} {...otherProps} />
      <ResultDialog open={open} onCancel={onCancel} {...resultProps} />
    </>
  );
};

export default memo(AgreeDialogEntry);
