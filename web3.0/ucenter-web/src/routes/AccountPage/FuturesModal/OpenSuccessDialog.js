/**
 * Owner: willen@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';
import React, { forwardRef, memo, useImperativeHandle, useState } from 'react';

import { _t } from 'tools/i18n';

const SuccessBody = styled.div`
  color: var(--body);
  font-size: 14px;
`;

const OpenSuccessDialog = (__, ref) => {
  const [open, setOpen] = useState(false);
  const [isBonus, setIsBons] = useState(false);

  const text = React.useMemo(() => {
    let type = _t('open.futures.body.default');
    if (isBonus) {
      type = _t('open.futures.body.no.bonus');
    }
    return type;
  }, [isBonus]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOk = () => {
    handleClose();
  };

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      setIsBons(data);
    },
    close: () => {
      handleClose();
    },
  }));

  return (
    <Dialog
      title={_t('open.futures.success')}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText={_t('spotlight.ok')}
      cancelText={null}
      okButtonProps={{
        size: 'basic',
      }}
      maxWidth={false}
    >
      <SuccessBody>{text}</SuccessBody>
    </Dialog>
  );
};

export default memo(forwardRef(OpenSuccessDialog));
