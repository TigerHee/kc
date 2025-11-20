/**
 * Owner: borden@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { pathToRegexp } from 'path-to-regexp';
import {
  MARGIN_TRADE_TYPE,
  MARGIN_TYPE_FOR_STORAGE,
  TRADE_TYPES_CONFIG,
  TYPE_FOR_STORAGE,
} from 'utils/hooks/useTradeTypes';
import storage from 'utils/storage.js';
// import { ocoValidation, tsoValidation } from 'services/trade.js';
import { FUTURES, ISOLATED, MARGIN, SPOT } from '@/meta/const';
import { isDisplayMargin } from '@/meta/multiTenantSetting';
import { TRADEMODE_META } from '@/meta/tradeTypes';
import { getSymbolAuctionInfo } from '@/utils/business';
import { createPathByLocation } from 'Bot/config';
import { routerRedux } from 'dva/router';
import { concatPath } from 'helper';
import { isABNew, isFuturesNew } from 'src/trade4.0/meta/const';

const { setItem, getItem } = storage;

export default extend(base, {
  namespace: 'trade',
  state: {
    ocoEnable: true, // 当前做灰度控制 判断该地区用户是否展示
    tsoEnable: true, // 跟踪委托
    currentSymbol: '', // 增加初始化值
    activeKey: 'markets',
    tradeType: 'TRADE', // 现货交易--TRADE / 杠杆交易--MARGIN_TRADE / 网格交易 -- GRID
    tradeMode: 'MANUAL', // 手动交易 manual, 策略交易 bottrade
    autoBorrowConfirmModalOpen: false,
    tradeTypes: [
      TRADE_TYPES_CONFIG.TRADE.key,
      ...(isDisplayMargin() && isABNew() ? [TRADE_TYPES_CONFIG.MARGIN_TRADE.key] : []),
      ...(isDisplayMargin() && isABNew() ? [TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key] : []),
      ...(isFuturesNew() && isABNew() ? [TRADE_TYPES_CONFIG.FUTURES.key] : []),
    ],
  },
  reducers: {
    _modifyCurrentSymbol(state, { payload: { currentSymbol = '', isMargin = false } }) {
      console.log('set current symbol, ', currentSymbol);
      setItem('trade_current_symbol', currentSymbol);
      return {
        ...state,
        currentSymbol,
      };
    },
  },
  effects: {
    // 增加路由切换
    *modifyCurrentSymbol({ payload }, { put, select }) {
      const { currentSymbol = '', tradeType } = payload;
      setItem('trade_current_symbol', currentSymbol);

      // yield put({
      //   type: '_modifyCurrentSymbol',
      //   payload,
      // });
      let _tradeType = tradeType;
      if (tradeType !== FUTURES) {
        const { tradeTypeCurrent, symbolInfo, auctionWhiteAllowList, auctionWhiteAllowStatusMap } =
          yield select(({ trade, symbols, callAuction }) => {
            return {
              tradeTypeCurrent: trade.tradeType,
              symbolInfo: symbols?.symbolsMap?.[currentSymbol],
              marginInfo: symbols?.marginSymbolsMap?.[currentSymbol],
              auctionWhiteAllowList: callAuction?.auctionWhiteAllowList,
              auctionWhiteAllowStatusMap: callAuction?.auctionWhiteAllowStatusMap,
            };
          });
        let _tradeTypeCurrent = tradeTypeCurrent;
        // 由合约切到现货时触发
        if (tradeTypeCurrent === FUTURES) {
          _tradeTypeCurrent = SPOT;
        }
        // 判断当前币对是否显示集合竞价
        const { showAuction } = getSymbolAuctionInfo(
          symbolInfo,
          auctionWhiteAllowList,
          auctionWhiteAllowStatusMap,
        );
        const tradeKey = TRADE_TYPES_CONFIG.TRADE.key;
        // 显示集合竞价则切换到币币
        _tradeType = showAuction ? tradeKey : tradeType || _tradeTypeCurrent;
      }
      let typePath = TRADE_TYPES_CONFIG[_tradeType] ? TRADE_TYPES_CONFIG[_tradeType].path : '';

      const tradeMode = yield select((state) => state.trade.tradeMode);
      // 需要校验的 tradeType
      const needCheck = [SPOT, FUTURES];
      // 策略模式
      if (tradeMode === TRADEMODE_META.keys.BOTTRADE) {
        // 杠杠取值
        const { marginInfo } = yield select(({ trade, symbols }) => {
          return {
            marginInfo: symbols?.marginSymbolsMap?.[currentSymbol] || {},
          };
        });
        // 杠杠交易类型比对
        if (_tradeType === ISOLATED) {
          if (marginInfo.isIsolatedEnabled) {
            _tradeType = ISOLATED;
            // 全仓可用
          } else if (marginInfo.isMarginEnabled) {
            _tradeType = MARGIN;
          } else {
            _tradeType = SPOT;
          }
        } else if (_tradeType === MARGIN) {
          // 逐仓可用
          if (marginInfo.isMarginEnabled) {
            _tradeType = MARGIN;
            // 全仓可用
          } else if (marginInfo.isIsolatedEnabled) {
            _tradeType = ISOLATED;
          } else {
            _tradeType = SPOT;
          }
        }
        setItem(TYPE_FOR_STORAGE, _tradeType);
        typePath = createPathByLocation(window.location);

        const currentTradeType = yield select((state) => state.trade.tradeType);
        // 现货跟合约需要判断传进来的值跟当前值是否会出现不一致的情况
        // TIPS: 防止直接输入策略交易地址出现tradeType 无法更新的情况

        // console.time('update tradeType');
        if (
          needCheck.includes(tradeType) &&
          currentTradeType &&
          tradeType !== currentTradeType &&
          !MARGIN_TRADE_TYPE[currentTradeType]
        ) {
          yield put({
            type: 'update',
            payload: {
              tradeType,
            },
          });
        }
      }
      // console.timeEnd('update tradeType');

      // console.time('routerRedux.replace');
      // 切换交易对保留原本地址里的search参数
      const symbolRoute = `/${currentSymbol || 'BTC-USDT'}${window.location.search}`;
      const nextRoute = concatPath(typePath, symbolRoute);
      yield put(routerRedux.replace(nextRoute));
      // console.timeEnd('routerRedux.replace');
    },
    // 更新交易类型(杠杆/现货/网格)
    *update_trade_type({ payload }, { put, select }) {
      const { tradeType } = payload;
      setItem(TYPE_FOR_STORAGE, tradeType);
      // 保存上次杠杆是全仓还是逐仓，在模糊初始化的时候，优先切换
      if (MARGIN_TRADE_TYPE[tradeType]) {
        setItem(MARGIN_TYPE_FOR_STORAGE, tradeType);
      }
      const tradeMode = yield select((state) => state.trade.tradeMode);
      if (tradeMode === TRADEMODE_META.keys.MANUAL) {
        // 手动模式下,如果交易类型和路由不一样
        const pathRe = pathToRegexp('/(.*)?/trade/:type/(.*)?');
        const execResult = pathRe.exec(window.location.pathname);
        const tradeTypes = Object.values(TRADE_TYPES_CONFIG).map((item) => item);
        const typePaths = tradeTypes.map((item) => item.path);
        let typeFromUrl = 'TRADE';
        let tradeSyboms = execResult ? `/${execResult[2]}` : '';
        if (execResult && execResult[2] && typePaths.includes(`/${execResult[2]}`)) {
          const tradeObj = tradeTypes.find((item) => item.path === `/${execResult[2]}`);
          typeFromUrl = tradeObj.key;
          tradeSyboms = `/${execResult[3]}`;
        }
        if (tradeType !== typeFromUrl) {
          const url = concatPath(`${TRADE_TYPES_CONFIG[tradeType].path}`, `${tradeSyboms}`);
          yield put(routerRedux.replace(url));
        }
      }

      // 更新网格中的模式字段
      // yield put({
      //   type: 'grid/updateMode',
      //   payload,
      // });
      yield put({
        type: 'update',
        payload,
      });
    },
    // 获取是否支持OCO模式
    *ocoValidation(_, { put }) {
      // 去掉OCO/跟踪委托的是否支持的检测逻辑(https://k-devdoc.atlassian.net/browse/KCMG-14160)
      // const res = yield call(ocoValidation);
      yield put({
        type: 'update',
        payload: {
          // ocoEnable: res?.data?.open || false,
          ocoEnable: true,
        },
      });
    },
    // 获取是否支持跟踪委托模式
    *tsoValidation({ payload }, { call, put }) {
      const show = payload?.show;
      if (!show) {
        yield put({
          type: 'update',
          payload: {
            tsoEnable: false,
          },
        });
        return;
      }
      // 去掉OCO/跟踪委托的是否支持的检测逻辑(https://k-devdoc.atlassian.net/browse/KCMG-14160)
      // const res = yield call(tsoValidation);
      // const tsoEnable = !!res?.data?.open;
      const tsoEnable = true;
      yield put({
        type: 'update',
        payload: {
          tsoEnable,
        },
      });
    },
  },
});
