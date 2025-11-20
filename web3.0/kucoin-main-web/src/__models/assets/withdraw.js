/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import { some, map } from 'lodash';
import base from 'common/models/base';
import mulPagination from 'common/models/mulPagination';
import filter from 'common/models/filter';
import polling from 'common/models/polling';
import { _t } from 'tools/i18n';
import { track } from 'utils/ga';
import * as serv from 'services/withdraw';
import {
  addSearchRecord as addSearch,
  delSearchRecord as delSearch,
  getSearchRecord as getSearch,
  assetGrayReleased,
  getAssetsChainInfo,
  validInvoice,
} from 'services/assets';
import { checkIfBelongFlash } from 'services/order';
import { getDepositTips as getWithDrawTip } from 'services/currency';
import { Decimal, filterChainInfo, sleep } from 'helper';
import userSubScription from './userSubScription';
// 延时
// const sleep = (delay) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, delay);
//   });
// };

export const getActId = (
  favoriteAddressId,
  curSelectAddr,
  favList,
  { address, chainId, currency, memo } = {},
) => {
  if (!curSelectAddr || !favoriteAddressId) return favoriteAddressId;
  if (
    !some(favList, (item) => {
      return item.id === curSelectAddr.id;
    })
  )
    return favoriteAddressId;
  if (favoriteAddressId === curSelectAddr.id) return favoriteAddressId;
  let currencyPass = true;
  if (currency && curSelectAddr.currency) {
    if (currency !== curSelectAddr.currency) currencyPass = false;
  }
  let memoPass = true;
  if (memo && curSelectAddr.memo) {
    if (memo !== curSelectAddr.memo) memoPass = false;
  }
  const withRecord =
    address === curSelectAddr.address &&
    chainId === curSelectAddr.chainId &&
    currencyPass &&
    memoPass;
  return withRecord ? curSelectAddr.id : favoriteAddressId;
};

const setNumToPrecision = (num, pre) => {
  if (num === undefined || num === null || Number.isNaN(num) || num === '') {
    return num;
  }
  return new Decimal(num).toFixed(pre);
};

