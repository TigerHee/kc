/**
 * Owner: iron@kupotech.com
 */
import { create } from 'zustand';
import createStoreProvider from 'tools/createStoreProvider';
import { cloneDeep, forEach, map, mapKeys, isEmpty } from 'lodash-es';
import * as services from './service';
import { addSpmIntoQuery, precision } from '../common/tools';
import { queryPersistence } from 'tools/base/QueryPersistence';
import { CONTAINER_HEIGHT, WIDTH_BREAK_POINT } from './config';
import { bootConfig } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';
import * as Sentry from '@sentry/nextjs';
import {
  captureThemeError,
  checkLastOperateTimestampUnexpired,
  resetLastOperateTimestampUnexpired,
  sentryReport,
  transStepToPrecision,
} from './tools';
import { getTenantConfig } from '../tenantConfig';
import type { FirstLevelNavigation } from './Nav/types';

const delayOffset = 0;
export const expireDuration = 1000 * 60 * 5; // 超大数据缓存时间

// effect执行计数
const effectsCount: any = {};

const defaultWebNavigation: { navigation: FirstLevelNavigation[] } = {
  navigation: [],
};

// 最大精度
export const maxPrecision = 8;

export const getInitHeaderHeight = () => {
  if (typeof window === 'undefined') {
    return CONTAINER_HEIGHT.common.min;
  }
  // 根据屏幕宽度设置头部高度
  if (window.innerWidth < WIDTH_BREAK_POINT.sm) {
    return CONTAINER_HEIGHT.common.min;
  }
  return CONTAINER_HEIGHT.common.max;
};

export const getLangInfo = async function () {
  const defaultResult = { langList: [], langListMap: {} };
  try {
    const { data } = await services.getLangList();
    if (!data) {
      return defaultResult;
    }
    const langListMap = {};
    forEach(data, item => {
      langListMap[item[0]] = {
        lang: item[0],
        langName: item[1],
      };
    });
    return { langList: data, langListMap };
  } catch (e) {
    console.error('getLangInfo error', e);
  }
  return defaultResult;
};

export const getNavigationList = async payload => {
  try {
    const res = await services.getNavigationV2(payload);

    const { data, success } = res;
    if (success) {
      return data;
    }
  } catch (error) {
    console.error('pullNavigationList failed:', error);
    Sentry.captureMessage(`pullNavigationList failed: ${error}`);
  }
  return defaultWebNavigation;
};

export const defaultHeaderState = {
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
  webNavigation: defaultWebNavigation,
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
  alphaList: [],
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
  serviceInfo: null,
  showPwaTip: true,
  getSubAssetsLoading: false,
  machineMap: {}, // 机器人策略支持列表
};

interface HeaderActions {
  updateHeader: (params?: { [key: string]: any }) => any;
  updateHeaderHeight: ({ headerHeight }: { headerHeight: number }) => any;
  updateRestrictNoticeHeight: ({ restrictNoticeHeight }: { restrictNoticeHeight: number }) => any;
  pullOtcLanguageList: () => any;
  logout: ({ to, spm }: { to: string; spm: any }) => any;
  pullUserLevel: () => any;
  checkOptionsIsOpen: () => any;
  getUserKcsEnable: (params: any) => any;
  getUserFutureFee: () => any;
  pullAssetDetail: ({ balanceCurrency }: { balanceCurrency: string }) => any;
  getIsDeposit: () => any;
  getLargeSubsAssets: ({ balanceCurrency }: { balanceCurrency: string }) => any;
  pullLangList: () => any;
  pullRates: ({ currencyListData }: { currencyListData: any }) => any;
  pullPrices: ({ currency }: { currency: string }) => any;
  getManifestSiteList: () => any;
  testDomainDelay: ({ index }: { index: number }) => any;
  getUserKcsDiscount: () => any;
  getFeeDeductionConfig: () => any;
  pullNavigationList: (payload: any) => any;
  queryServiceInfo: () => any;
  closeService: () => any;
  pullAreas: () => any;
  pullAreasMargin: () => any;
  pullConfigs: () => any;
  pullConfigsByUser: () => any;
  pullMarginSymbols: () => any;
  pullSymbols: () => any;
  pullFuturesSymbols: () => any;
  pullTradeAreaList: () => any;
  getCoinsCategory: () => any;
  getUserFavSymbols: () => any;
  searchWeb: (payload: any) => any;
  recommendSpot: () => any;
  recommendAggregated: () => any;
  getIsPartner: () => any;
  getKycStatusDisplayInfo: () => any;
  changeTheme: ({ theme }: { theme: string }) => any;
  pullKCSRights: () => any;
  getBotLists: () => any;
}

