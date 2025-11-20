/*
 * owner: borden@kupotech.com
 * desc: 印度Pan码弹窗
 */
import React from 'react';
import loadable from '@loadable/component';
import { useEventCallback } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
// import { TaxInfoCollectDialog as Dialog } from '@packages/kyc/src/componentsBundle';
import { NAMESPACE } from '../config';

const Dialog = loadable(() => import('@packages/kyc/src/componentsBundle'), {
  resolveComponent: (module) => {
    return module.TaxInfoCollectDialog;
  },
});

const TaxInfoCollectDialog = () => {
  const dispatch = useDispatch();
  const taxInfoCollectDialogOpen = useSelector(
    (state) => state[NAMESPACE].taxInfoCollectDialogOpen,
  );

  const onCancel = useEventCallback(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: { taxInfoCollectDialogOpen: false },
    });
  });

  if (!taxInfoCollectDialogOpen) return null;
  return <Dialog source="fasttrading" onCancel={onCancel} open={taxInfoCollectDialogOpen} />;
};

export const preloadTaxInfoCollectDialog = () => {
  Dialog.preload();
};

export default React.memo(TaxInfoCollectDialog);
