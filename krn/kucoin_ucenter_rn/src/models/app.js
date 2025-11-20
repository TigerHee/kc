import extend from 'dva-model-extend';
import {baseModel} from 'utils/dva';
import {queryUserInfo} from 'services/app';
import {setCsrf} from 'utils/request';

export default extend(baseModel, {
  namespace: 'app',
  state: {
    isLogin: null, // 初始化未发生请求时为null，已登录为true，未登录为false
    userInfo: null,
    currency: null,
    currencyList: [],
    userChange: null, // 初始化未发生请求时为null，与上一次登录uid相同为false，否则为false
  },
  effects: {
    *initApp({payload}, {put}) {
      yield put({type: 'getUser'});
    },
    *getUser({payload}, {put, call, select}) {
      try {
        const {success, data} = yield call(queryUserInfo);
        if (success && data) {
          // 上一次持久化的uid和本次的uid比对
          const prevUid = yield select(s => s.app.__uid);
          data.csrf && setCsrf(data.csrf);
          yield put({
            type: 'update',
            payload: {
              isLogin: true,
              userInfo: data,
              userChange: prevUid !== data.uid,
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {isLogin: false, userChange: true},
          });
        }
      } catch (e) {
        yield put({
          type: 'update',
          payload: {isLogin: false, userChange: true},
        });
        throw e;
      } finally {
      }
    },
  },
  subscriptions: {
    setUp({dispatch}) {
      dispatch({type: 'initApp'});
    },
  },
});