interface ExtraHeaderState {
  userInfo?: any;
  currency?: any;
  inviter?: any;
  onHeaderHeightChange?: (height: number) => void;
}

type HeaderState = typeof defaultHeaderState & ExtraHeaderState;

export const createHeaderStore = (initState: Partial<HeaderState> = {}) => {
  return create<HeaderState & HeaderActions>()((set, get) => ({
    ...defaultHeaderState,
    ...initState,

    updateHeader: params => {
      if (!params || typeof params !== 'object') {
        return;
      }
      set(params);
    },

    updateHeaderHeight: ({ headerHeight }) => {
      const restrictNoticeHeight = get().restrictNoticeHeight;
      const totalHeaderHeight = headerHeight + (restrictNoticeHeight || 0);
      set({ headerHeight, totalHeaderHeight });
      get().onHeaderHeightChange?.(totalHeaderHeight);
    },

    updateRestrictNoticeHeight: ({ restrictNoticeHeight }) => {
      const headerHeight = get().headerHeight;
      const totalHeaderHeight = restrictNoticeHeight + (headerHeight || 0);
      set({ totalHeaderHeight, restrictNoticeHeight });
      get().onHeaderHeightChange?.(totalHeaderHeight);
    },

    async pullOtcLanguageList() {
      const { data } = await services.getSupportPayTypes({ type: 'LANGUAGE' });
      set({ otcLanguageList: data || [] });
    },

    async logout({ to, spm }) {
      const { code } = await services.logout();
      if (code === '200') {
        if (to) {
          window.location.href = addSpmIntoQuery(
            queryPersistence.formatUrlWithStore(`${window.location.origin}${to}`),
            spm,
            getCurrentLang()
          );
        } else {
          window.location.reload();
        }
      }
    },

    async pullUserLevel() {
      const { data } = await services.getUserVipInfo();
      set({
        levelInfo: {
          ...data,
        },
      });
      const { makerFeeRate, takerFeeRate } = data || {};
      const { getUserKcsDiscount, getFeeDeductionConfig, getUserKcsEnable } = get();
      await Promise.all([
        getUserKcsDiscount(),
        getFeeDeductionConfig(),
        () => getUserKcsEnable({ makerFeeRate, takerFeeRate }),
      ]);
    },

    async checkOptionsIsOpen() {
      let res = true;
      try {
        await services.checkOptions();
      } catch {
        res = false;
      }
      return res;
    },

    async getUserKcsEnable(payload) {
      const { data } = await services.getUserKcsEnable(payload);
      set({ feeDiscountEnable: data || {} });
    },

    async getUserFutureFee() {
      if (!bootConfig._SITE_CONFIG_.functions.futures) {
        return;
      }
      const { data } = await services.getUserFutureFee({ symbol: 'XBTUSDTM' });
      set({
        futureFee: {
          ...data,
        },
      });
    },

    async pullAssetDetail({ balanceCurrency }) {
      const { success, data } = await services.getAssetDetail3({
        balanceCurrency: balanceCurrency || 'USDT',
      });
      if (success) {
        const { subOverLimit } = data;
        if (subOverLimit) {
          await get().getLargeSubsAssets?.({ balanceCurrency: balanceCurrency || 'USDT' });
        } else {
          set({ assetDetail: data });
        }
      }
    },

    async getIsDeposit() {
      const { data: isDeposit } = await services.getIsDeposit();
      set({ isDeposit });
      return isDeposit;
    },

    async getLargeSubsAssets({ balanceCurrency }) {
      try {
        set({ getSubAssetsLoading: true });
        const { success, data } = await services.getLargeSubAccountsAsset({
          balanceCurrency: balanceCurrency || 'USDT',
        });
        if (success) {
          set({ assetDetail: data });
        }
      } catch (e) {
        console.error(e);
      } finally {
        set({ getSubAssetsLoading: false });
      }
    },

    async pullLangList() {
      const langInfo = await getLangInfo();
      set(langInfo);
    },

    async pullRates({ currencyListData }) {
      const currencyList: string[] = [];
      try {
        let data = currencyListData;
        // 如果有currencyListData， 那么将不再请求接口；
        // 避免项目和header 组件都会请求该数据
        if (!currencyListData) {
          const result = await services.getRates();
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
      set({
        // TODO: 前端临时过滤货币，后期需要后端提供新接口
        currencyList: getTenantConfig().filterCurrency(currencyList),
      });
    },

    // TODO: check!
    async pullPrices({ currency }) {
      if (checkLastOperateTimestampUnexpired(services.getPrices, 1000)) return;
      const { data } = await services.getPrices(currency);
      set({
        prices: data || {},
      });
    },
    async getManifestSiteList() {
      const start = Date.now();
      const { data, success } = await services.getManifestSiteList();
      const end = Date.now();
      if (success && data && data.sites) {
        const { hostname } = window.location;
        const siteList = data.sites.map(i => {
          if (hostname === i) return { name: i, delay: end - start - delayOffset, isCurrent: true };
          return { name: i };
        });
        set({ siteList });
        // 从数组第1个开始测速
        get().testDomainDelay?.({ index: 0 });
      }
    },

    async testDomainDelay({ index = 0 }) {
      const siteList = get().siteList || [];
      const list = cloneDeep(siteList);
      if (index >= list.length || list[index].delay) return;
      try {
        const start = Date.now();
        const { success } = await services.getManifestSiteList(`https://${list[index].name}/_api`);
        const end = Date.now();
        if (success) list[index].delay = end - start - delayOffset;
        else list[index].delay = 9999;
      } catch (e) {
        list[index].delay = 9999;
      } finally {
        set({ siteList: list });
        // 遍历所有域名
        get().testDomainDelay?.({ index: index + 1 });
      }
    },

    async getUserKcsDiscount() {
      const { data } = await services.checkIsKcsDiscountOn();
      set({ userKcsDiscountStatus: (data || {}).isDeductionEnabled || false });
    },
    async getFeeDeductionConfig() {
      const { data } = await services.getFeeDeductionConfig();
      set({ feeDiscountConfig: data });
    },

    async pullNavigationList(payload) {
      const webNavigation = await getNavigationList(payload);
      set({ webNavigation });
    },
    async queryServiceInfo() {
      const { data } = await services.queryServiceInfo();
      set({ serviceInfo: data });
    },

    async closeService() {
      await services.closeService();
    },
    async pullAreas() {
      if (checkLastOperateTimestampUnexpired('getQuotes', expireDuration)) return;
      // 获取交易市场
      try {
        const { data, success } = await services.getQuotes();
        if (success) {
          let newData = [];
          if (data) {
            newData = data?.level1
              ?.filter(item => item.enabled) // enabled 为 true 表示该分区下有币对
              .map(item => ({
                name: item.concept,
                displayName: item.nameA,
                value: item.concept,
                quotes: [],
              }));
          }
          set({ areas: newData });
        } else {
          resetLastOperateTimestampUnexpired('getQuotes');
        }
      } catch (err) {
        resetLastOperateTimestampUnexpired('getQuotes');
      }
    },

    async pullAreasMargin() {
      if (checkLastOperateTimestampUnexpired('getLeverageMenu', expireDuration)) return;
      // 获取交易市场
      try {
        const { data, success } = await services.getLeverageMenu();
        if (success) {
          let newData = [];
          if (data) {
            newData = data?.leverageMenu?.level1
              ?.filter(item => item.enabled) // enabled 为 true 表示该分区下有币对
              .map(item => ({
                name: item.category,
                value: item.category,
                quotes: [],
              }));
          }
          set({ areasMargin: newData });
        } else {
          resetLastOperateTimestampUnexpired('getLeverageMenu');
        }
      } catch (err) {
        resetLastOperateTimestampUnexpired('getLeverageMenu');
      }
    },

    async pullConfigs() {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = await services.pullConfigs();
      // 二次阻断，防止请求结果覆盖下方pullConfigsByUser的结果
      if (success && !effectsCount.pullConfigsByUser) {
        set({ configs: data });
      }
    },
    // 杠杆白名单倍率
    async pullConfigsByUser() {
      if (effectsCount.pullConfigsByUser) return;
      const { success, data } = await services.pullConfigsByUser();
      if (success) {
        effectsCount.pullConfigsByUser = 1;
        set({ configs: data });
      }
    },

    // 获取所有杠杆交易对
    async pullMarginSymbols() {
      if (checkLastOperateTimestampUnexpired('getMarginSymbols', expireDuration)) return;
      try {
        const { data, success } = await services.getMarginSymbols();
        if (success) {
          const marginSymbolsMap = {};
          const marginSymbols = map(data, item => {
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
          set({
            marginSymbols,
            marginSymbolsMap,
            marginSymbolsOrigin: data,
          });
        } else {
          resetLastOperateTimestampUnexpired('getMarginSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('getMarginSymbols');
      }
    },

    async pullSymbols() {
      if (checkLastOperateTimestampUnexpired('pullSymbols', expireDuration)) return;
      try {
        const { success, data } = await services.pullSymbols({});
        if (success) {
          const records = data.map(item => {
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
          records.forEach(val => {
            symbolsMap[val.code] = val;
          });
          set({
            symbols: records,
            symbolsMap,
          });
        } else {
          resetLastOperateTimestampUnexpired('pullSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('pullSymbols');
      }
    },

    // 所有合约交易对
    async pullFuturesSymbols() {
      if (!bootConfig._SITE_CONFIG_.functions.futures) {
        return;
      }
      if (checkLastOperateTimestampUnexpired('pullFuturesSymbols', expireDuration)) return;
      try {
        const { data, success } = await services.pullFuturesSymbols();
        if (success) {
          const formatData = map(data, item => {
            const { baseCurrency, type, settleDate, quoteCurrency, isInverse, symbol, imgUrl } = item;
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
          set({ futuresSymbols: formatData || [] });
        } else {
          resetLastOperateTimestampUnexpired('pullFuturesSymbols');
        }
      } catch (error) {
        resetLastOperateTimestampUnexpired('pullFuturesSymbols');
      }
    },

    // 合约分区
    async pullTradeAreaList() {
      try {
        if (!bootConfig._SITE_CONFIG_.functions.futures) {
          return;
        }
        const { data, success } = await services.pullFuturesAreaList();
        // USDS COIN_BASE
        if (success && data) {
          const futuresArea = data.find(i => i.name === 'USDS')?.children || [];
          const futuresCoinQuotes = data.find(i => i.name === 'COIN_BASE')?.quotes || [];
          set({
            futuresArea,
            futuresCoinQuotes,
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async getCoinsCategory() {
      if (checkLastOperateTimestampUnexpired('getCoinsCategory', expireDuration)) return;
      try {
        const { data, success } = await services.getCoinsCategory();
        if (success) {
          const map = {};
          if (data?.kucoin?.length) {
            data.kucoin.forEach(item => {
              item.precision = parseInt(item.precision || maxPrecision, 10);
              precision(item.coin, item.precision);
              map[item.currency] = {
                key: item.currency,
                iconUrl: item.iconUrl,
                currencyName: item.currencyName,
              };
            });
          }
          // TODO: 没有该 effect ?
          // get().reset(map);
          set({ coinsCategorys: map });
        } else {
          resetLastOperateTimestampUnexpired('getCoinsCategory');
        }
      } catch (e) {
        resetLastOperateTimestampUnexpired('getCoinsCategory');
      }
    },

    // 获取用户自选交易对
    async getUserFavSymbols() {
      if (checkLastOperateTimestampUnexpired('getUserFavSymbols', 30 * 1000)) return;
      try {
        const { data, success } = await services.getUserFavSymbols();
        if (success) {
          set({ favSymbols: data || [] });
        } else {
          resetLastOperateTimestampUnexpired('getUserFavSymbols');
        }
        // TODO: 需要改造
        // yield take('getUserFavSymbols/@@end');
      } catch (e) {
        resetLastOperateTimestampUnexpired('getUserFavSymbols');
      }
    },

    // 全局搜索
    async searchWeb(payload) {
      const { data, success } = await services.search(payload);
      if (success) {
        const spotList: any = [];
        const futuresList: any = [];
        const earnList: any = [];
        const web3List: any = [];
        const alphaList: any = [];
        forEach(data, item => {
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
          if (resourceType === 'ALPHA') {
            alphaList.push(item);
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
        if (alphaList.length > 100) {
          alphaList.splice(100);
        }
        set({
          spotList,
          futuresList,
          earnList,
          web3List,
          alphaList,
          searchList: data || [],
          searchSessionId: Date.now(),
          searchWords: payload.keyword,
        });
        return data;
      }
      return [];
    },
    // 现货热搜
    async recommendSpot() {
      const { data, success } = await services.recommendSpot();
      if (success) {
        set({ hotRecommend: data });
      }
    },
    // 理财现货合约推荐聚合
    async recommendAggregated() {
      const { data, success } = await services.recommendAggregated();
      if (success) {
        set({ aggregatedRecommend: data });
      }
    },
    // 是否是合伙人查询
    async getIsPartner() {
      try {
        const { data, success } = await services.isPartner();
        const newData = {
          inviterIsAffiliate: data.inviterIsAffiliate, // 当前用户的上级是否是合伙人
          isPartner: data.affiliate, // 当前用户是否是合伙人
        };
        if (success) {
          set({
            ...newData,
          });
        } else {
          set({
            isPartner: false,
            inviterIsAffiliate: false,
          });
        }
      } catch (error) {
        // 遇到error就设置为false
        set({
          isPartner: false,
          inviterIsAffiliate: false,
        });
      }
    },
    async getKycStatusDisplayInfo() {
      // 5秒节流
      if (checkLastOperateTimestampUnexpired('getKycStatusDisplayInfo')) return;
      const { data } = await services.getKycStatusDisplayInfo();
      set({ kycStatusDisplayInfo: data });
    },
    async changeTheme(payload) {
      try {
        await services.setCookies([{ name: 'kc_theme', value: payload.theme }]);
      } catch (e) {
        captureThemeError(`set theme cookie failed - ${JSON.stringify(e)}`);
      }
    },
    async pullKCSRights() {
      const isLoaded = get().KCSRights.isLoaded;
      if (isLoaded) {
        return;
      }
      try {
        const { data, success, msg } = await services.pullKCSRights();
        if (success) {
          const { kcsLevel, kcsLevelDesc, kcsLevelIcon } = data ?? {};
          set({
            KCSRights: {
              data: { kcsLevel, kcsLevelDesc, kcsLevelIcon } as any,
              isLoaded: true,
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
    async getBotLists() {
      const oldMachineMap = get().machineMap;
      if (!isEmpty(oldMachineMap)) return oldMachineMap;

      try {
        const { data: machine } = await services.getBotLists();

        const machineMap = {};
        machine?.forEach(m => {
          machineMap[m.type] = m;
        });

        set({ machineMap });
        return machineMap;
      } catch (error) {
        console.log(error);
        return oldMachineMap;
      }
    },
  }));
};

export const { StoreProvider: HeaderStoreProvider, useStoreValue: useHeaderStore } = createStoreProvider<
  HeaderState & HeaderActions
>('HeaderComponentStore', createHeaderStore, defaultHeaderState);
