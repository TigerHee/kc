/**
 * Owner: melon@kupotech.com
 */
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { sensors } from 'utils/sensors';
import { useSelector, useDispatch } from 'dva';
import JsBridge from 'utils/jsBridge';
import { getPageId } from 'utils/ga';
// 前置查询 如果用户没有登录会拉起登录
/**
 *
 * @param {*} prop
 * @param source 拉起登录&注册侧边栏的来源 不传递就默认是sensors配置的pageId；
 * @param useAppLoginInApp 在APP中是否希望直接拉起APP端的”注册&登陆“流程； 默认是希望；一般希望的使用场景是-挂载在webview上面的H5页面
 * @returns
 */
const useBtnClickCheck = (prop = {}) => {
  const { source, useAppLoginInApp = true, ...rest } = prop;
  const dispatch = useDispatch();
  const [pageId, updatePageId] = useState('');
  useEffect(() => {
    const init = async () => {
      const id = await getPageId();
      updatePageId(id);
    };
    init();
  }, []);
  const { isLogin } = useSelector((state) => state.user);
  const { isInApp, supportCookieLogin } = useSelector((state) => state.app);
  // 登陆逻辑
  const handleLogin = useCallback(() => {
    // 在APP中是否希望直接拉起APP端的”注册&登陆“流程；且在App里面，同时支持注入Cookie登录
    if (useAppLoginInApp && isInApp && supportCookieLogin) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
      return;
    }
    // 神策埋点 拉起登陆抽屉
    sensors.trackClick(['LogIn', '1']);
    dispatch({
      type: 'user/update',
      payload: {
        showLoginDrawer: true,
        source: source || pageId,
        ...rest,
      },
    });
  }, [dispatch, isInApp, supportCookieLogin, source, pageId, useAppLoginInApp, rest]);
  // 统一检查登录前置条件
  const btnClickCheck = useCallback(() => {
    if (!isLogin) {
      handleLogin();
      return false;
    }
    return true;
  }, [isLogin, handleLogin]);
  return {
    btnClickCheck,
    handleLogin,
  };
};

export default useBtnClickCheck;
