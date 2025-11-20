/**
 * Owner: borden@kupotech.com
 */
import extend from 'dva-model-extend';
import { toNumber } from 'lodash';
import base from 'common/models/base';
import filter from 'common/models/filter';
import sort from 'common/models/sort';

/**
 * 分页模型
 */
export default extend(base, filter, sort, {
  state: {
    records: [],
    pagination: false,
  },
  reducers: {
    savePage(state, { payload: { items, totalNum, currentPage, page, pageSize } }) {
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
