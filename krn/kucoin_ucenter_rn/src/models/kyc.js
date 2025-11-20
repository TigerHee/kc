/**
 * Owner: mike@kupotech.com
 */
import {baseModel} from 'utils/dva';
import extend from 'dva-model-extend';
import * as serv from 'services/kyc';

const initStates = {
  kycInfo: {},
  privileges: {}, // 权益数据
  kybInfo: {},
  kycClearInfo: {}, //kyc打回信息
  rewardInfo: {}, // kyc3福利信息
  recharged: undefined, // 是否充足过
  traded: false, // 是否交易过
  financeListKYC: [], // KYC准入认证列表
  isPageLoading: false,
};

export default extend(baseModel, {
  namespace: 'kyc',
  state: initStates,
  effects: {
    // 初始化数据
    *resetValues({payload}, {put}) {
      yield put({type: 'update', payload: initStates});
    },
    // 获取kyc的各种状态
    *pullKycInfo({payload = {}, callback}, {call, put, select}) {
      let handler = serv.getKycResult;
      if (payload && payload.type === 1) {
        // 企业认证请求原有接口，个人认证请求新的kycInfo接口
        handler = serv.getKycInfo;
      }
      const {data, success} = yield call(handler, payload);
      if (success) {
        try {
          // 获取用户是否打回
          const res = yield call(serv.getKycClearInfo);

          if (res.success && res.data) {
            yield put({
              type: 'update',
              payload: {
                kycClearInfo: res?.data,
              },
            });
          }
        } catch (error) {}

        const info = {
          ...data,
          originFailureReason: data.failureReason,
        };
        const _payload =
          payload && payload.type === 1 ? {kybInfo: info} : {kycInfo: info};
        yield put({
          type: 'update',
          payload: _payload,
        });
        if (typeof callback === 'function') {
          callback();
        }
        return info;
      }
    },
    // 获取权益列表
    *getPrivileges({payload, callback}, {call, put}) {
      try {
        const {data} = yield call(serv.getPrivileges, payload);
        yield put({type: 'update', payload: {privileges: data}});
        return data;
      } catch (error) {
        const msg = error?.msg
          ? typeof error?.msg === 'string'
            ? error?.msg
            : 'error'
          : typeof error === 'string'
          ? error
          : 'error';

        return {success: false, msg, data: {}};
      }
    },
    // 获取显示最高返利的文案
    *getKYC3RewardInfo({payload}, {call, put}) {
      try {
        const {data: rewardInfo} = yield call(serv.getKYC3RewardInfo);
        if (rewardInfo?.taskSubTitle) {
          rewardInfo.taskSubTitle = rewardInfo.taskSubTitle
            .replace('<span>', '<SPAN>')
            .replace('</span>', '</SPAN>');
        }

        yield put({type: 'update', payload: {rewardInfo}});
      } catch (error) {}
    },
    // 打回 重置数据
    *updateClearInfo({payload}, {call}) {
      yield call(serv.clearInfo);
    },
    *pullRestrictedStatus(_, {call, put}) {
      const {success, data} = yield call(serv.getRestrictedStatus);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            restrictedStatus: data,
          },
        });
      }
    },
    *getUserDepositFlag({payload}, {call, put}) {
      const {success, data = {}} = yield call(serv.getUserDepositFlag);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            recharged: data && data.recharged,
            traded: data && data.traded,
          },
        });
      }
    },
    *pullFinanceList({payload: {kycType, isDealLoading}}, {call, put}) {
      if (isDealLoading) {
        yield put({
          type: 'update',
          payload: {isPageLoading: true},
        });
      }
      try {
        const {success, data} = yield call(serv.getFinanceList, {kycType});
        if (success) {
          yield put({
            type: 'update',
            payload: {financeListKYC: data?.fianceList || []},
          });
        }
      } catch (error) {
        console.error(error);
      }
      if (isDealLoading) {
        yield put({
          type: 'update',
          payload: {isPageLoading: false},
        });
      }
    },
  },
});
