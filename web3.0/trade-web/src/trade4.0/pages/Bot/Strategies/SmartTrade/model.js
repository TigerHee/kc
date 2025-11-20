/**
 * Owner: mike@kupotech.com
 */
import modelBase from 'Bot/utils/modelBase';
import { toSplitCase, times100, floatToPercent } from 'Bot/helper';
import Decimal from 'decimal.js';
import _, { isEmpty } from 'lodash';
import {
  getAjustWay,
  getStopOrders,
  getOpenOrders,
  getInvestCompose,
  getHoldCoins,
  getAssetsLists,
  getHotSymbols,
  getNewSymbols,
  getCreateSymbolLists,
} from './services';
import { getTodayProfit } from 'Bot/services/machine';
import {
  adjustLimitConfiger,
  sortInterval,
  minTransfer,
  tranPrecision,
  mostCoinNum,
  thresholdOptionsCacheKey,
} from './config';

// interface Coin {
//   currency: String, // 币种
//   value: Number, // 现有百分比字段
//   percent: Number,// 以前百分比字段
//   triggerPrice: Number // 触发开单价
// }
// 从跟单复制参数；交易对列表添加参数；需要构造成这样的结构
// interface TargetCoinInfo {
//   targets: [Coin], // 目标仓位, 仓位设置用到
//   method?: { // 高级参数设置用到
//     autoChange: Boolean, // 是否关闭调仓
//     threshold: Number,  // 调仓阈值
//     interval: String // 调仓时间间隔
//   },
//   percentType: String, // 配比模式
//   from: '' // 来自方向： 排行榜、投资组合
// };

