import { UpdatePwdTipDialog } from 'gbiz-next/entrance';
import { useCompliaceRedirect } from 'gbiz-next/compliantCenter';
import { useState } from 'react';
import { useTheme } from '@kux/mui';

export default () => {
  useCompliaceRedirect();
  const theme = useTheme();
  const [isUpdatePwdTipDialogInit, setUpdatePwdTipDialogInit] = useState(true);
  return (
    <UpdatePwdTipDialog
      isInit={isUpdatePwdTipDialogInit}
      theme={theme.currentTheme}
      onCallback={() => {
        setUpdatePwdTipDialogInit(false);
      }}
    />
  );
};
