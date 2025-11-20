/*
  * owner: borden@kupotech.com
  * desc: 印度PAN码引导填写弹窗
 */
import React, { useCallback } from 'react';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'dva';
import { useTheme } from '@kux/mui';

const Dialog = loadable(() => Systemjs.import('@kucoin-biz/kyc'), {
  resolveComponent: (module) => {
    return module.TaxInfoCollectDialog;
  },
});

const TaxInfoCollectDialog = (props) => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const moveCheck = useSelector(state => state.setting.moveCheck);
  const timeCheck = useSelector(state => state.setting.timeCheck);
  const taxInfoCollectDialogConfig = useSelector(state => state.dialog.taxInfoCollectDialogConfig);

  const onCancel = useCallback(() => {
    dispatch({
      type: 'dialog/updateTaxInfoCollectDialogConfig',
      payload: {
        open: false,
      },
    });
  }, []);

  if (!(timeCheck || moveCheck)) return null;
  return (
    <Dialog
      onCancel={onCancel}
      theme={currentTheme}
      {...taxInfoCollectDialogConfig}
      {...props}
    />
  );
};

export default React.memo(TaxInfoCollectDialog);
