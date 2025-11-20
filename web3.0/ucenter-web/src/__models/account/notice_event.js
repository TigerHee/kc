/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import _ from 'lodash';
import { getMaintenanceStatus, getMaintenanceStatusFailBack } from 'services/market';
import { delay } from 'utils/delay';
import getCurrentTime from 'utils/getCurrentTime';
import isOutOfTimeRange from 'utils/isOutOfTimeRange';

// 下面两个方法只在这里用到。不需要放在 helper

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
  const finalLang = _.includes(supportLang, lang) ? lang : defaultLang;
  return _.get(fieldObj, finalLang);
};

// 转换停机通知静态json相关字段，与getMaintenanceStatus的返回数据结构保持一致
function convertMaintenanceJSON(jsonData = {}, currentLang) {
  const { titleList, linkUrlList, linkTextList, ...others } = jsonData || {};
  if (!titleList) return {};
  return {
    ...others,
    title: getFieldValueByLang(titleList, currentLang),
    link: getFieldValueByLang(linkUrlList, currentLang),
    redirectContent: getFieldValueByLang(linkTextList, currentLang),
  };
}

export default extend(base, {
  namespace: 'notice_event',
  state: {
    count: 0, // 未读消息数
    maintenanceStatus: {}, // 停机维护数据，如果对象不为空且maintenance = true说明有停机维护事件
    showMaintenance: true, // 用户可手动取消停机维护显示，刷新页面后状态重置
  },
  reducers: {},
  effects: {
    *queryMaintenanceStatus({ payload = {}, currentLang = 'zh_CN' }, { put, call, select }) {
      let maintenanceData = null;
      try {
        const { data } = yield call(getMaintenanceStatus, payload);
        if (data && data.maintenance !== undefined) maintenanceData = data;
      } catch (e) {
        try {
          // 尝试请求静态json, 有可能404
          const { data: rollBackData } = yield call(getMaintenanceStatusFailBack, payload);
          // 转换json文件相关字段，与getMaintenanceStatus的返回数据结构保持一致
          if (rollBackData && rollBackData.maintenance !== undefined) {
            maintenanceData = convertMaintenanceJSON(rollBackData, currentLang);
            // 计算有效性
            yield call(delay, 2000);
            const { serverTime, requestedLocalTime } = yield select((state) => state.server_time);
            const currentTime = getCurrentTime({
              serverTime,
              requestedLocalTime,
            });
            const { startAt, endAt } = maintenanceData;
            const expired = isOutOfTimeRange(currentTime, [startAt, endAt]);
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
        yield put({
          type: 'update',
          payload: {
            maintenanceStatus: maintenanceData,
          },
        });
      }
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      setTimeout(() => {
        dispatch({
          type: 'server_time/pullServerTime',
        });
      });
    },
  },
});
