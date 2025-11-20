/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';
import KuFoxThemeProvider from '@kufox/mui/ThemeProvider';
import { _t } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import { useLogin } from 'src/hooks';
import loadable from '@loadable/component';
import useUserLimit from 'components/$/LeGoActivity/hook/useUserLimit';
const UserLimitedInfoDialog = loadable(() => import('components/UserLimitedInfoDialog'));

const initInfo = debounce((func) => {
  if (typeof func === 'function') {
    func();
  }
}, 5000, { leading: true, trailing: false });

export default ({ children }) => {
  const dispatch = useDispatch();
  const { isInApp } = useSelector((state) => state.app);
  const { showUserLimitedDialog, handleClose } = useUserLimit({ delay: true });

  const handleLoginChange = useCallback(() => {
    initInfo(() => dispatch({ type: 'app/init' }))
  }, []);

  useLogin(handleLoginChange);

  // 所有页面用h5的header, 将app的header隐藏， 首页的返回， 需要返回app
  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: { name: 'enableBounces', isEnable: false }, // webview 取消弹性效果
      });
    }
  }, [isInApp]);

  // 监听app登录成功事件
  /* useEffect(
    () => {
      if (isInApp) {
        window.onListenEvent('onLogin', () => {
          dispatch({ type: 'app/init' });
        });
      }
    },
    [dispatch, isInApp],
  ); */

  useEffect(() => {
    const appInit = () => initInfo(() => {
      dispatch({ type: 'app/init' });
    });
    window.onListenEvent('onLogin', appInit);
  }, []);

  return (
    <KuFoxThemeProvider>
      {children}
      {showUserLimitedDialog && (
        <UserLimitedInfoDialog
          open={showUserLimitedDialog}
          title={_t('taskCenter.tradeTask1.infoModal.title')}
          des={_t('eKmbjLkJHCf3c3WCVAiUro')}
          okText={_t('taskCenterTwo.adTask.limitedUser.btn')}
          onClose={handleClose}
        />
      )}
    </KuFoxThemeProvider>
  );
};
