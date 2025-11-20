/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import moment from 'moment';
import { includes, pick } from 'lodash';
import base from 'common/models/base';
import pagination from 'common/models/paginate';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import * as serv from 'services/assets';
import { getChainInfo, getDepositTips } from 'services/currency';
import { filterChainInfo, groupByEnableStatus } from 'helper';
import { track } from 'utils/ga';
import userSubScription from './userSubScription';
import Report from 'tools/ext/kc-report';
// 新版到账账户列表
const toAccountTypeList = ['MAIN', 'TRADE', 'TRADE_HF'];

export default extend(base, pagination, filter, polling, userSubScription, {
  namespace: 'coinin',
  state: {
    records: [],
    addressList: [],
    maxAddressNum: 20,
    toAccountTypeList: [], // 当前可充值账户列表
    toSubAccountTypeMaps: {}, // 当前子账号支持的充值账户列表
    subAccountsList: [], // 可充值子账号列表
    address: {},
    filters: {
      currentPage: 1,
      pageSize: 10,
      coin: undefined,
      chainId: undefined,
    },
    recentCurrencies: [], // 用户最近充值列表
    hotCurrencies: [], // 热门充值列表
    isGettingAddr: false,
    chainInfo: [], // 链路信息
    isFirstLoadedChainInfo: false, // 是否加载过一次chainInfo
    toAccountType: 'MAIN',
    coinType: 'digital',
    // preTips: {}, // 所有币、币链、链的前置提示数据
    depositTips: {}, // 返回币、币链、链的禁充提提示信息、前置提示信息
    searchRecords: [], // 用户充值-搜索历史列表
    lastChain: null, // 上次充值使用币链（币种下币链）
    feeRule: null, //手续费规则
    depositFreeFee: null, // 充值免费额度
    isQueriedFreeQuota: undefined,
  },
  effects: {
    *resetState(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          address: {},
          records: [],
          pagination: false,
        },
      });
      yield put({
        type: 'filter',
        payload: {
          currentPage: 1,
          pageSize: 10,
        },
        effect: false,
      });
    },
    *resetChainInfo(_, { put }) {
      yield put({
        type: 'update',
        payload: {
          chainInfo: [],
          lastChain: null,
        },
      });
      yield put({
        type: 'filter',
        payload: {
          chainId: '',
        },
        effect: false,
      });
    },
    *pullRecords(_, { put, call, select }) {
      const { filters } = yield select((state) => state.coinin);
      const { coin, ...others } = filters;
      const { items, currentPage, pageSize, totalNum } = yield call(serv.getDepositList, {
        currency: coin,
        ...others,
      });
      yield put({
        type: 'savePage',
        payload: {
          items,
          currentPage,
          pageSize,
          totalNum,
        },
      });
    },
    // 更新默认充值到账账户
    *updateDefaultAccountType({ payload: { currency, toAccountType, oldType } }, { put }) {
      try {
        yield put({
          type: 'user_assets/updateAutoTransfer',
          payload: {
            currency,
            toAccountType,
          },
        });
      } catch (e) {
        // 调用更新接口失败，回滚上一个充值账户
        yield put({
          type: 'update',
          payload: {
            toAccountType: oldType,
          },
        });
      }
    },
    *pullAddress({ payload: { currency, chainId } }, { put, call }) {
      try {
        const { data } = yield call(serv.getAddress, { currency, chainId });
        if (data) {
          yield put({
            type: 'update',
            payload: {
              address: data,
              isGettingAddr: false,
            },
          });
          // 更新toAccountType，如果不是储蓄或币币，则自动帮用户选择储蓄账户
          // 充值界面改版后，到账账户只有储蓄和币币2个选项
          if (data.toAccountType && includes(toAccountTypeList, data.toAccountType)) {
            yield put({
              type: 'update',
              payload: {
                toAccountType: data.toAccountType || 'MAIN',
              },
            });
          } else {
            yield put({
              type: 'updateDefaultAccountType',
              payload: {
                currency,
                toAccountType: 'MAIN',
                oldType: data.toAccountType || 'MAIN',
              },
            });
          }
          // 请求充值地址，成功埋点
          track('depositAddressRequst_results', {
            is_success: true,
            fail_reason: '',
            coin: currency,
            chain: chainId,
            is_memo: !!data.memo,
            channel: 'JS',
            deposit_Account: `${data.toSubUserId ? 'SUB' : ''}${data.toAccountType}`,
            is_remark: data.remark ? '1' : '0',
          });
        } else {
          yield put({
            type: 'addAddress',
            payload: {
              currency,
              chainId,
            },
          });
        }
      } catch (e) {
        yield put({
          type: 'addAddress',
          payload: {
            currency,
            chainId,
          },
        });
      }
    },
    *pullAddressList({ payload: { currency, chainId } }, { put, call }) {
      try {
        const { data } = yield call(serv.getAddressList, { currency, chainId });
        if (data) {
          yield put({
            type: 'update',
            payload: {
              addressList: data.addresses,
              maxAddressNum: data.maxNum,
            },
          });
          return data;
        } else {
          return {};
        }
      } catch (e) {
        return {};
      }
    },
    *pullAccountList(_, { put, call }) {
      try {
        const { data } = yield call(serv.getAccountList);
        if (data) {
          yield put({
            type: 'update',
            payload: {
              toAccountTypeList: data.account,
              subAccountsList: data.subUser,
            },
          });
        }
      } catch (e) {}
    },
    *pullSubAccountList({ payload: { subUserId } }, { put, call, select }) {
      const toSubAccountTypeMaps = yield select((state) => state.coinin.toSubAccountTypeMaps);
      if (toSubAccountTypeMaps[subUserId]) return;
      try {
        const { data } = yield call(serv.getSubAccountList, { subUserId });
        if (data) {
          yield put({
            type: 'update',
            payload: {
              toSubAccountTypeMaps: {
                ...toSubAccountTypeMaps,
                [subUserId]: data,
              },
            },
          });
        }
      } catch (e) {}
    },
    // 获取前置提示（币，链，币链的前置提示）；币、币链、链的禁充提提示信息
    *getTips({ payload: { coin } = {} }, { put, select, call }) {
      const { coinType } = yield select((state) => state.coinin);
      if (coinType === 'digital') {
        try {
          const { data: tips } = yield call(getDepositTips, {
            currency: coin,
            type: 'DEPOSIT',
            domainId: 'kucoin',
          });
          yield put({
            type: 'update',
            payload: {
              depositTips: {
                tips,
                currency: coin,
              },
            },
          });
        } catch (e) {
          yield put({
            type: 'update',
            payload: {
              depositTips: {
                currency: coin,
                tips: null,
              },
            },
          });
        }
      }
    },
    *query(_, { put, select, call }) {
      const { isFirstLoadedChainInfo } = yield select((state) => state.coinin);
      const { coin } = yield select((state) => state.coinin.filters);
      try {
        const { data } = yield call(serv.getAssetsChainInfo, { currency: coin });
        if (data && data.length && data.length > 0) {
          const chainInfo = groupByEnableStatus(filterChainInfo(data), 'isDepositEnabled');
          yield put({
            type: 'update',
            payload: {
              chainInfo,
              lastChain: null,
            },
          });
          yield put({
            type: 'filter',
            payload: {
              // chainId: chainInfo.length >= 1 ? chainInfo[0].chain : '', // 单链传空字符串,多链默认取第一个
              chainId: '',
            },
            // effect: 'queryAddress',
            effect: null,
          });
          // 获取指定币种最近使用的币链
          yield put({
            type: 'getLastUseChain',
            payload: { coin },
          });
          // 获取币链订阅数据
          yield put({
            type: 'pullSubScriptionList',
            payload: {
              category: 'chainSubscriptionList',
              currency: coin,
              type: 'DEPOSIT',
              subscriptionObjectType: 'CURRENCY_CHAIN',
            },
          });
        } else {
          // 未获取到chainInfo，重置数据
          yield put({ type: 'resetChainInfo' });
        }
      } catch (e) {
        console.error(e);
        // 未获取到chainInfo，重置数据
        yield put({ type: 'resetChainInfo' });
      } finally {
        if (!isFirstLoadedChainInfo) {
          yield put({
            type: 'update',
            payload: {
              isFirstLoadedChainInfo: true,
            },
          });
        }
      }
    },
    *queryAddress(_, { put, select }) {
      const { coin, chainId } = yield select((state) => state.coinin.filters);
      yield put({
        type: 'pullAddress',
        payload: {
          currency: coin,
          chainId,
        },
      });
    },
    *queryFee(_, { put, call, select }) {
      const { coin, chainId } = yield select((state) => state.coinin.filters);
      const { language = '' } = yield select((state) => state?.user?.user || {});
      try {
        const { data } = yield call(serv.getDepositFee, {
          currency: coin,
          chainId,
          lang: language || window._DEFAULT_LANG_,
          version: 1,
        });
        yield put({
          type: 'update',
          payload: {
            feeRule: data,
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
    *pullRecentCurrency(_, { put, call }) {
      const { data } = yield call(serv.getRecentDepositList);
      const _data = [...(data || [])].filter((v) => v.currency !== 'DEGO');
      _data.push({
        currency: 'DEGO',
        currencyName: 'DEGO',
      });
      yield put({
        type: 'update',
        payload: {
          recentCurrencies: _data,
        },
      });
    },
    *addListAddress({ payload }, { put, call }) {
      const res = yield call(serv.addAddress, payload);
      if (res) {
        return res.success;
      } else {
        return false;
      }
    },
    *updateAddress({ payload }, { put, call }) {
      const res = yield call(serv.updateAddress, payload);
      if (res) {
        return res.success;
      } else {
        return false;
      }
    },
    *updateDefaultAddress({ payload }, { put, call }) {
      const res = yield call(serv.updateDefaultAddress, payload);
      if (res) {
        return res.success;
      } else {
        return false;
      }
    },
    *addAddress({ payload }, { put, call }) {
      try {
        yield call(serv.addAddress, payload);
        yield put({
          type: 'pullAddress',
          payload,
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            isGettingAddr: false,
            address: {},
          },
        });
        // 请求充值地址，失败埋点
        // 请求充值地址，成功埋点
        track('depositAddressRequst_results', {
          is_success: false,
          fail_reason: e?.msg,
          fail_code: e?.code,
          coin: payload?.currency,
          chain: payload?.chainId,
          is_memo: false,
          channel: 'JS',
        });
      }
    },
    *getDepositHotCurrency({ payload }, { put, call }) {
      const { data } = yield call(serv.getDepositHotCurrency, payload);
      yield put({
        type: 'update',
        payload: {
          hotCurrencies: data || [],
        },
      });
    },
    *addSearchRecord({ payload }, { put, call }) {
      try {
        const { data } = yield call(serv.addSearchRecord, payload);
        yield put({
          type: 'getSearchRecord',
          payload: {
            type: 'DEPOSIT',
          },
        });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *delSearchRecord({ payload }, { call }) {
      try {
        const { data } = yield call(serv.delSearchRecord, payload);
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *getSearchRecord({ payload }, { put, call }) {
      const { data } = yield call(serv.getSearchRecord, payload);
      yield put({
        type: 'update',
        payload: {
          searchRecords: data || [],
        },
      });
    },
    // 查询该币种指定时间的最新充币记录(时间范围：3个月),用于获取指定币种最近使用的币链
    *getLastUseChain({ payload: { coin } }, { put, call }) {
      if (!coin) return;
      try {
        const startAt = moment().subtract(3, 'months').valueOf();
        const endAt = moment().valueOf();
        const { items } = yield call(serv.getDepositList, {
          currency: coin,
          currentPage: 1,
          pageSize: 10,
          startAt,
          endAt,
        });
        yield put({
          type: 'update',
          payload: {
            lastChain: items || [],
          },
        });
      } catch (e) {
        console.error(e);
        yield put({
          type: 'update',
          payload: {
            lastChain: [],
          },
        });
      }
    },
    // 获取风控指纹
    *getFingerprint(_, { call }) {
      const token = yield call(Report.logFingerprint);
      if (token) {
        return token;
      }
      return null;
    },
    // 生成闪电网络发票
    *generateLightningInvoice({ payload }, { call }) {
      const { data = {}, success } = yield call(serv.addLightningInvoice, payload);
      if (success) {
        return pick(data, ['invoice', 'startTimestamp', 'endTimestamp']);
      }
    },
    *getDepositFreeFee(_, { put, call, select }) {
      const { coin, chainId } = yield select((state) => state.coinin.filters);
      const { language = '' } = yield select((state) => state?.user?.user || {});
      try {
        const { data } = yield call(serv.getDepositFreeFee, {
          currency: coin,
          chainId,
        });

        yield put({
          type: 'update',
          payload: {
            depositFreeFee: data,
            isQueriedFreeQuota: true,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            isQueriedFreeQuota: true,
          },
        });

        console.error(e);
      }
    },
  },
  reducers: {
    resetDepositFreeFee(state) {
      return {
        ...state,
        depositFreeFee: null, // 充值免费额度
        isQueriedFreeQuota: undefined,
      };
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'pullRecords', interval: 10 * 1000 },
      });
    },
  },
});
