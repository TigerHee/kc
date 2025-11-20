/**
 * Owner: borden@kupotech.com
 */
import { map } from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { TRADE_TYPES_CONFIG } from 'utils/hooks/useTradeTypes';

export default extend(base, {
  namespace: 'transfer',
  state: {
    transferConfig: {
      visible: false,
      initDict: [],
      initCurrency: '',
    },
    transferBalance: undefined,
    isSupportBatch: false,
    allSubAccount: [],
    isolatedSymbols: [], // 支持逐仓杠杆的交易对，排序后的
    batchLendConfigMap: {},
  },
  effects: {
    *updateTransferConfig({ payload = {} }, { put, select }) {
      const { initCurrency, visible, ...otherPayload } = payload;
      const { currentSymbol, tradeType } = yield select(state => state.trade);
      const { transferConfig } = yield select(state => state.transfer);
      const quote = `${currentSymbol}`.split('-')[1];
      const { initDict: nextInitDict } = TRADE_TYPES_CONFIG[tradeType] || {};
      const initCurrencyVisible = visible ? initCurrency || quote : '';
      yield put({
        type: 'update',
        payload: {
          transferConfig: {
            ...transferConfig,
            initCurrency: initCurrencyVisible,
            visible,
            ...nextInitDict ? { initDict: nextInitDict(currentSymbol) } : null,
            ...otherPayload,
          },
        },
      });
    },
  },
  reducers: {
    updateIsolatedSymbols(state, { payload }) {
      return {
        ...state,
        isolatedSymbols: map(payload, ({ symbol, symbolName, ...other }) => {
          return {
            symbol,
            value: symbol,
            label: symbolName.replace('-', '/'),
            ...other,
          };
        }),
      };
    },
  },
});
