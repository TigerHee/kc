/*
 * owner: borden@kupotech.com
 * desc: 印度PAN码引导填写弹窗
 */
import { useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import React from 'react';

const Dialog = loadable(() => System.import('@kucoin-biz/kyc'), {
  resolveComponent: (module) => {
    return module.TaxInfoCollectDialog;
  },
});

export const preloadTaxInfoCollectDialog = () => {
  Dialog.preload();
};

const TaxInfoCollectDialog = ({ open, ...otherProps }) => {
  const { currentTheme } = useTheme();

  if (!open) return null;
  return <Dialog open={open} theme={currentTheme} {...otherProps} />;
};

export default React.memo(TaxInfoCollectDialog);
