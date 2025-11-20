/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { MODAL_MAP } from 'src/routes/AffiliateRound2/utils';
import {
  dailyStat,
  assessSchedule,
  statDataOverview,
  rebateDataOverview,
  rebateList,
  exportGenerate,
  exportList,
  affiliateRefreshData,
  exportMsg,
  exportMsgRead,
} from 'services/referral';

export default extend(base, {
  namespace: 'v2Affiliate',
  state: {
    showModalId: '',
    // showModalId: MODAL_MAP.DOWNLOAD_FILE,
    showExportDrawer: false,
    // showExportDrawer: true,
    dailyStat: {},
    assessSchedule: {},
    statDataOverviewData: {},
    rebateDataOverviewData: {},
    rebateFilters: {
      page: 1,
      pageSize: 10,
      orderByType: 'DESC',
      startTime: '',
      endTime: '',
    },
    rebateList: [],
    exportListObj: {},
    // 多次请求全量的list
    exportListAll: [],
    rebateTotal: 0,
    refreshDataList: [],
    exportMsgData: {},
  },
  effects: {
    *dailyStat(action, { put, call }) {
      try {
        const { data } = yield call(dailyStat);
        yield put({
          type: 'update',
          payload: {
            dailyStat: { ...data },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
      }
    },

    *exportGenerate({ payload }, { put, call }) {
      try {
        const res = yield call(exportGenerate, payload);
        return res || {};
      } catch (e) {
        console.log('exportGenerate err:', e);
        if (e?.code !== '900001') {
          yield put({
            type: 'update',
            payload: {
              showModalId: MODAL_MAP.DATAERR,
            },
          });
        }
        return e || {};
      }
    },

    *exportListLazy(action, { put, call, select }) {
      const { exportListAll, exportListObj } = yield select((state) => state.v2Affiliate);
      const rqData = {
        page: 1,
        pageSize: 10,
      };

      if (exportListObj.currentPage) {
        rqData.page = exportListObj.currentPage + 1;
      }

      try {
        const res = yield call(exportList, rqData);
        yield put({
          type: 'update',
          payload: {
            exportListObj: { ...res },
            exportListAll: [...exportListAll, ...(res?.items || [])],
          },
        });
        return res || {};
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
        return e || {};
      }
    },

    *assessSchedule(action, { put, call }) {
      try {
        const { data } = yield call(assessSchedule);
        yield put({
          type: 'update',
          payload: {
            assessSchedule: { ...data },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
      }
    },

    *statDataOverview({ payload }, { put, call }) {
      try {
        const res = yield call(statDataOverview, { ...payload });
        const { data } = res;
        yield put({
          type: 'update',
          payload: {
            statDataOverviewData: { ...data },
          },
        });
        return res || {};
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
        return e || {};
      }
    },

    *rebateDataOverview(action, { put, call }) {
      try {
        const { data } = yield call(rebateDataOverview);
        yield put({
          type: 'update',
          payload: {
            rebateDataOverviewData: { ...data },
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
      }
    },

    *rebateList({ payload }, { put, call, select }) {
      const { rebateFilters } = yield select((state) => state.v2Affiliate);
      try {
        const { items, totalNum } = yield call(rebateList, {
          ...rebateFilters,
          ...payload,
        });
        yield put({
          type: 'update',
          payload: {
            rebateList: items || [],
            rebateTotal: totalNum,
          },
        });
      } catch (e) {
        yield put({
          type: 'update',
          payload: {
            showModalId: MODAL_MAP.DATAERR,
          },
        });
      }
    },

    *affiliateRefreshData({ payload }, { put, call, select }) {
      try {
        const { data } = yield call(affiliateRefreshData, {
          ...payload,
        });
        yield put({
          type: 'update',
          payload: {
            refreshDataList: data || [],
          },
        });
      } catch (e) {}
    },
    // 未读消息
    *exportMsg({ payload }, { put, call, select }) {
      try {
        const { data } = yield call(exportMsg, {
          ...payload,
        });
        yield put({
          type: 'update',
          payload: {
            exportMsgData: data || {},
          },
        });
      } catch (e) {}
    },
    // 读消息
    *exportMsgRead({ payload }, { put, call, select }) {
      try {
        const { data } = yield call(exportMsgRead);
      } catch (e) {}
    },
  },
});
