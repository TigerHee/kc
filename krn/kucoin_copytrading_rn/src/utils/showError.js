/*
 * @owner: borden@kupotech.com
 */
import {showToast} from '@krn/bridge';

import {queryClient} from 'config/queryClient';

const onError = (e, dispatch) => {
  if (+e?.code === 401) {
    dispatch({
      type: 'app/update',
      payload: {isLogin: false, userInfo: null},
    });

    dispatch({
      type: 'leadInfo/update',
      payload: {isLeadTrader: false, activeLeadSubAccountInfo: null},
    });

    // 登录过期 情况 query 缓存
    queryClient.clear();

    // 401 不提示 toast，主页会进行刷新 session
    return;
  }
  if (e?.msg) showToast(e.msg);
};

export default onError;
