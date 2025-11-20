/**
 * Owner: roger.chen@kupotech.com
 */
import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {queryUserInfo} from 'services/app';
import {setCsrf} from 'utils/request';
import * as ws from '@kc/socket/lib/rn';
import {GREEN_UP_COlOR} from 'config';

const socket = ws.getInstance();
const socketConnectCheck = user => {
  console.log('--socket connect check--');
  // 检测socket链接
  const {uid = ''} = user || {};
  if (!socket.connected()) {
    // 未连接，去连接
    socket.connect({
      sessionPrivate: !!uid,
      uid,
    });
  } else {
    // 已连接，检查是否要切换公/私有连接
    if (!socket.sessionPrivate && user && uid) {
      // 当前是公有连接且已经查到用户信息，切换为私有连接
      socket.connect({
        sessionPrivate: !!uid,
        uid,
      });
    }
  }
};

export default extend(baseModel, {
  namespace: 'app',
  state: {
    isLogin: null, // 初始化未发生请求时为null，已登录为true，未登录为false
    userInfo: null,
    marketColors: GREEN_UP_COlOR, // 使用默认值，暂不跟随app设置
  },
  effects: {
    *initApp({payload}, {put}) {
      yield put({type: 'getUser'});
    },
    *getUser({payload}, {put, call}) {
      let info = null;
      try {
        const {success, data} = yield call(queryUserInfo);
        if (success && data) {
          if (data.csrf) {
            setCsrf(data.csrf);
            ws.setCsrf(data.csrf);
          }
          yield put({type: 'update', payload: {isLogin: true, userInfo: data}});
        } else {
          yield put({type: 'update', payload: {isLogin: false}});
        }
        info = data;
      } catch (e) {
        yield put({type: 'update', payload: {isLogin: false}});
      } finally {
        socketConnectCheck(info);
      }
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'initApp'});
    },
  },
});
