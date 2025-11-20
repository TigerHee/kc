/**
 * Owner: clyne@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';

import { forIn, filter } from 'lodash';
import { delay } from 'redux-saga';

import { trackClick } from 'utils/ga';
import { getSensorsABResult, PAGE_AB_CONFIG } from 'utils/kcsensorsConf';
import storage from 'utils/storage';

import { ABC_CROSS_GRAY } from '@/components/AbnormalBack/constant';
import { MARGIN_MODE_OPENED_STORAGE_KEY } from '@/meta/futures';
import { CROSS_GRAY_SCALE } from '@/meta/futuresSensors/cross';
import { GRAY_SCALE_MAP } from '@/meta/grayScale';
import { CROSS } from '@/pages/Orders/FuturesOrders/NewPosition/config';
import { getCrossGrayScale } from '@/services/futures';

/**
 * 获取model初始化state
 */
const getInitState = () => {
  const ret = {};
  forIn(GRAY_SCALE_MAP, (value, abKey) => {
    const { defaultValue } = value;
    ret[abKey] = storage.sessionGetItem(abKey) || defaultValue;
  });
  return ret;
};

const initialState = getInitState();

export default extend(base, {
  namespace: 'grayScale',
  state: {
    placeholder: '-',
    crossGrey: {},
    crossGreyReady: false, // 灰度接口是否初始化成功
    ...initialState,
  },
  effects: {
    /**
     * 全仓灰度
     */
    *getCrossGrayScale({ payload }, { call, put, select }) {
      try {
        const { symbol } = payload;
        const originCrossGrey = yield select((state) => state.grayScale.crossGrey);
        // 灰度对接
        const { data } = yield call(getCrossGrayScale, payload);
        const { marginModes = [], occupancyMode } = data || {};
        const hasCross = filter(marginModes, (i) => i === CROSS).length > 0;
        if (hasCross) {
          trackClick([CROSS_GRAY_SCALE, '1'], payload);
        }
        yield put({
          type: 'update',
          payload: {
            crossGrey: {
              ...originCrossGrey,
              [symbol]: marginModes,
            },
            crossGreyReady: true,
          },
        });
        yield put({
          type: 'futuresMarginMode/update',
          payload: {
            occupancyMode,
          },
        });
        storage.setItem(MARGIN_MODE_OPENED_STORAGE_KEY, occupancyMode);
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_CROSS_GRAY,
            status: true,
            locationId: '1',
          },
        });
      } catch (e) {
        yield put({
          type: 'futuresCommon/updateCrossAbnormal',
          payload: {
            updateKey: ABC_CROSS_GRAY,
            status: false,
            locationId: '1',
            error: e,
          },
        });
        // 请求灰度失败，直接重置 marginMode
        yield put({
          type: 'futuresMarginMode/update',
          payload: {
            marginModeMap: {},
          },
        });
        throw e;
      }
    },

    /**
     * 获取神策AB
     */
    *pullAB({ payload = {} }, { call, put, select }) {
      const { abKey, count = 1 } = payload;
      const currentValue = yield select((state) => state.grayScale[abKey]);
      try {
        // 获取AB结果

        const ret = yield call(getSensorsABResult, {
          ...PAGE_AB_CONFIG(abKey, GRAY_SCALE_MAP[abKey].defaultValue),
        });
        // 当前缓存值与AB返回一致，不需要更新
        if (ret === currentValue) {
          return;
        }
        // update
        yield put({
          type: 'update',
          payload: {
            [abKey]: ret,
          },
        });
      } catch (e) {
        console.error(e);
        // 异常兜底，5s一次，重试次数小于5则repeat，否则上报异常
        if (count < 5) {
          yield delay(5000);
          yield put({
            type: 'pullAB',
            payload: { abKey, count: count + 1 },
          });
        } else {
          console.error(`"${abKey}"的神策AB获取失败`);
        }
      }
    },
  },
});
