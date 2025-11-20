/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { cryptoPwd, filterChainInfo, getBase64 } from 'helper';
import { isFunction, map } from 'lodash';
import {
  login,
  getReasonConfig,
  getReasonRecords,
  checkForm,
  submitApply,
  uploadImg,
  getImgurls,
  getCurrency,
  cancelApply,
  payFee,
  getConfig,
  getAccountInfo,
  getCoinDes,
} from 'services/selfService/selfService';
import { getChainInfo } from 'services/currency';
import { REASON_LIST } from 'routes/SelfServicePage/AssetsBack/config.js';

const CAPTCHA_CODE = '40011';

export default extend(base, {
  namespace: 'selfService',
  state: {
    account: undefined,
    phone: undefined,
    email: undefined,
    loading: false,
    _country: undefined,
    countryCode: undefined,
    loginToken: undefined,
    chainInfo: [],
    renderList: [], // 资产找回配置（全部）
    renderUsedList: [], // 资产找回配置（有效的）
    recordList: [], // 资产找回历史记录
    files: [],
    pagination: {
      pageNum: 1,
      pageSize: 5,
    },
  },
  effects: {
    *login({ payload, onCallback }, { call, put }) {
      yield put({ type: 'update', payload: { loading: true } });
      try {
        const { password } = payload;
        const cryptoPassword = cryptoPwd(password);
        let params = {
          ...payload,
          password: cryptoPassword,
          loginType: '',
        };
        const res = yield call(login, {
          ...params,
        });
        const {
          data: { loginToken, needValidations, type = 1, countryCode = '' },
        } = res || {};
        yield put({
          type: 'update',
          payload: {
            loading: false,
            token: loginToken,
            needValidations: needValidations || [],
            countryCode,
          },
        });
        isFunction(onCallback) && onCallback(res);
      } catch (e) {
        yield put({ type: 'update', payload: { loading: false } });
        isFunction(onCallback) && onCallback(e);
        if (!(e.code && e.code === CAPTCHA_CODE)) {
          throw e;
        }
      }
    },
    // 不完全登陆下获取账户是否绑定手机号，谷歌等
    *getAccountInfo({ payload }, { call }) {
      try {
        const { data } = yield call(getAccountInfo, payload);
        return data;
      } catch (e) {
        return {};
      }
    },
    *getChainInfo({ payload }, { call, put }) {
      const { data } = yield call(getChainInfo, payload);
      if (data.length) {
        const chainInfo = filterChainInfo(data);
        yield put({
          type: 'update',
          payload: {
            chainInfo,
          },
        });
      }
    },
    // 获取充值未到账原因配置
    *getReasonConfig(_, { call, put }) {
      const { data } = yield call(getReasonConfig);
      let renderUsedList = [];
      if (Array.isArray(data) && data.length) {
        const config = map(REASON_LIST, (item) => {
          const dataItem = data.find((d) => d.name === item.key);
          const res = {
            ...item,
            fee: (dataItem || {}).value,
          };
          if (dataItem) {
            renderUsedList.push(res);
          }
          return { ...res };
        });
        yield put({
          type: 'update',
          payload: {
            renderList: config || [],
            renderUsedList,
          },
        });
      }
    },
    // 查询充值未到账原因历史申请记录
    *getHistory({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.selfService);
      const { pageNum, pageSize } = pagination;
      const { currentPage, totalNum, totalPage, items } = yield call(getReasonRecords, {
        pageNum,
        pageSize,
        ...payload,
      });
      yield put({
        type: 'update',
        payload: {
          recordList: items,
          pagination: {
            ...pagination,
            currentPage,
            totalPage,
            totalNum,
          },
        },
      });
    },
    // 申请校验接口
    *checkForm({ payload }, { call, put }) {
      const { data } = yield call(checkForm, payload);
      yield put({
        type: 'update',
        payload: {
          checkData: data,
          reasonData: payload,
        },
      });
      return data;
    },
    // 提交资产找回申请
    *submitApply({ callBack }, { call, select }) {
      const { reasonData, files } = yield select((state) => state.selfService);
      const { success } = yield call(submitApply, { ...reasonData, files: files.map((f) => f.id) });
      if (success && callBack) {
        callBack();
      }
    },
    // 用户上传附件
    *uploadImg({ payload, callBack }, { call, put, select }) {
      try {
        const { files } = yield select((state) => state.selfService);
        const { success, msg, data } = yield call(uploadImg, payload);
        if (success) {
          const imgUrl = yield call(getBase64, payload?.file);
          const newFiles = files.concat([{ id: data.original, imgUrl }]);
          yield put({
            type: 'update',
            payload: {
              files: newFiles,
            },
          });
        }
        if (!success && callBack) {
          callBack(msg);
        }
      } catch (e) {
        if (callBack) {
          callBack(e);
        }
      }
    },
    // 点击根据id查询附件
    *getImgurlById({ payload }, { call, put, select }) {
      const { fileIds, id } = payload;
      const { recordList } = yield select((state) => state.selfService);
      const { success, data } = yield call(getImgurls, { fileIds });
      if (success) {
        const newRecordList = recordList.map((r) => ({
          ...r,
          imgUrls: r.id === id ? data : r.imgUrls,
        }));
        yield put({
          type: 'update',
          payload: {
            recordList: newRecordList,
          },
        });
      }
    },
    // 未填memo：支持找回的币种查询
    *getCurrency({ payload }, { call }) {
      const { success, data } = yield call(getCurrency, payload);
      if (success) {
        return data;
      }
    },
    // 未填memo：取消申请
    *cancelApply({ payload }, { call }) {
      try {
        const res = yield call(cancelApply, payload);
        return res;
      } catch (e) {
        return e;
      }
    },
    // 未填memo：缴纳手续费
    *payFee({ payload }, { call }) {
      try {
        const res = yield call(payFee, payload);
        return res;
      } catch (e) {
        return e;
      }
    },
    // 查询充值未到账的开关手续费等配置
    *getConfig({ payload }, { call, put }) {
      const res = yield call(getConfig, payload);
      if (res.success) {
        yield put({
          type: 'update',
          payload: {
            refundConfig: res.data || {},
          },
        });
      }
    },
    // 查询充值未到账的币种特别说明
    *getCoinDes({ payload }, { call }) {
      const res = yield call(getCoinDes, payload);
      if (res.success) {
        return res.data;
      }
    },
  },
});
