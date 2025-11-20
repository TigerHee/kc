/**
 * Owner: borden@kupotech.com
 */
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'dva';
import { isRTLLanguage } from 'src/utils/langTools';
import systemDynamic from 'src/utils/systemDynamic';
import useLoginDrawer from '@/hooks/useLoginDrawer';

const ForgetPwdDrawer = systemDynamic('@kucoin-biz/entrance', 'ForgetPwdDrawer');

export default () => {
  const dispatch = useDispatch();
  const { currentTheme } = useTheme();
  const { open } = useLoginDrawer();
  const { showForgetPwd, currentLang } = useSelector(state => state.app);
  const isRTL = useMemo(() => isRTLLanguage(currentLang), [currentLang]);
  const drawerAnchor = isRTL ? 'left' : 'right';

  const closeForgetPwd = useCallback(() => {
    dispatch({
      type: 'app/update',
      payload: {
        showForgetPwd: false,
      },
    });
  }, []);

  const onBack = useCallback(() => {
    closeForgetPwd();
    open();
  }, [closeForgetPwd]);

  return (
    <ForgetPwdDrawer
      theme={currentTheme}
      anchor={drawerAnchor}
      onClose={closeForgetPwd}
      show={showForgetPwd}
      onSuccess={onBack}
      onBack={onBack}
    />
  );
};
