/**
 * owner: june.lee@kupotech.com
 */

import { Checkbox, styled, useEventCallback, Dialog } from '@kux/mui';
import useRequest from '@packages/common-service/hooks/useRequest/index';
import { useState } from 'react';

const AgreeDialogRoot = styled(Dialog)`
  z-index: 9999;
  .body {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    .KuxDialog-body {
      max-width: 80%;
    }
    .body {
      gap: 16px;
    }
  }
`;

/**
 * 协议重签弹窗
 */
const AgreeDialog = ({
  id,
  open,
  onOk,
  onFail,
  pullFn,
  postFn,
  describe,
  onSuccess,
  acceptText,
  okButtonProps,
  ...restProps
}) => {
  const [checked, setChecked] = useState();

  const { loading: confirmLoading, runAsync: openFnFetch } = useRequest(postFn, {
    manual: true,
  });
  const openFn = openFnFetch;
  const handleChangeAccept = useEventCallback((e) => {
    setChecked(e.target.checked);
  });

  const handleOk = useEventCallback((...rest) => {
    if (onOk) onOk(...rest);
    openFn()
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((e) => {
        if (onFail) onFail(e);
      });
  });

  return (
    <>
      <AgreeDialogRoot
        open={open}
        onOk={handleOk}
        centeredFooterButton
        okButtonProps={{
          ...(okButtonProps || {}),
          loading: confirmLoading,
          disabled: !checked || confirmLoading,
        }}
        {...restProps}
      >
        <div className="body">
          <div className="describe">{describe}</div>
          <Checkbox checked={checked} onChange={handleChangeAccept}>
            {acceptText}
          </Checkbox>
        </div>
      </AgreeDialogRoot>
    </>
  );
};

export default AgreeDialog;