export default extend(base, mulPagination, filter, polling, userSubScription, {
  namespace: 'withdraw',
  state: {
    withdrawForm: {
      isInnerAddr: false,
      coin: undefined,
      chainId: '',
      chainName: '',
    },
    modalStatus: {},
    addrSaveForm: {},

    withdrawLogList: {
      // 提币记录
      pagination: null,
      records: [],
    },
    recentCoins: [], // 最近提现的币种

    accountInfo: {
      // 储蓄账户：用户当前币种可以提币的数量限制信息
      availableBalance: 0,
      holdBalance: 0,
      totalBalance: 0,
    },
    accountTradeInfo: {
      // 币币账户：用户当前币种可以提币的数量限制信息
      availableBalance: 0,
      holdBalance: 0,
      totalBalance: 0,
    },
    // 默认提现的账户
    selectedAccount: ['MAIN'],

    userQuota: {
      remainAmount: 0,
      limitAmount: 0,
    },
    userQuotaList: [],

    uWalletAddrs: [],

    frozonTime: -2, // 是否冻结不能提币， -2， 未冻结
    currenciesWithIcon: [],

    chainInfo: [], // 链路信息,
    preTips: {}, // 提示配置信息,
    userPosition: {},
    expireAfter: -2, // 提现倒计时
    withdrawInfoType: '', // 提币检测信息, 有数据则
    searchRecords: [], // 用户提币，币种选择记录
    innerWthDrawEnable: undefined, // 是否开启站内转账
    simpleQuota: null, // 提币限额配置 用于kyc拦截
    belongFlash: false, // check 资产提现to币种是否支持闪兑
    canSkipWithDrawCheck: false, //  用户是否 点击了  推荐任务 skip 按钮
    receivedMode: false, // 到账至状态，切换到这个状态后，infoConfirm和apply传入receivedAmount去发起提现流程，同时，手续费、到账数量的展示依赖后端接口的返回值。
    receivedModeInfo: {}, // 后端计算的手续费、反算金额等数据对象
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
    *resetChainInfo({ payload: { clearForm } = {} }, { put }) {
      yield put({
        type: 'update',
        payload: {
          chainInfo: [],
        },
      });
      if (clearForm) {
        yield put({
          type: 'deepSave',
          payload: {
            chainId: '',
            chainName: '',
          },
          propsKey: 'withdrawForm',
        });
      }
    },
    // 切换modal 的状态
    *switchModal({ payload }, { put }) {
      yield put({
        type: 'deepSave',
        payload,
        propsKey: 'modalStatus',
      });
    },
    *addrSave({ payload }, { put }) {
      yield put({
        type: 'deepSave',
        payload,
        propsKey: 'addrSaveForm',
      });
    },

    // 获取近期提现的币种，用于快捷操作
    *getRecentWithdrawCoins(action, { put, call }) {
      const result = yield call(serv.getRecentWithdrawCoins);
      const _data = [...(result.data || [])].filter((v) => v.currency !== 'DEGO');
      _data.push({
        currency: 'DEGO',
        currencyName: 'DEGO',
      });
      yield put({
        type: 'update',
        payload: {
          recentCoins: _data,
        },
      });
    },

    // 获取提币记录
    *getWithdrawLog({ payload = {} }, { select, call, put }) {
      let coin = yield select((state) => state.withdraw.withdrawForm.coin);
      const { pagination = {}, currency } = payload;
      if (currency) {
        coin = currency;
      }
      const result = yield call(serv.getWithdrawList, {
        currency: coin,
        pageNum: (pagination || {}).current,
        pageSize: (pagination || {}).pageSize,
      });
      yield put({
        type: 'savePage',
        payload: result,
        listName: 'withdrawLogList',
      });
    },

    // 获取用户可提币数量，冻结数量
    // 新增查询储蓄、币币账户对应余额
    *getAccountCoinInfo({ payload }, { call, put, all, select }) {
      const preAccountList = yield select((state) => state.withdraw.selectedAccount);
      const { coin } = payload;
      const updateSelect = payload.updateSelect;
      const refreshQuota = payload.refreshQuota;
      const [{ data: accountInfo } = {}, { data: accountTradeInfo } = {}] = yield all([
        call(serv.getAccountCoinInfo, {
          accountType: 'MAIN',
          currency: coin,
        }),
        call(serv.getAccountCoinInfo, {
          accountType: 'TRADE',
          currency: coin,
        }),
      ]);
      const newAccountList = ['MAIN'];
      yield put({
        type: 'update',
        payload: {
          accountInfo,
          accountTradeInfo,
          selectedAccount: updateSelect ? newAccountList : preAccountList,
        },
      });
      // 查询提现配额参数
      if (refreshQuota === undefined || refreshQuota === true) {
        yield put({
          type: 'getQuota',
          payload,
        });
      }
    },
    // 获取用户针对单链的体现配额
    *getQuota({ payload }, { call, put, select }) {
      try {
        const { chainId: _chainId } = yield select((state) => state.withdraw.withdrawForm);
        const { coin: currency, chainId = '' } = payload;
        const userQuotaResult = yield call(serv.getUserQuota, {
          currency,
          chainId: chainId || _chainId,
        });
        yield put({
          type: 'update',
          payload: {
            userQuota: userQuotaResult.data,
          },
        });
      } catch (e) {
        // 获取用户提现配额失败，默认关闭提现
        yield put({
          type: 'update',
          payload: {
            userQuota: {
              isWithdrawEnabled: false,
            },
          },
        });
      }
    },
    // 获取用户提现限额
    *getSimpleQuota({ payload }, { call, put }) {
      try {
        const { success, data } = yield call(serv.getSimpleQuota);
        if (success) {
          yield put({
            type: 'update',
            payload: {
              simpleQuota: data || {},
            },
          });
          return data || {};
        }
        return {};
      } catch (e) {
        return {};
      }
    },
    *withdrawCoin({ payload, message }, { call, select, put }) {
      const {
        isFavoriteAddress,
        favoriteAddressId,
        pre,
        securityId,
        verificationCode,
        accountTypeList,
        curSelectAddr,
        favList,
        isLightning = false,
        receivedMode,
        receivedModeInfo,
      } = payload;
      const { withdrawForm } = yield select((state) => state.withdraw);
      const {
        address,
        amount = 0,
        coin,
        isInner,
        number,
        remark,
        memo = '',
        // confirmedAmount = 0,
        chainId,
        imgWidth = 800,
      } = withdrawForm;
      // const _addr = memo ? `${address}&${memo}` : address;
      const _favoriteAddressId = getActId(favoriteAddressId, curSelectAddr, favList, {
        address,
        chainId,
        currency: coin,
        memo,
      });
      try {
        const withdrawCoin = isLightning ? serv.withdrawCoinByInvoice : serv.withdrawCoin;
        const params = {
          address,
          memo,
          currency: coin,
          isInner: !!isInner,
          number,
          remark,
          isFavoriteAddress,
          favoriteAddressId: _favoriteAddressId,
          securityId,
          verificationCode,
          width: imgWidth,
          chainId,
          accountTypeList,
          feeDeductType: 'INTERNAL',
        };
        if (receivedMode) {
          params.receivedAmount = setNumToPrecision(receivedModeInfo?.receivedAmount, pre);
        } else {
          params.amount = setNumToPrecision(amount, pre);
        }
        const result = yield call(withdrawCoin, params);
        if (result && result.code === '200') {
          if (typeof message?.success === 'function') {
            message.success(_t('withdraw.v2.apply.success'));
          }
          yield put({
            type: 'update',
            payload: {
              withdrawForm: {
                coin,
                chainId,
              },
            },
          });
          yield sleep(500); // 延迟请求时机 防止记录接口没取到最新的提现记录
          yield put({ type: 'getWithdrawLog', payload: { currency: coin } });
          yield put({
            type: 'getAccountCoinInfo',
            payload: {
              coin,
              isInner,
            },
          });
          // 提现发起成功-埋点
          track('withdrawRequest_results', {
            is_success: true,
            fail_reason: '',
            coin,
            chain: chainId,
            is_memo: !!memo,
            channel: 'JS',
            is_usualAddress: isFavoriteAddress,
            withdrawTo: 'address',
            is_usualContact: false,
          });
        } else {
          // 提现发起失败-埋点
          track('withdrawRequest_results', {
            is_success: false,
            fail_reason: result?.msg,
            fail_code: result?.code,
            coin,
            chain: chainId,
            is_memo: !!memo,
            channel: 'JS',
            is_usualAddress: isFavoriteAddress,
            withdrawTo: 'address',
            is_usualContact: false,
          });
        }
        return result;
      } catch (e) {
        // 提现发起失败-埋点
        track('withdrawRequest_results', {
          is_success: false,
          fail_reason: e?.msg,
          fail_code: e?.code,
          coin,
          chain: chainId,
          is_memo: !!memo,
          channel: 'JS',
          is_usualAddress: isFavoriteAddress,
          withdrawTo: 'address',
          is_usualContact: false,
        });
        return e;
      }
    },

    *getChainInfo({ payload: { coin } }, { call, put, select }) {
      const { coin: currency } = yield select((state) => state.withdraw.withdrawForm);
      const _coin = coin || currency;
      // 获取提示配置
      yield put({
        type: 'getTipConfig',
        payload: { coin: _coin },
      });
      // 获取提现配额List
      yield put({
        type: 'getUserQuotaList',
        payload: {
          currency: _coin,
        },
      });
      // 获取用户订阅数据
      yield put({
        type: 'pullSubScriptionList',
        payload: {
          category: 'chainSubscriptionList',
          currency: _coin,
          type: 'WITHDRAW',
          subscriptionObjectType: 'CURRENCY_CHAIN',
        },
      });
      // 请求链信息chainInfo
      try {
        const { data } = yield call(getAssetsChainInfo, { currency: _coin });
        if (data && data.length > 0) {
          const chainInfo = filterChainInfo(data);
          yield put({
            type: 'update',
            payload: {
              chainInfo,
            },
          });
        } else {
          yield put({ type: 'resetChainInfo' });
        }
      } catch (e) {
        yield put({ type: 'resetChainInfo' });
      }
    },
    *getTipConfig({ payload: { coin } }, { call, put }) {
      try {
        const { data: tipsConfig } = yield call(getWithDrawTip, {
          currency: coin,
          type: 'WITHDRAW',
          domainId: 'kucoin',
        });
        yield put({
          type: 'update',
          payload: {
            preTips: {
              tips: tipsConfig,
              currency: coin,
            },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            preTips: {
              tips: null,
              currency: coin,
            },
          },
        });
      }
    },
    // 获取用户常用地址
    *getWalletAddr({ payload }, { call, put }) {
      const { coin } = payload;
      const result = yield call(serv.getFavAddr, coin);
      const uWalletAddrs = result.data;

      yield put({
        type: 'update',
        payload: {
          // uWalletAddrs: result.data,
          uWalletAddrs,
        },
      });
    },
    *addWalletAddr({ payload, fromManage = false, fromwithdraw = false }, { call, put, select }) {
      const { wallets, coin, type } = payload;
      const { withdrawForm } = yield select((state) => state.withdraw);
      const { coin: pageCurrency } = withdrawForm || {};
      const res = yield call(serv.addWalletAddr, wallets, coin, type);
      const currency = coin || pageCurrency;
      if (currency && !fromManage) {
        yield put({
          type: 'getWalletAddr',
          payload: {
            coin: currency,
          },
        });
      }
      // 新增常用提现列表成功后，关闭新增弹窗，返回地址列表
      if (!fromManage) {
        yield put({
          type: 'switchModal',
          payload: {
            modalAdd: true,
            modalAddAddr: false,
          },
        });
      }
      if (res) {
        track('usualRecieverAdd_results', {
          is_success: res.success,
          reciever_type: 'address',
          fail_reason: res.msg,
          coin: wallets?.length > 1 ? 'list' : currency,
          chain: wallets?.length > 1 ? 'list' : wallets[0].chainId,
          is_memo: map(wallets, (w) => !!w.memo).toString(),
          channel: 'JS',
          is_universal: type === 'UNIVERSAL',
          fromwithdraw: fromwithdraw,
          is_batch: wallets?.length > 1,
        });
      }
    },

    // 删除钱包地址
    *removeAddr({ payload }, { call, put, select }) {
      const { id } = payload;
      const { uWalletAddrs } = yield select((state) => state.withdraw);

      yield call(serv.removeWalletAddr, id);
      const newWallets = uWalletAddrs.filter((addr) => addr.id !== id);
      yield put({
        type: 'update',
        payload: {
          uWalletAddrs: newWallets,
        },
      });
    },

    *cancelWithdraw({ payload }, { call, put, select }) {
      const { withdrawId } = payload;
      const { withdrawForm } = yield select((state) => state.withdraw);
      yield call(serv.cancelWithdraw, { withdrawId });
      yield put({
        type: 'getWithdrawLog',
        payload: {
          coin: withdrawForm.coin,
        },
      });
    },
    *getWithdrawInfo({ payload }, { put, call }) {
      const { data } = yield call(serv.getWithdrawInfo, payload);
      return data;
    },

    // 检测能否提币, 加入callback，在otc上架广告时使用
    *checkIfCanWithdraw({ callback }, { call, put }) {
      const result = yield call(serv.getWithdrawFrozonTime);
      const { code, data } = result;
      if (code === '200') {
        const isBanned = data !== -2;
        yield put({
          type: 'update',
          payload: {
            frozonTime: data,
            // frozonTime: Date.now(),
          },
        });
        if (typeof callback === 'function') {
          callback(isBanned);
        }
      }
      return result;
    },

    /**
     * 检测钱包地址（是否是站内地址，是否有效）
     * @param {*} param0
     * @param {*} param1
     */
    *checkIfInnerAddr({ payload, withV3 = false }, { call, put }) {
      const api = withV3 ? serv.checkIfInnerAddrV3 : serv.checkIfInnerAddr;
      const result = yield call(api, payload);
      // yield sleep(100000);
      if (result && result.code === '200') {
        yield put({
          type: 'deepSave',
          payload: {
            isInner: false,
          },
          propsKey: 'modalStatus',
        });
      }
      return result.data;
    },
    *checkUniversalAddr({ payload }, { call }) {
      const result = yield call(serv.checkUniversalAddr, payload);
      return result?.data;
    },
    *withdrawPolling(action, { fork, put }) {
      // const { withdrawForm } = yield select(state => state.withdraw);
      // const { coin, isInner } = withdrawForm;
      console.log('run polling');
      yield fork(put, { type: 'getWithdrawLog' });
      // yield fork(put, { type: 'getAccountCoinInfo',
      //   payload: {
      //     coin, isInner,
      //   } });
    },

    *getAccountDiscount({ payload }, { call }) {
      const { address, memo, currency } = payload;
      let discount = 1;
      try {
        const { data } = yield call(serv.getWithdrawDiscount, {
          address,
          memo,
          currency,
        });
        discount = data.feeDiscount === null ? 1 : +data.feeDiscount;
      } catch (e) {
        discount = 1;
      }
      return discount;
    },

    *getSafeImg({ payload }, { call }) {
      const { address, amount, memo, currency } = payload;
      const { success, data } = yield call(serv.getSafeImg, {
        address,
        amount,
        memo,
        currency,
      });
      if (!success) return;
      return data;
    },
    *getUserMarginPostion(action, { call, put }) {
      const { data = {} } = yield call(serv.getUserMarginPostion);
      yield put({
        type: 'update',
        payload: {
          userPosition: data,
        },
      });
    },
    // 新注册用户提币风控提示
    *getWithdrawToast({ callback }, { call, put }) {
      const { data } = yield call(serv.getWithdrawToast);
      if (callback) {
        callback(data[0].channel);
      }
      yield put({
        type: 'update',
        payload: {
          withdrawInfoType: data && data[0] && data[0].channel,
          expireAfter: data && data[0] && data[0].expireAfter,
        },
      });
      return data && data[0];
    },
    *addSearchRecord({ payload }, { put, call }) {
      try {
        const { data } = yield call(addSearch, payload);
        yield put({
          type: 'getSearchRecord',
          payload: {
            type: 'WITHDRAW',
          },
        });
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *delSearchRecord({ payload }, { call }) {
      try {
        const { data } = yield call(delSearch, payload);
        return data;
      } catch (e) {
        console.error(e);
      }
    },
    *getSearchRecord({ payload }, { put, call }) {
      const { data } = yield call(getSearch, payload);
      yield put({
        type: 'update',
        payload: {
          searchRecords: data || [],
        },
      });
    },
    *getUserQuotaList({ payload }, { put, call }) {
      try {
        const { data } = yield call(serv.getUserQuotaList, payload);
        yield put({
          type: 'update',
          payload: {
            userQuotaList: data || [],
          },
        });
      } catch (e) {
        console.error(e);
        yield put({
          type: 'update',
          payload: {
            userQuotaList: [],
          },
        });
      }
    },
    // 灰度接口获取相关开关控制
    *getGrayReleased({ payload = {}, check = true }, { call, put, select }) {
      const { functionCode, functionField } = payload || {};
      if (!functionCode || !functionField) return;
      const isOpen = yield select((state) => {
        const withdrawState = state.withdraw;
        return withdrawState[functionField];
      });
      // 已经加载过，则不进行请求
      if (isOpen !== undefined && check) return;
      try {
        const { data } = yield call(assetGrayReleased, {
          function: functionCode,
          functionPlatform: 'WEB',
        });
        yield put({
          type: 'update',
          payload: {
            [functionField]: !!data,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            [functionField]: false,
          },
        });
      }
    },
    *getConfirmPrompt({ payload = {} }, { call }) {
      try {
        const { success, data } = yield call(serv.getConfirmPrompt, payload);
        if (!success) return;
        // 上报
        const { type, currency, chainId = '', memo = '' } = payload;
        const { id, imgData, phrases = [] } = data;
        track('withdrawDoubleCheck', {
          withdrawTo: type === 'ADDRESS' ? 'address' : 'contact',
          is_stop: `${some(phrases, (i) => i.block)}`,
          coin: currency,
          chain: chainId,
          is_memo: !!memo,
          channel: 'JS',
          confirmWindow: id && imgData?.length > 0 ? 'tamper' : 'new',
        });
        return data;
      } catch (e) {
        console.log('error', e);
      }
    },
    // 提币页面 用户点击加号，调用闪兑业务接口，是否属于闪兑to币种
    *checkIfBelongFlash({ payload = {} }, { call, put }) {
      const { success, data } = yield call(checkIfBelongFlash, payload);
      yield put({
        type: 'update',
        payload: {
          belongFlash: data || false,
        },
      });
    },
    // 验证闪电网络发票
    *validLightningInvoice({ payload }, { call }) {
      try {
        const { data = {} } = yield call(validInvoice, payload);
        return data;
      } catch (e) {
        return {
          errMsg: e.msg,
        };
      }
    },
    // 获取反算后的金额等
    *getFeeAndAmount({ payload }, { call, put }) {
      // try {
      const { data = {} } = yield call(serv.getFeeAndAmount, payload);
      yield put({
        type: 'update',
        payload: {
          receivedModeInfo: data,
        },
      });
      return data;
      // }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatch({
        type: 'watchPolling',
        payload: { effect: 'withdrawPolling', interval: 30 * 1000 },
      });
      dispatch({
        type: 'getUserMarginPostion',
      });
    },
  },
});
