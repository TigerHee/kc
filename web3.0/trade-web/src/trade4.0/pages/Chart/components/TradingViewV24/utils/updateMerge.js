/*
 * @Owner: elliott.su@kupotech.com
 */
import storage from '@/pages/Chart/utils/index';
import { setStudyDrawData } from './savedState';
import sentry from '@kc/sentry';
import { maxBy, uniqBy, cloneDeep } from 'lodash';
import { getOriginSymbolForKlineSymbol } from '../Header/PriceSelect/hooks';


// 处理画线指标思路：根据时间戳，取最新的一个指标作为基准，其他的指标charts[0].panes[0].sources/rightAxisesState 根据id和type，聚合到一起
const getGroupedChartData = () => {
    const groups = [];
    Object.keys(localStorage).forEach((i) => {
        if (/tradingview.saveChartData/.test(i)) {
            const dataStr = localStorage.getItem(i);
            if (dataStr) {
                const data = JSON.parse(dataStr);
                // 过滤掉key的币对，与state里的symbol做对比
                if (data.panes && data.panes?.[0]?.sources?.length) {
                    try {
                        groups.push(filterKeyMatchChartData(i, data));
                    } catch (error) {
                        sentry.captureEvent({
                            message: `Kline localstorage old key sources filter error: ${error || '-'} | key: ${i} / ${JSON.stringify(data.panes[0].sources)}`,
                            level: 'warning',
                            tags: {
                                fatal_type: 'kLine',
                            },
                        });
                    }
                }
            }
        }
    });
    if (!groups.length) {
        return [];
    }
    // 当前最新的指标
    const latestPane = maxBy(groups, 'createTime');
    // 剩余的指标
    const remainPanes = groups.filter(e => e.createTime !== latestPane.createTime);
    // 合并剩余的指标 panes[0].sources/rightAxisesState
    const sources = [];
    remainPanes.forEach(items => {
        items.panes[0].sources.forEach(item => {
            if (!['MainSeries', 'Study'].includes(item.type)) {
                sources.push(item);
            }
        });
    });
    // 合并到最新的指标
    const totalSources = uniqBy([...latestPane.panes[0].sources, ...sources], 'id');
    // 根据id去重
    latestPane.panes[0].sources = totalSources;
    return latestPane.panes;
};

// 清空所有的旧key
const clearAllOldKey = () => {
    Object.keys(localStorage).forEach((i) => {
        if (/tradingview.saveCommonChartData/.test(i) || /tradingview.saveChartData/.test(i)) {
            delete localStorage[i];
        }
    });
};


// 判断tv里的symbol是否属于当前交易对，spot/margin :BTC-USDT格式，合约标记价格指数价格最新价格
const matchTvSymbol = (tvSymbol) => {
    if (!tvSymbol) {
        return tvSymbol;
    }
    // 现货格式
    if (tvSymbol.indexOf(':') > -1) {
        return tvSymbol.split(':')[1];
    }
    // 合约格式
    return getOriginSymbolForKlineSymbol(tvSymbol);
};

// 过滤掉指标key的币对与source不一致的
const filterKeyMatchChartData = (key, value) => {
    // kc-trade-new.tradingview.saveChartData.BNB-USDT -> BNB-USDT
    const keySplit = key.split('.');
    const keySymbol = keySplit[keySplit.length - 1];
    const storageValue = cloneDeep(value);
    storageValue.panes[0].sources = value.panes[0].sources.filter((item) => {
        const isLine = !['MainSeries', 'Study'].includes(item.type);
        const tvSymbol = item.state?.symbol;
        return !isLine ||
            (isLine && tvSymbol && matchTvSymbol(tvSymbol) === keySymbol);
    });
    return storageValue;
};


// 转化老的缓存数据
// tv保存设置升级，将原来的缓存里tradingview.saveCommonChartData
// + kc-trade-new.tradingview.saveChartData.xxxx
// 合并到新的savedChartData，合并完成后删除旧key
export const transferOldCacheData = () => {
    try {
        // 获取公共key
        const commonChartData = storage.getItem('tradingview.saveCommonChartData');
        if (!commonChartData) {
            return;
        }
        // 获取币种维度的指标key
        const saveChartDataPanes = getGroupedChartData();
        if (!saveChartDataPanes.length) {
            return;
        }
        // 合并
        commonChartData.charts[0].panes = saveChartDataPanes;
        // 替换本地缓存
        setStudyDrawData(commonChartData);
    } catch (error) {
        sentry.captureEvent({
            message: `Kline localstorage old key merge failed: ${error || '-'}`,
            level: 'warning',
            tags: {
                fatal_type: 'kLine',
            },
        });
    }
    // 清空旧缓存
    clearAllOldKey();
};
