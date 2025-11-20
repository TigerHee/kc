/**
 * Owner: garuda@kupotech.com
 * 存放计算的值
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { delay } from 'dva/saga';
import { forIn } from 'lodash';
import { greaterThan } from 'utils/operation';

import { ABC_ORDER_STATISTICS } from '@/components/AbnormalBack/constant';
import { futuresCalcControl } from '@/pages/Futures/components/SocketDataFormulaCalc/utils';
import { getCrossCalcData } from '@/services/futures';
import { formatCurrency } from '@/utils/futures/formatCurrency';


// 重试中变量
let isRepeating = false;

export default extend(base, {
  namespace: 'futures_calc_data',
  state: {
    positionCalcData: {}, // 仓位的计算值
    crossRiskRate: {},
    orderSizeMap: {}, // size symbol维度
    orderMarginMap: {}, // 订单
    isolatedOrderMarginMap: {}, // 币种维度
    orderSymbolMap: {}, // 订单 symbol map

    posOrderMarginCurrency: {}, //
    posOrderMarginSymbol: {},
  },
  reducers: {},
  effects: {
    *getCrossOrderCalcData({ payload }, { call, put, select }) {
      // 重试中判断，且 新调用 return
      if (isRepeating && payload.repeatTimes === undefined) {
        console.log('=====posOrderQty new call forbidden');
        return;
      }
      try {
        const { isAll, symbols: _symbols } = payload;
        const params = {
          symbols: isAll ? '' : _symbols.join(),
        };
        const { data } = yield call(getCrossCalcData, params);
        console.log('=====posOrderQty call success');
        isRepeating = false;
        const orderSymbolMap = yield select((state) => state.futures_calc_data.orderSymbolMap);
        const orderSizeMap = yield select((state) => state.futures_calc_data.orderSizeMap);
        const orderMarginMap = yield select((state) => state.futures_calc_data.orderMarginMap);
        const isolatedOrderMarginMap = yield select(
          (state) => state.futures_calc_data.isolatedOrderMarginMap,
        );
        const { symbols, currencies } = data || {};
        const updateOrderSymbolMap = { ...orderSymbolMap };

        forIn(symbols, ({ askOrderCost, bidOrderSize, bidOrderCost, askOrderSize }, itemSymbol) => {
          // 数量
          orderSizeMap[`${itemSymbol}-sell`] = askOrderSize;
          orderSizeMap[`${itemSymbol}-buy`] = bidOrderSize;

          // 占用保证金
          orderMarginMap[`${itemSymbol}-sell`] = askOrderCost;
          orderMarginMap[`${itemSymbol}-buy`] = bidOrderCost;

          if (greaterThan(askOrderSize)(0) || greaterThan(bidOrderSize)(0)) {
            updateOrderSymbolMap[itemSymbol] = 1;
          }
        });
        // 逐仓占用保证金，币种维度
        forIn(currencies, ({ isolatedOrderCost }, currency) => {
          isolatedOrderMarginMap[formatCurrency(currency)] = isolatedOrderCost;
        });
        // update
        yield put({
          type: 'update',
          payload: {
            orderMap: symbols || {},
            marginMap: currencies || {},
            orderSymbolMap: updateOrderSymbolMap,
            orderSizeMap: { ...orderSizeMap },
            orderMarginMap: { ...orderMarginMap },
            isolatedOrderMarginMap: { ...isolatedOrderMarginMap },
          },
        });
        // 触发解锁
        futuresCalcControl.unlockUpdate();
        // 触发一次计算
        futuresCalcControl.triggerCalc();
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_ORDER_STATISTICS,
            status: true,
            locationId: '6',
          },
        });
      } catch (e) {
        isRepeating = true;
        yield call(delay, 1000);
        const { repeatTimes = 0 } = payload;
        if (payload.repeatTimes === 2) {
          console.error('get order calc fail', e);
          console.log('=====posOrderQty repeat fail');
          isRepeating = false;
        } else {
          console.error(`get order calc fail, repeat times ${repeatTimes + 1}`);
          payload.repeatTimes = repeatTimes + 1;
          yield put({
            type: 'getCrossOrderCalcData',
            payload,
          });
        }
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_ORDER_STATISTICS,
            status: false,
            locationId: '6',
            error: e,
          },
        });
        throw e;
      }
    },
  },
  subscriptions: {},
});
