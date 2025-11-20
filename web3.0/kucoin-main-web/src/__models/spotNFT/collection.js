/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import moment from 'moment';
import {
  getMyNFTList,
  getMysteryBoxList,
  getTradeRecords,
  getWalletWxIdBrowserAddr,
  getWithDrawRecords,
  openMysteryBox,
} from 'services/spotNFT';
import { withdrawCoin } from 'services/withdraw';

const diff = 6; // 查询6个月内信息 需注意
const startAt = moment(
  `${moment()?.subtract(diff, 'month')?.format('YYYY-MM-DD')} 00:00:00`,
)?.valueOf();
const endAt = moment(`${moment()?.format('YYYY-MM-DD')} 23:59:59`)?.valueOf();

export default extend(base, {
  namespace: 'spot_nft_collection',
  state: {
    collectionsInfo: {
      data: [],
      loadedData: [],
      page: 1,
      total: 0,
    },
    mysteryBoxRecords: {
      data: [],
      loadedData: [],
      page: 1,
      total: 0,
    },
    tradeRecords: {
      data: [],
      loadedData: [],
      page: 1,
      total: 0,
    },
    withDrawRecords: {
      data: [],
      loadedData: [],
      page: 1,
      total: 0,
    },
  },
  effects: {
    *queryMyNFT({ payload = {} }, { put, call, select }) {
      const pageSize = 10;
      const { collectionsInfo } = yield select((state) => state.spot_nft_collection);
      const { loadedData, page: lastPage } = collectionsInfo;
      const { page = 1 } = payload;
      const { items, currentPage, totalNum } = yield call(getMyNFTList, {
        startAt,
        endAt,
        page,
        pageSize,
      });
      let newLoadedData = [...loadedData];
      // 需要处理一下之前的数据，当传入page为1的时候也能触发这里的逻辑
      if (currentPage <= lastPage) {
        newLoadedData = newLoadedData.slice(0, (currentPage - 1) * pageSize);
      }
      newLoadedData = newLoadedData.concat(items);
      yield put({
        type: 'update',
        payload: {
          collectionsInfo: {
            data: items,
            page: currentPage,
            total: totalNum,
            loadedData: newLoadedData,
          },
        },
      });
    },
    *queryMysteryBox({ payload = {} }, { put, call, select }) {
      const pageSize = 10;
      const { mysteryBoxRecords } = yield select((state) => state.spot_nft_collection);
      const { loadedData, page: lastPage } = mysteryBoxRecords;
      const { page = 1 } = payload;
      const { items, currentPage, totalNum } = yield call(getMysteryBoxList, {
        startAt,
        endAt,
        page,
        size: pageSize,
      });
      let newLoadedData = [...loadedData];
      // 需要处理一下之前的数据，当传入page为1的时候也能触发这里的逻辑
      if (currentPage <= lastPage) {
        newLoadedData = newLoadedData.slice(0, (currentPage - 1) * pageSize);
      }
      newLoadedData = newLoadedData.concat(items);
      yield put({
        type: 'update',
        payload: {
          mysteryBoxRecords: {
            data: items,
            page: currentPage,
            total: totalNum,
            loadedData: newLoadedData,
          },
        },
      });
    },
    *queryTradeRecords({ payload = {} }, { put, call, select }) {
      const pageSize = 10;
      const { tradeRecords } = yield select((state) => state.spot_nft_collection);
      const { loadedData, page: lastPage } = tradeRecords;
      const { pageNumber = 1 } = payload;
      const { items, currentPage, totalNum } = yield call(getTradeRecords, {
        pageNumber,
        pageSize,
      });
      let newLoadedData = [...loadedData];
      // 需要处理一下之前的数据，当传入page为1的时候也能触发这里的逻辑
      if (currentPage <= lastPage) {
        newLoadedData = newLoadedData.slice(0, (currentPage - 1) * pageSize);
      }
      newLoadedData = newLoadedData.concat(items);
      yield put({
        type: 'update',
        payload: {
          tradeRecords: {
            data: items,
            page: currentPage,
            total: totalNum,
            loadedData: newLoadedData,
          },
        },
      });
    },
    *queryWithDrawRecords({ payload = {} }, { put, call, select }) {
      const pageSize = 10;
      const { withDrawRecords } = yield select((state) => state.spot_nft_collection);
      const { loadedData, page: lastPage } = withDrawRecords;
      const { page = 1 } = payload;
      const { items, currentPage, totalNum } = yield call(getWithDrawRecords, {
        startAt,
        endAt,
        page,
        pageSize,
        currency: 'SPOTNFT', // 当前只有一个类别（现货nft），后续有变动需要后端加字段
      });
      let newLoadedData = [...loadedData];
      // 需要处理一下之前的数据，当传入page为1的时候也能触发这里的逻辑
      if (currentPage <= lastPage) {
        newLoadedData = newLoadedData.slice(0, (currentPage - 1) * pageSize);
      }
      newLoadedData = newLoadedData.concat(items);
      yield put({
        type: 'update',
        payload: {
          withDrawRecords: {
            data: items,
            page: currentPage,
            total: totalNum,
            loadedData: newLoadedData,
          },
        },
      });
    },
    *setDataToPageOne({ payload }, { put, select }) {
      const pageSize = 10;
      const { dataType } = payload;
      const collection = yield select((state) => state.spot_nft_collection);
      const targetData = collection[dataType];
      const { loadedData } = targetData;
      const _newData = loadedData.slice(0, pageSize);
      yield put({
        type: 'update',
        payload: {
          [dataType]: {
            ...targetData,
            page: 1,
            data: _newData,
            loadedData: [..._newData],
          },
        },
      });
    },
    *withdraw({ payload = {} }, { call }) {
      try {
        return yield call(withdrawCoin, {
          ...payload,
        });
      } catch (e) {
        return e;
      }
    },
    *getWalletWxIdBrowserAddr({ payload }, { call }) {
      return yield call(getWalletWxIdBrowserAddr, {
        ...payload,
      });
    },
    *openMysteryBox({ payload }, { call }) {
      return yield call(openMysteryBox, {
        ...payload,
      });
    },
    *updateMysteryBoxItem({ payload }, { put, select }) {
      const { mysteryBoxRecords } = yield select((state) => state.spot_nft_collection);
      const { data, loadedData } = mysteryBoxRecords;
      const newData = [...data];
      const newLoadedData = [...loadedData];
      const { index, loadedIndex, newItem } = payload;
      newData[index] = {
        ...newData[index],
        ...newItem,
      };
      newLoadedData[loadedIndex] = {
        ...newLoadedData[loadedIndex],
        ...newItem,
      };
      yield put({
        type: 'update',
        payload: {
          mysteryBoxRecords: {
            ...mysteryBoxRecords,
            data: newData,
            loadedData: newLoadedData,
          },
        },
      });
    },
  },
});
