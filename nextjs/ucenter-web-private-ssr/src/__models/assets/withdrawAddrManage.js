/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import mulPagination from 'common/models/mulPagination';
import polling from 'common/models/polling';
import extend from 'dva-model-extend';
import { filterChainInfo } from 'helper';
import { map } from 'lodash-es';
import { getAddrChainInfo } from 'services/currency';
import * as serv from 'services/withdrawAddrManage';

const pageSize = 10;

export default extend(base, mulPagination, filter, polling, {
  namespace: 'withdrawAddrManage',
  state: {
    currency: null,
    chainInfo: [], // 普通地址币链数据
    univeralChainInfo: [], // 通用链数据
    contact: {
      // 联系人分页数据
      pagination: false,
      records: [],
    },
    contactFilters: {}, // 联系人过滤参数
  },
  reducers: {
    // 对二层数据进行修改
    deepSave(state, { payload, propsKey }) {
      return {
        ...state,
        [propsKey]: {
          ...state[propsKey],
          ...payload,
        },
      };
    },
  },
  effects: {
    // 获取常用的提币地址, 分页
    *getAddrs({ payload: { page, pageSize: _pageSize } = {} }, { put, call, select }) {
      const pagination = {
        page: page || 1,
        pageSize: _pageSize || pageSize,
      };
      const filters = yield select((state) => state.withdrawAddrManage.filters) || {};
      const records = yield call(serv.getFavoriteAddrs, {
        ...filters,
        ...pagination,
      });
      yield put({
        type: 'savePage',
        payload: {
          ...records,
        },
      });
    },
    *getContactList({ payload: { page, pageSize: _pageSize } = {} }, { put, call, select }) {
      const pagination = {
        page: page || 1,
        pageSize: _pageSize || pageSize,
      };
      const filters = yield select((state) => state.withdrawAddrManage.contactFilters) || {};
      const { data: records } = yield call(serv.getFavoriteContacts, {
        ...filters,
        ...pagination,
      });
      yield put({
        type: 'savePage',
        payload: {
          ...(records || {}),
        },
        listName: 'contact',
      });
    },
    *getAPIWithdrawStatus(action, { call, put }) {
      const result = yield call(serv.getAddrWhiteListEnable, {
        type: 'API_WITHDRAW',
      });
      yield put({
        type: 'update',
        payload: {
          isEnabled: !!result.data,
        },
      });
    },
    *updateAPIWhiteListStatus({ payload }, { call, put }) {
      const { isEnabled } = payload;
      const funcMap = {
        open: 'enableApiWhiteList', // 开启白名单
        close: 'updateAddrWhiteListEnable', // 关闭白名单
      };
      try {
        yield call(serv[funcMap[isEnabled ? 'open' : 'close']], {
          isEnabled,
          type: 'API_WITHDRAW',
        });
      } catch (e) {
        if (e.code !== '26000') {
          throw e;
        }
      }
      yield put({
        type: 'update',
        payload: {
          isEnabled,
        },
      });
    },
    /* 获取新增通用地址-币链数据 */
    *getAddrChainInfo({ payload = {}, universal = false }, { call, put }) {
      const { data } = yield call(getAddrChainInfo, payload);
      if (data.length) {
        const chainInfo = filterChainInfo(data);
        const field = universal ? 'univeralChainInfo' : 'chainInfo';
        yield put({
          type: 'update',
          payload: {
            [field]: map(chainInfo, (item) => {
              if (item.chain === undefined) item.chain = item.chainId;
              return item;
            }),
          },
        });
      }
    },
    *addrPreValidate({ payload }, { call }) {
      const { success, data } = yield call(serv.addrPreValidate, payload);
      if (success) return data;
    },
  },
});