export default modelBase({
  namespace: 'smarttrade',
  state: {
    coinSelect: {
      area: '', // 选择币种的区域
      symbolsAreas: [], //  币种分类
      displayNameMap: {}, // 分类对应的展示名字
      allSymbolsMap: {}, // 币种列表
    },
    createSort: {}, // 创建区域组合排序记录
    aiparams: {}, // ai参数
    stopOrderItem: {}, // 已成交记录卖单的item的数据
    rankings: {
      1: {},
      7: {},
    }, // 网格排行榜数据
    rankingsLoader: false, // 网格排行榜加载图
    rankingSymbol: '', // 网格排行榜选择的交易对
    hotSymbols: [], // 创建页面热币排行
    newSymbols: [], // 创建页面新币排行
    copyDetail: {}, // 排行榜 详情
    copyParams: {}, // 现货网格排行榜 复制参数创建
    // inverstCompose<TargetCoinInfo>
    inverstCompose: {
      // 用于接受来自投资组合，排行榜的数据
      targets: [],
      method: {},
      percentType: '', // 配比模式
      from: '', // 来自方向： 排行榜、投资组合
    }, // 投资组合传递到自定义参数字段
    createTargetCoins: [], // 用于接受来自交易对添加之后的币种， 需要和创建模块所选币种保持同步
    updateTargetCoins: [], // 用于接受来自已经是运行中的机器人targets, 更新仓位组件
    adjustWays: {
      // 调仓方式字段
      intervalOptions: [],
      thresholdOptions: [],
    },
    composeLists: [], // 投资组合列表数据
    baseMinSizeLists: [], // 保存持仓币种列表，主要使用里面的最小baseMinSize,
    assetsLists: [], // 用户资产列表
  },
  reducers: {
    updateCoinSelect(state, { payload: { area } }) {
      return {
        ...state,
        coinSelect: {
          ...state.coinSelect,
          area,
        },
      };
    },
    // 初始仓位币种
    initCoinPosition(state, { payload: { coins, reducerName = 'createTargetCoins' } }) {
      return {
        ...state,
        [reducerName]: coins,
      };
    },
    // 添加币种到仓位
    // Coin类型
    addCoinPosition(state, { payload: { currency, reducerName = 'createTargetCoins' } }) {
      let targets = state[reducerName];
      targets = [...targets];
      // 最多12个提示
      if (targets.length >= mostCoinNum) {
        // return message.error(
        //   _tHTML('smart.mostchoose', { num: mostCoinNum, className: '' }),
        // );
      }
      targets.push(currency);
      targets = [...new Set(targets)];
      return {
        ...state,
        [reducerName]: targets,
      };
    },
    // 删除仓位中的币种
    // Coin类型
    deleteCoinPosition(state, { payload: { currency, reducerName = 'createTargetCoins' } }) {
      let targets = state[reducerName];
      targets = targets.filter((coin) => coin !== currency);
      return {
        ...state,
        [reducerName]: targets,
      };
    },
    // 设置组合仓位，调仓方式，配置模式；
    // 同时将currecny同步到createTargetCoins
    setComposePosition(state, { payload: TargetCoinInfo }) {
      return {
        ...state,
        inverstCompose: TargetCoinInfo,
        createTargetCoins: TargetCoinInfo.targets?.map((Coin) => Coin.currency) || [],
      };
    },
  },
  effects: {
    // 获取币种列表
    *getCoinLists({ payload }, { call, put, select }) {
      try {
        const { data } = yield call(getCreateSymbolLists);
        const { symbol: allSymbolsMap, displayName } = data;

        const displayNameMap = {};
        const displayMameSortByCode = [];
        // name 后端用 displayName展示的名字
        displayName.forEach((el) => {
          displayMameSortByCode.push(el.name);
          displayNameMap[el.name] = el.displayName;
        });

        // const collectionSymbolMap = {};
        // const collectionSymbol = [];
        // allSymbolsMap['collectionSymbol']?.forEach((el) => {
        //   collectionSymbol.push(el.symbolCode);
        //   collectionSymbolMap[el.symbolCode] = el.symbolCode;
        // });

        // const spotGridSymbolMap = {};
        // _.forEach(allSymbolsMap, (vals) => {
        //   // 按照交易量从大到小排序
        //   vals.sort((a, b) => b.volValue - a.volValue);

        //   _.forEach(vals, (symbolInfoRow) => {
        //     if (symbolInfoRow) {
        //       spotGridSymbolMap[symbolInfoRow.symbolCode] = symbolInfoRow.symbolCode;
        //     }
        //   });
        // });

        let symbolsAreas = Object.keys(allSymbolsMap);
        let hasCollection = false;
        const delIndex = symbolsAreas.findIndex((el) => el === 'collectionSymbol');
        if (delIndex > -1 && allSymbolsMap.collectionSymbol?.length > 0) {
          symbolsAreas.splice(delIndex, 1);
          // 自选放第一个
          hasCollection = true;
        }
        // 按照displayMameSortByCode排序
        symbolsAreas = displayMameSortByCode.filter((code) => symbolsAreas.includes(code));
        if (hasCollection) {
          symbolsAreas.unshift('collectionSymbol');
        }
        const area = yield select((state) => state.smarttrade.coinSelect.area);

        yield put({
          type: 'update',
          payload: {
            coinSelect: {
              area: area || symbolsAreas[0] || 'USDS',
              symbolsAreas,
              displayNameMap,
              // collectionSymbol,
              // collectionSymbolMap,
              // spotGridSymbolMap,
              allSymbolsMap,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 当前委托
    *getOpenOrders({ payload }, { call, put, select }) {
      const { taskId } = payload || {};
      try {
        const { data: open } = yield call(getOpenOrders, taskId);
        if (!open) {
          yield put({
            type: 'update',
            payload: {
              CurrentLoading: false,
            },
          });
          return;
        }

        yield put({
          type: 'update',
          payload: {
            CurrentLoading: false,
            open: {
              totalNum: 0,
              items: open,
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 已成交历史
    *getStopOrders({ payload }, { call, put, select }) {
      yield put({
        type: 'update',
        payload: {
          HistoryLoading: true,
        },
      });
      const { taskId, isChanged } = payload || {};
      try {
        const { data: stop } = yield call(getStopOrders, taskId, isChanged);
        if (!stop) {
          yield put({
            type: 'update',
            payload: {
              HistoryLoading: false,
            },
          });
          return;
        }
        yield put({
          type: 'update',
          payload: {
            HistoryLoading: false,
            stop: {
              totalNum: 0,
              items: stop,
            },
          },
        });
      } catch (error) {
        yield put({
          type: 'update',
          payload: {
            HistoryLoading: false,
          },
        });
      }
    },
    // 获取介绍页面下面的排行榜数据
    *getRanking({ payload: { id, day, symbol, type } }, { call, put, select }) {
      try {
        const oldRankings = yield select((state) => state.smarttrade.rankings);
        const cacheKey = _.isEmpty(symbol) ? 'ALL' : symbol;
        // 没有缓存的，就显示加载图
        if (!oldRankings[day][cacheKey]) {
          yield put({
            type: 'update',
            payload: {
              rankingsLoader: true,
            },
          });
        }
        const { data: ranking } = yield call(getTodayProfit, id, day, symbol, type);
        ranking.topProfitRates = ranking.topProfitRates?.map((el) => {
          el.symbolName = toSplitCase(el.symbolName);
          return el;
        });
        ranking.myProfitRates = ranking.myProfitRates?.map((el) => {
          el.symbolName = toSplitCase(el.symbolName);
          return el;
        });
        // 数据过滤
        // const effective = ranking.topProfitRates.filter(el => Number(el.profitRateYear) > 0);
        // ranking.topProfitRates = effective;
        // // 只展示正的
        // // 盈利（年化>0）人数超过5个，就显示排行榜
        // // 盈利人数小于5，不显示排行榜
        // if (effective.length < 5) {
        //   ranking.topProfitRates = [];
        // }
        // 再次获取最新的
        const oldRankingsNow = yield select((state) => state.smarttrade.rankings);
        yield put({
          type: 'update',
          payload: {
            rankingsLoader: false,
            rankings: {
              ...oldRankingsNow,
              [day]: {
                ...oldRankingsNow[day],
                [cacheKey]: ranking,
              },
            },
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getHoldCoins({ payload }, { call, put }) {
      try {
        const { data: baseMinSizeLists } = yield call(getHoldCoins);
        yield put({
          type: 'update',
          payload: {
            baseMinSizeLists,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 获取持仓调仓方式数据
    *getAjustWay({ payload }, { call, put, select }) {
      const _intervalOptions = yield select((state) => state.smarttrade.adjustWays.intervalOptions);
      if (!isEmpty(_intervalOptions)) return;

      // const local = Storage.getItem(thresholdOptionsCacheKey);
      // if (local) {
      //   yield put({
      //     type: 'update',
      //     payload: {
      //       adjustWays: local,
      //     },
      //   });
      //   // return local[lang]
      // }

      try {
        const { data } = yield call(getAjustWay);
        const thresholdOptions = data.thresholdOptions.map((el) => {
          return {
            value: +el,
            text: floatToPercent(el),
          };
        });
        // 转换成对应的语言显示，并计算成秒方便提交
        let intervalOptions = sortInterval(data.intervalOptions);
        intervalOptions = intervalOptions.map((el) => {
          const { text, seconds } = adjustLimitConfiger(el);
          return {
            value: el,
            text,
            seconds,
          };
        });

        yield put({
          type: 'update',
          payload: {
            adjustWays: {
              thresholdOptions,
              intervalOptions,
            },
          },
        });
        // Storage.setItem(thresholdOptionsCacheKey, {
        //   thresholdOptions,
        //   intervalOptions,
        // });
      } catch (error) {
        console.error(error);
      }
    },

    *getInvestCompose({ payload }, { call, put }) {
      try {
        const { data: composeLists } = yield call(getInvestCompose);
        // eslint-disable-next-line no-unused-expressions
        composeLists?.forEach((el) => {
          el.weeklyChangeRateRaw = Number(el.weeklyChangeRate || 0);
          el.dailyChangeRateRaw = Number(el.dailyChangeRate || 0);
          el.monthlyChangeRateRaw = Number(el.monthlyChangeRate || 0);

          el.weeklyChangeRate = el.weeklyChangeRate ? times100(el.weeklyChangeRate) : null;
          el.dailyChangeRate = el.dailyChangeRate ? times100(el.dailyChangeRate) : null;
          el.monthlyChangeRate = el.monthlyChangeRate ? times100(el.monthlyChangeRate) : null;
        });
        composeLists.sort((a, b) => b.dailyChangeRateRaw - a.dailyChangeRateRaw);

        yield put({
          type: 'update',
          payload: {
            composeLists,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    *getAssetsLists({ payload }, { call, put }) {
      try {
        let { data: assetsLists } = yield call(getAssetsLists);
        // 过滤出符合大于40U
        assetsLists = assetsLists.filter((item) => {
          item.available = Decimal(item.available).toFixed(tranPrecision, Decimal.ROUND_DOWN);

          item.tranUsdt = Number(
            Decimal(item.available)
              .times(item.price || 1)
              .toFixed(tranPrecision, Decimal.ROUND_DOWN),
          );
          return item.tranUsdt >= minTransfer;
        });
        // 排序
        assetsLists.sort((a, b) => Number(b.tranUsdt) - Number(a.tranUsdt));

        yield put({
          type: 'update',
          payload: {
            assetsLists,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 热门币
    *getHotSymbols({ payload }, { call, put }) {
      try {
        const { data: hotSymbols } = yield call(getHotSymbols);
        _.forEach(hotSymbols, (row) => {
          row.lastTradedPrice = row.price;
        });
        yield put({
          type: 'update',
          payload: {
            hotSymbols,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 热门币
    *getNewSymbols({ payload }, { call, put }) {
      try {
        const { data: newSymbols } = yield call(getNewSymbols);
        _.forEach(newSymbols, (row) => {
          row.baseCurrency = row.item;
          row.lastTradedPrice = row.price;
        });
        yield put({
          type: 'update',
          payload: {
            newSymbols,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
});
