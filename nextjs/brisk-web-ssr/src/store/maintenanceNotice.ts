import { getMaintenanceStatusFailBack } from '@/api/maintenanceNotice';
import { maintenanceStatusUsingGet } from '@/api/trade-front';
import { getCurrentLang } from 'kc-next/i18n';
import { get, includes } from 'lodash-es';
import { create } from 'zustand';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isOutOfTimeRange(time: number, rangeList: number[]) {
  if (time < 1) return true;
  const [start, end] = rangeList || [];
  if (!start || !end) return true;
  return time < start || time > end;
}

/**
 * 根据lang从fieldOb取值
 * 例如 fieldObj { "zh_CN": "系统正在维护,请耐心等待","en_US": "System is maintenancing" }
 * lang zh_CN
 * @param {*} fieldObj
 * @param {*} lang
 */
const getFieldValueByLang = (fieldObj = {}, lang = 'zh_CN') => {
  const supportLang = ['zh_CN', 'en_US'];
  const defaultLang = 'en_US';
  const finalLang = includes(supportLang, lang) ? lang : defaultLang;
  return get(fieldObj, finalLang);
};

// 转换停机通知静态json相关字段，与getMaintenanceStatus的返回数据结构保持一致
function convertMaintenanceJSON(jsonData: any = {}, currentLang: string) {
  const { titleList, linkUrlList, linkTextList, ...others } = jsonData || {};
  if (!titleList) return {};
  return {
    ...others,
    title: getFieldValueByLang(titleList, currentLang),
    link: getFieldValueByLang(linkUrlList, currentLang),
    redirectContent: getFieldValueByLang(linkTextList, currentLang),
  };
}

interface MaintenanceNoticeState {
  maintenanceStatus: any; // 停机维护数据，如果对象不为空且maintenance = true说明有停机维护事件
  showMaintenance: boolean; // 用户可手动取消停机维护显示，刷新页面后状态重置
  queryMaintenanceStatus: (payload?: any) => Promise<void>;
  setShowMaintenance: (show: boolean) => void;
}

export const useMaintenanceNoticeStore = create<MaintenanceNoticeState>(
  (set) => ({
    // state
    maintenanceStatus: {},
    showMaintenance: true,

    // actions
    queryMaintenanceStatus: async (payload = {}) => {
      const currentLang = getCurrentLang();

      let maintenanceData: any = null;
      try {
        const { data } = await maintenanceStatusUsingGet(payload);
        // const data = {
        //   startAt: '1523459200000',
        //   endAt: '1723459200000',
        //   allowCancelOrder: true,
        //   cancelStartAt: null,
        //   cancelEndAt: null,
        //   title: 'test',
        //   redirectContent: 'test',
        //   link: 'https://www.kucoin.com',
        //   appNoticeLocation: null,
        //   pcNoticeLocation: ['Index'],
        //   maintenanceScope: null,
        //   symbolList: null,
        //   maintenance: true,
        //   maintenanceV2: true,
        //   mnoticeLocation: null,
        // };
        if (data && data.maintenance !== undefined) maintenanceData = data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        try {
          // 尝试请求静态json, 有可能404
          const { data: rollBackData } = await getMaintenanceStatusFailBack(
            payload
          );
          // 转换json文件相关字段，与getMaintenanceStatus的返回数据结构保持一致
          if (rollBackData && rollBackData.maintenance !== undefined) {
            maintenanceData = convertMaintenanceJSON(rollBackData, currentLang);
            // 计算有效性
            await delay(2000);
            const { startAt, endAt } = maintenanceData;
            const expired = isOutOfTimeRange(Date.now(), [startAt, endAt]);
            if (expired) maintenanceData = {};
          }
        } catch (jsonError) {
          console.error('getMaintenanceStatusFailBack', jsonError);
        }
      }
      if (maintenanceData) {
        if (typeof maintenanceData.maintenanceV2 === 'boolean') {
          maintenanceData.maintenance = maintenanceData.maintenanceV2;
        }
        set({ maintenanceStatus: maintenanceData });
      }
    },

    setShowMaintenance: (show: boolean) => {
      set({ showMaintenance: show });
    },
  })
);
