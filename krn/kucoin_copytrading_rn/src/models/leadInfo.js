import extend from 'dva-model-extend';
import {isEmpty} from 'lodash';

import {TRADER_ACTIVE_STATUS} from 'constants/businessType';
import {queryActiveLeadTraders} from 'services/copy-trade';
import {baseModel} from 'utils/dva';
import {AsyncLeadAccountInfoController} from './helper/asyncLeadAccountInfoController';
const convertLeadList = list =>
  list?.map(i => ({...i, nickName: i.nickName || i.nickname}));

export default extend(baseModel, {
  namespace: 'leadInfo',
  state: {
    isLeadTrader: null, // 初始化未发生请求时为null，当前用户为带单员true，不为带单员为false
    activeLeadSubAccountInfo: null, // 1 期 母账户仅有一条仅激活 子账号信息
    sufficientInitAmount: null, // 带单员子账户是否具备带单初始金额 ，未发生请求为 null， 满足金额 true ，不满足 false
  },

  effects: {
    *pullUserLeadInfo(_, {put, call}) {
      try {
        const {data} = yield call(queryActiveLeadTraders);

        const activeList = convertLeadList(
          data?.filter(i => i.status !== TRADER_ACTIVE_STATUS.Disabled),
        );
        const activeLeadSubAccountInfo = activeList?.[0] || {};

        yield put({
          type: 'updateLeadInfo',
          payload: {
            activeLeadSubAccountInfo,
          },
        });
      } catch (e) {
        // user-info接口的http status code非200记录为网络异常
        if (+e?.httpStatus < 200 || +e?.httpStatus >= 300) {
          return; // 网络异常不做 变更 带单tabisLeadTrader 标识
        }
        yield put({type: 'update', payload: {isLeadTrader: false}});
      }
    },
  },

  reducers: {
    resetLeadInfo(state) {
      return {...state, isLeadTrader: null, activeLeadSubAccountInfo: null};
    },
    updateLeadInfo(state, {payload}) {
      const {activeLeadSubAccountInfo} = payload;

      AsyncLeadAccountInfoController.notifyAccount(activeLeadSubAccountInfo);
      return {
        ...state,
        isLeadTrader:
          activeLeadSubAccountInfo && !isEmpty(activeLeadSubAccountInfo),
        activeLeadSubAccountInfo,
      };
    },
  },
});
