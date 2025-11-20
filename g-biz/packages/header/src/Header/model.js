/**
 * Owner: iron@kupotech.com
 */
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { cloneDeep, forEach, map, mapKeys, isEmpty } from 'lodash';
import { PREFIX } from '../common/constants';
import { addSpmIntoQuery, precision } from '../common/tools';
import * as services from './service';
import {
  captureThemeError,
  checkLastOperateTimestampUnexpired,
  resetLastOperateTimestampUnexpired,
  sentryReport,
  transStepToPrecision,
} from './tools';
import { CONTAINER_HEIGHT, WIDTH_BREAK_POINT } from './config';
import { tenantConfig } from '../tenantConfig';

export const namespace = `${PREFIX}_header`;
const delayOffset = 0;
export const expireDuration = 1000 * 60 * 5; // 超大数据缓存时间

const getInitHeaderHeight = () => {
  // 根据屏幕宽度设置头部高度
  if (window.innerWidth < WIDTH_BREAK_POINT.sm) {
    return CONTAINER_HEIGHT.common.min;
  }
  return CONTAINER_HEIGHT.common.max;
};

const initialValue = {
  otcLanguageList: null,
  levelInfo: {},
  assetDetail: {},
  langList: [],
  langListMap: {},
  currencyList: [],
  prices: {},
  siteList: [],
  feeDiscountConfig: {
    discountRate: 100,
    isGlobalDeductionEnabled: false,
  },
  feeDiscountEnable: {}, // 用户是否可以进行kcs抵扣
  userKcsDiscountStatus: false,
  navList: [],
  verifyStatus: undefined, // UNVERIFIED, VERIFIED, VERIFING
  showNewbieNav: false,
  futureFee: {},
  areas: [], // 交易市场列表，包含子市场
  areasMargin: [], // 交易市场列表，包含子市场 杠杆
  configs: null, // 杠杆配置
  marginSymbols: [], // 杠杆交易对仅币对
  marginSymbolsMap: {}, // 杠杆交易对Map
  marginSymbolsOrigin: [],
  symbols: [], // 所有交易对
  symbolsMap: {}, // 交易对Map
  futuresArea: [], // u本位合约子菜单,
  futuresSymbols: [], // 所有合约交易对
  futuresCoinQuotes: [], // 币本位合约交易对 仅币对
  coinsCategorys: {}, // 所有币种信息
  hotRecommend: null, // 搜索里的热搜
  aggregatedRecommend: {}, // 搜索里现货合约理财推荐
  searchList: [], // 搜索结果
  spotList: [],
  futuresList: [],
  earnList: [],
  web3List: [],
  searchSessionId: 0, // 每次搜索拿到结果的时间，用于埋点
  searchWords: '',
  symbolsMenu: {},
  isPartner: false, // 是否是合伙人
  isShowRestrictNotice: null, // 合规清退顶飘展示状态，null为未初始化。false请求了接口但不加载，true请求了接口并加载
  restrictNoticeHeight: 0, // 合规清退顶飘高度
  headerHeight: getInitHeaderHeight(), // 头部高度
  totalHeaderHeight: getInitHeaderHeight(), // 头部和合规清退顶飘高度
  restrictDialogStatus: {}, // 合规清退弹窗的状态
  kycStatusDisplayInfo: {}, // kyc3状态及文案
  isDeposit: null, // 登录用户是否入金过
  favSymbols: null, // 未请求是null，请求是数组类型
  thunkLoaded: false, // 代码分割加载
  KCSRights: {
    data: null,
    isLoaded: false,
  },
  machineMap: {}, // 机器人策略支持列表
};

// effect执行计数
const effectsCount = {};
// 最大精度
export const maxPrecision = 8;

