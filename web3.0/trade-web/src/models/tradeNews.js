/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2019-05-23 16:34:25
 * @LastEditTime: 2020-05-11 16:05:24
 * @Description: trade新闻和广告model
 */
// import _ from 'lodash';
import extend from 'dva-model-extend';
import base from 'common/models/base';
import { getAds, getTradeNews } from 'services/homepage';

export default extend(base, {
  namespace: 'tradeNews',
  state: {
    ads: {},
  },
  reducers: {},
  effects: {
    *pullAds({ callback }, { call, put, select }) {
      const lang = yield select(state => state.app.currentLang);
      try {
        const { data } = yield call(getAds, {
          lang,
          ad_position: 'trade-ads',
        });
        yield put({
          type: 'update',
          payload: {
            ads: data,
          },
        });
        if (typeof callback === 'function') {
          callback(data['trade-ads']);
        }
      } catch (e) {
        // Raven.captureException(e);
      }
    },
    *pullNews({ payload = {} }, { call, put }) {
      try {
        // 取消新闻根据交易对处理
        const { symbol, ...rest } = payload;
        const { items } = yield call(getTradeNews, {
          page: 1,
          pageSize: 30,
          noType: 3, // 不展示的资讯类型 3 纯图
          ...rest,
        });
        yield put({
          type: 'update',
          payload: {
            news: items,
          },
        });
      } catch (e) {
        // Raven.captureException(e);
      }
    },
  },
});
