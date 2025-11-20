/**
 * Owner: willen@kupotech.com
 */
import extend from 'dva-model-extend';
import { toNumber } from 'lodash';
import base from './base';
import filter from './filter';
import sort from './sort';

/**
 * 分页模型
 */
export default extend(base, filter, sort, {
  state: {
    records: [],
    pagination: false,
  },
  reducers: {
    savePage(
      state,
      { payload: { items, totalNum, currentPage, page, pageSize, pageType, ...others } },
    ) {
      const current = currentPage ? toNumber(currentPage) : toNumber(page);
      const pagination = {
        current, // 当前页数
        total: toNumber(totalNum), // 数据总数
        pageSize: toNumber(pageSize), // 每页条数
      };

      return {
        ...state,
        pagination,
        records: items || [],
        pageType, // 页面类型
        ...others,
      };
    },

    clearPage(state) {
      return {
        ...state,
        pagination: false,
        records: [],
      };
    },
  },
});

export const stepPaginate = {
  state: {
    records: [],
    pagination: false,
  },
  reducers: {
    savePage(state, { payload: { hasMore, offsetIndex, dataList } }) {
      return {
        ...state,
        records: dataList || [],
        pagination: {
          ...state.pagination,
          offsetIndex,
          hasMore,
        },
      };
    },
  },
};