export default {
  namespace,
  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    updateHeaderHeight(state, { payload }) {
      const { headerHeight } = payload;
      const { restrictNoticeHeight } = state;
      const totalHeaderHeight = headerHeight + (restrictNoticeHeight || 0);
      return {
        ...state,
        headerHeight,
        totalHeaderHeight,
      };
    },
    updateRestrictNoticeHeight(state, { payload }) {
      const { restrictNoticeHeight } = payload;
      const { headerHeight } = state;
      const totalHeaderHeight = restrictNoticeHeight + (headerHeight || 0);
      return {
        ...state,
        restrictNoticeHeight,
        totalHeaderHeight,
      };
    },
  },
  effects: {
    // 获取支持的语言列表
    *pullOtcLanguageList(_, { call, put }) {
      const { data } = yield call(services.getSupportPayTypes, { type: 'LANGUAGE' });
      yield put({
        type: 'update',
        payload: {
          otcLanguageList: data || [],
        },
      });
    },
    *logout({ payload: { to, spm } = {} }, { call }) {
      const { code } = yield call(services.logout);
      if (code === '200') {
        if (to) {
          window.location.href = addSpmIntoQuery(
            queryPersistence.formatUrlWithStore(`${window.location.origin}${to}`),
            spm,
          );
        } else {
          window.location.reload();
        }
      }
    },
    *pullUserLevel(_, { call, put }) {
      const { data } = yield call(services.getUserVipInfo);
      yield put({
        type: 'update',
        payload: {
          levelInfo: {
            ...data,
          },
        },
      });
      const { makerFeeRate, takerFeeRate } = data || {};
      yield put({ type: 'getUserKcsDiscount' });
      yield put({ type: 'getFeeDeductionConfig' });
      yield put({
        type: 'getUserKcsEnable',
        payload: { makerFeeRate, takerFeeRate },
      });
    },
    *checkOptionsIsOpen(_, { call }) {
      let res = true;
      try {
        yield call(services.checkOptions);
      } catch {
        res = false;
      }
      return res;
    },
    *getUserKcsEnable({ payload = {} }, { put, call }) {
      const { data } = yield call(services.getUserKcsEnable, payload);
      yield put({ type: 'update', payload: { feeDiscountEnable: data || {} } });
    },
    *getUserFutureFee(_, { call, put }) {
      if (!window._SITE_CONFIG_.functions.futures) {
        return;
      }
      const { data } = yield call(services.getUserFutureFee, { symbol: 'XBTUSDTM' });
      yield put({
        type: 'update',
        payload: {
          futureFee: {
            ...data,
          },
        },
      });
    },
    *pullAssetDetail({ payload }, { put, call }) {
      const { balanceCurrency } = payload || {};
      const { success, data } = yield call(services.getAssetDetail3, {
        balanceCurrency: balanceCurrency || 'USDT',
      });
      if (success) {
        const { subOverLimit } = data;
        if (subOverLimit) {
          yield put({
            type: 'getLargeSubsAssets',
            payload: {
              balanceCurrency: balanceCurrency || 'USDT',
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              assetDetail: data,
            },
          });
        }
      }
    },
    *getIsDeposit(_, { call, put }) {
      const { data: isDeposit } = yield call(services.getIsDeposit);
      yield put({
        type: 'updata',
        payload: {
          isDeposit,
        },
      });
      return isDeposit;
    },
    *getLargeSubsAssets({ payload }, { put, call }) {
      const { balanceCurrency } = payload;
      try {
        const { success, data } = yield call(services.getLargeSubAccountsAsset, {
          balanceCurrency: balanceCurrency || 'USDT',
        });
        if (success) {
          yield put({
            type: 'update',
            payload: {
              assetDetail: data,
            },
          });
        }
      } catch (e) {
        console.error(e);
      }
    },
    *pullLangList(_, { call, put }) {
      try {
        const { data } = yield call(services.getLangList);
        if (data) {
          const langListMap = {};
          forEach(data, (item) => {
            langListMap[item[0]] = {
              lang: item[0],
              langName: item[1],
            };
          });
          yield put({
            type: 'update',
            payload: {
              langList: data,
              langListMap,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *pullRates({ payload }, { call, put }) {
      const { currencyListData } = payload;
      const currencyList = [];
      try {
        let data = currencyListData;
        // 如果有currencyListData， 那么将不再请求接口；
        // 避免项目和header 组件都会请求该数据
        if (!currencyListData) {
          const result = yield call(services.getRates);
          data = result.data;
        }
        if (data) {
          mapKeys(data, (value, key) => {
            if (key === 'CNY') {
              return key;
            }
            currencyList.push(key);
            return key;
          });
        }
      } catch (e) {
        console.log(e);
      }
      yield put({
        type: 'update',
        payload: {
          // TODO: 前端临时过滤货币，后期需要后端提供新接口
          currencyList: tenantConfig.filterCurrency(currencyList),
        },
      });
    },
    *pullPrices({ payload: { currency } }, { call, put }) {
      if (checkLastOperateTimestampUnexpired(services.getPrices, 1000)) return;
      const { data } = yield call(services.getPrices, currency);
      yield put({
        type: 'update',
        payload: { prices: data || {} },
      });
    },
    *getManifestSiteList(_, { call, put }) {
      const start = Date.now();
      const { data, success } = yield call(services.getManifestSiteList);
      const end = Date.now();
      if (success && data && data.sites) {
        const { hostname } = window.location;
        const siteList = data.sites.map((i) => {
          if (hostname === i) return { name: i, delay: end - start - delayOffset, isCurrent: true };
          return { name: i };
        });
        yield put({ type: 'update', payload: { siteList } });
        // 从数组第1个开始测速
        yield put({ type: 'testDomainDelay' });
      }
    },
    *testDomainDelay({ payload = {} }, { call, put, select }) {
      const { index = 0 } = payload;
      const { siteList } = yield select((i) => i[namespace]);
      const list = cloneDeep(siteList);
      if (index >= list.length || list[index].delay) return;
      try {
        const start = Date.now();
        const { success } = yield call(
          services.getManifestSiteList,
          `https://${list[index].name}/_api`,
        );
        const end = Date.now();
        if (success) list[index].delay = end - start - delayOffset;
        else list[index].delay = 9999;
      } catch (e) {
        list[index].delay = 9999;
      } finally {
        yield put({ type: 'update', payload: { siteList: list } });
        // 遍历所有域名
        yield put({ type: 'testDomainDelay', payload: { index: index + 1 } });
      }
    },
    *getUserKcsDiscount(action, { put, call }) {
      const { data } = yield call(services.checkIsKcsDiscountOn);
      yield put({
        type: 'update',
        payload: {
          userKcsDiscountStatus: (data || {}).isDeductionEnabled || false,
        },
      });
    },
    *getFeeDeductionConfig(action, { put, call }) {
      const { data } = yield call(services.getFeeDeductionConfig);
      yield put({
        type: 'update',
        payload: {
          feeDiscountConfig: data,
        },
      });
    },
    *pullNavigationList({ payload }, { put, call }) {
      const res = yield call(services.getNavigation, payload);
      const { data, success } = res;
      if (success) {
        let navList = data || [];
        navList = navList.map((item) => {
          return {
            ...item,
            // 如果URL是/markets，添加new标记（后期给运营提需求，从后端配置）
            ...(item.uri === '/markets' && { showNew: true }),
          };
        });

        yield put({
          type: 'update',
          payload: {
            navList,
          },
        });
      }
    },
    *queryServiceInfo(_, { put, call }) {
      const { data } = yield call(services.queryServiceInfo);
      yield put({
        type: 'update',
        payload: {
          serviceInfo: data,
        },
      });
    },
    *closeService(_, { call }) {
      yield call(services.closeService);
    },
    *pullAreas(_, { call, put }) {
      if (checkLastOperateTimestampUnexpired('getQuotes', expireDuration)) return;
      // 获取交易市场
      try {
        const { data, success } = yield call(services.getQuotes);
        console.log('data in pullAreas:', data);
        if (success) {
          let newData = [];
          if (data) {
            newData = data?.level1
              ?.filter((item) => item.enabled) // enabled 为 true 表示该分区下有币对
              .map((item) => ({
                name: item.concept,
                displayName: item.nameA,
                value: item.concept,
                quotes: [],
              }));
          }
          yield put({ type: 'update', payload: { areas: newData } });
        } else {
          resetLastOperateTimestampUnexpired('getQuotes');
        }
      } catch (err) {
        resetLastOperateTimestampUnexpired('getQuotes');
      }
    },

    *pullAreasMargin(_, { call, put }) {
      if (checkLastOperateTimestampUnexpired('getLeverageMenu', expireDuration)) return;
      // 获取交易市场
      try {
        const { data, success } = yield call(services.getLeverageMenu);
        if (success) {
          let newData = [];
          if (data) {
            newData = data?.leverageMenu?.level1
              ?.filter((item) => item.enabled) // enabled 为 true 表示该分区下有币对
              .map((item) => ({
                name: item.category,
                value: item.category,
                quotes: [],
              }));
          }
          yield put({ type: 'update', payload: { areasMargin: newData } });
        } else {
          resetLastOperateTimestampUnexpired('getLeverageMenu');
        }
      } catch (err) {
        resetLastOperateTimestampUnexpired('getLeverageMenu');
      }
    },

    *pullConfigs(_, { put, call }) {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = yield call(services.pullConfigs);
      // 二次阻断，防止请求结果覆盖下方pullConfigsByUser的结果
      if (success && !effectsCount.pullConfigsByUser) {
        yield put({
          type: 'update',
          payload: {
            configs: data,
          },
        });
      }
    },
    // 杠杆白名单倍率
    *pullConfigsByUser(_, { put, call }) {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = yield call(services.pullConfigsByUser);
      if (success) {
        effectsCount.pullConfigsByUser = 1;
        yield put({
          type: 'update',
          payload: {
            configs: data,
          },
        });
      }
    },
    // 获取所有杠杆交易对
    *pullMarginSymbols(_, { call, put }) {
      if (checkLastOperateTimestampUnexpired('getMarginSymbols', expireDuration)) return;
      try {
        const { data, success } = yield call(services.getMarginSymbols);
        if (success) {
          const marginSymbolsMap = {};
          const marginSymbols = map(data, (item) => {
            marginSymbolsMap[item.symbol] = {
              baseCurrency: item.baseCurrency,
              isEnableMarginTrade: item.isEnableMarginTrade,
              isIsolatedEnabled: item.isIsolatedEnabled,
              isIsolatedTradeEnabled: item.isIsolatedTradeEnabled,
              isMarginEnabled: item.isMarginEnabled,
              isolatedMaxLeverage: item.isolatedMaxLeverage,
              quoteCurrency: item.quoteCurrency,
              symbol: item.symbol,
              symbolName: item.symbolName,
            };
            return item.symbol;
          });
          yield put({
            type: 'update',
            payload: {
              marginSymbols,
              marginSymbolsMap,
              marginSymbolsOrigin: data,
            },
          });
        } else {
          resetLastOperateTimestampUnexpired('getMarginSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('getMarginSymbols');
      }
    },

    *pullSymbols(_, { call, put }) {
      if (checkLastOperateTimestampUnexpired('pullSymbols', expireDuration)) return;
      try {
        const { success, data } = yield call(services.pullSymbols, {});
        if (success) {
          const records = data.map((item) => {
            const { baseIncrement, priceIncrement, quoteIncrement } = item;
            return {
              baseCurrency: item.baseCurrency,
              isEnableMarginTrade: item.isEnableMarginTrade,
              isIsolatedEnabled: item.isIsolatedEnabled,
              isIsolatedTradeEnabled: item.isIsolatedTradeEnabled,
              isMarginEnabled: item.isMarginEnabled,
              isolatedMaxLeverage: item.isolatedMaxLeverage,
              quoteCurrency: item.quoteCurrency,
              symbol: item.symbolCode, // 交易对code
              symbolName: item.symbol, // 交易对名称（与杠杆的数据一致）
              basePrecision: transStepToPrecision(baseIncrement),
              pricePrecision: transStepToPrecision(priceIncrement),
              quotePrecision: transStepToPrecision(quoteIncrement),
              code: item.code,
            };
          });
          const symbolsMap = {};
          records.forEach((val) => {
            symbolsMap[val.code] = val;
          });
          yield put({
            type: 'update',
            payload: {
              symbols: records,
              symbolsMap,
            },
          });
        } else {
          resetLastOperateTimestampUnexpired('pullSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('pullSymbols');
      }
    },
    // 所有合约交易对
    *pullFuturesSymbols(action, { call, put }) {
      if (!window._SITE_CONFIG_.functions.futures) {
        return;
      }
      if (checkLastOperateTimestampUnexpired('pullFuturesSymbols', expireDuration)) return;
      try {
        const { data, success } = yield call(services.pullFuturesSymbols);
        if (success) {
          const formatData = map(data, (item) => {
            const {
              baseCurrency,
              type,
              settleDate,
              quoteCurrency,
              isInverse,
              symbol,
              imgUrl,
            } = item;
            return {
              baseCurrency,
              type,
              settleDate,
              quoteCurrency,
              isInverse,
              symbol,
              imgUrl,
            };
          });
          yield put({
            type: 'update',
            payload: {
              futuresSymbols: formatData || [],
            },
          });
        } else {
          resetLastOperateTimestampUnexpired('pullFuturesSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('pullFuturesSymbols');
      }
    },
    // 合约分区
    *pullTradeAreaList(action, { call, put }) {
      try {
        if (!window._SITE_CONFIG_.functions.futures) {
          return;
        }
        const { data, success } = yield call(services.pullFuturesAreaList);
        // USDS COIN_BASE
        if (success && data) {
          const futuresArea = data.find((i) => i.name === 'USDS')?.children || [];
          const futuresCoinQuotes = data.find((i) => i.name === 'COIN_BASE')?.quotes || [];
          yield put({
            type: 'update',
            payload: {
              futuresArea,
              futuresCoinQuotes,
            },
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    *getCoinsCategory(action, { call, put }) {
      if (checkLastOperateTimestampUnexpired('getCoinsCategory', expireDuration)) return;
      try {
        const { data, success } = yield call(services.getCoinsCategory);
        if (success) {
          const map = {};
          if (data?.kucoin?.length) {
            data.kucoin.forEach((item) => {
              item.precision = parseInt(item.precision || maxPrecision, 10);
              precision(item.coin, item.precision);
              map[item.currency] = {
                key: item.currency,
                iconUrl: item.iconUrl,
                currencyName: item.currencyName,
              };
            });
          }
          yield put({ type: 'reset', payload: map });
          yield put({
            type: 'update',
            payload: {
              coinsCategorys: map,
            },
          });
        } else {
          resetLastOperateTimestampUnexpired('getCoinsCategory');
        }
      } catch (e) {
        resetLastOperateTimestampUnexpired('getCoinsCategory');
      }
    },
    // 获取用户自选交易对
    *getUserFavSymbols(action, { call, put, take }) {
      if (checkLastOperateTimestampUnexpired('getUserFavSymbols', 30 * 1000)) return;
      try {
        const { data, success } = yield call(services.getUserFavSymbols);
        if (success) {
          yield put({ type: 'update', payload: { favSymbols: data || [] } });
        } else {
          resetLastOperateTimestampUnexpired('getUserFavSymbols');
        }
        yield take('getUserFavSymbols/@@end');
      } catch (e) {
        resetLastOperateTimestampUnexpired('getUserFavSymbols');
      }
    },

    // 全局搜索
    *searchWeb({ payload }, { call, put }) {
      const { data, success } = yield call(services.search, payload);
      if (success) {
        const spotList = [];
        const futuresList = [];
        const earnList = [];
        const web3List = [];
        forEach(data, (item) => {
          const { resourceType } = item;
          if (resourceType === 'SPOT') {
            spotList.push(item);
          }
          if (resourceType === 'FUTURE') {
            futuresList.push(item);
          }
          if (resourceType === 'EARN') {
            earnList.push(item);
          }
          if (resourceType === 'WEB3') {
            web3List.push(item);
          }
        });
        if (spotList.length > 100) {
          spotList.splice(100);
        }
        if (futuresList.length > 100) {
          futuresList.splice(100);
        }
        if (earnList.length > 100) {
          earnList.splice(100);
        }
        if (web3List.length > 100) {
          web3List.splice(100);
        }
        yield put({
          type: 'update',
          payload: {
            spotList,
            futuresList,
            earnList,
            web3List,
            searchList: data || [],
            searchSessionId: Date.now(),
            searchWords: payload.keyword,
          },
        });
        return data;
      }
      return [];
    },
    // 现货热搜
    *recommendSpot(action, { call, put }) {
      const { data, success } = yield call(services.recommendSpot);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            hotRecommend: data,
          },
        });
      }
    },
    // 理财现货合约推荐聚合
    *recommendAggregated(action, { call, put }) {
      const { data, success } = yield call(services.recommendAggregated);
      if (success) {
        yield put({
          type: 'update',
          payload: {
            aggregatedRecommend: data,
          },
        });
      }
    },
    // 是否是合伙人查询
    *getIsPartner(action, { call, put }) {
      try {
        const { data, success } = yield call(services.isPartner);
        const newData = {
          inviterIsAffiliate: data.inviterIsAffiliate, // 当前用户的上级是否是合伙人
          isPartner: data.affiliate, // 当前用户是否是合伙人
        };
        if (success) {
          yield put({
            type: 'update',
            payload: {
              ...newData,
            },
          });
        } else {
          yield put({
            type: 'update',
            payload: {
              isPartner: false,
              inviterIsAffiliate: false,
            },
          });
        }
      } catch (error) {
        // 遇到error就设置为false
        yield put({
          type: 'update',
          payload: {
            isPartner: false,
            inviterIsAffiliate: false,
          },
        });
      }
    },
    *getKycStatusDisplayInfo(action, { call, put }) {
      // 5秒节流
      if (checkLastOperateTimestampUnexpired('getKycStatusDisplayInfo')) return;
      const { data } = yield call(services.getKycStatusDisplayInfo);
      yield put({ type: 'update', payload: { kycStatusDisplayInfo: data } });
    },
    *changeTheme({ payload }, { call }) {
      try {
        yield call(services.setCookies, [{ 'name': 'kc_theme', 'value': payload.theme }]);
      } catch (e) {
        captureThemeError(`set theme cookie failed - ${JSON.stringify(e)}`);
      }
    },
    *pullKCSRights(_, { call, put, select }) {
      const isLoaded = yield select((state) => state[namespace].KCSRights.isLoaded);
      if (isLoaded) {
        return;
      }
      try {
        const { data, success, msg } = yield call(services.pullKCSRights);
        if (success) {
          const { kcsLevel, kcsLevelDesc, kcsLevelIcon } = data ?? {};
          yield put({
            type: 'update',
            payload: {
              KCSRights: {
                data: { kcsLevel, kcsLevelDesc, kcsLevelIcon },
                isLoaded: true,
              },
            },
          });
          if (!kcsLevelDesc || !kcsLevelIcon) {
            sentryReport({
              message: 'Missing KCS level name or icon !',
              level: 'error',
              tags: {
                errorType: 'kcs_level_error',
                level: kcsLevel,
                missing: [!kcsLevelDesc ? 'name' : undefined, !kcsLevelIcon ? 'icon' : undefined]
                  .filter(Boolean)
                  .join(','),
              },
              fingerprint: 'kcs_level_error',
            });
          }
        } else {
          throw new Error(msg);
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 机器人列表
    *getBotLists(action, { call, put, select }) {
      const oldMachineMap = yield select((state) => state[namespace].machineMap);
      if (!isEmpty(oldMachineMap)) return oldMachineMap;

      try {
        const { data: machine } = yield call(services.getBotLists);

        const machineMap = {};
        machine?.forEach((m) => {
          machineMap[m.type] = m;
        });

        yield put({
          type: 'update',
          payload: {
            machineMap,
          },
        });
        return machineMap;
      } catch (error) {
        console.log(error);
        return oldMachineMap;
      }
    },
  },
};
