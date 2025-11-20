/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { replace } from 'utils/router';
import { getJobs, getJobCategory } from 'services/jobs';
import _ from 'lodash';
import moment from 'moment';

/**
 * 排序数据
 */
const jobsSort = (list = []) => {
  if (!list || list.length < 1) {
    return [];
  }
  // 先时间线排序
  const MAX = 10000000000;
  const tranNum = (item) => moment(item.publish_time).valueOf() + item.is_spotlight_job * MAX;
  const sortedList = list.sort((a, b) => {
    return tranNum(b) - tranNum(a);
  });
  return sortedList;
};

export default extend(base, {
  namespace: 'jobs',
  state: {
    totalList: [],
    currentList: [],
    currentCount: 0,
    rowsPerPage: 10,
    search: '',
    position: 'all',
    currentPage: 0,
    jobCategory: [],
  },
  effects: {
    *pull({ payload: { position } }, { put, call }) {
      const jobs = yield call(getJobs);
      const newJobs = jobsSort(jobs);
      yield put({
        type: 'update',
        payload: {
          position,
          totalList: newJobs || [],
        },
      });
      yield put({
        type: 'searchJob',
      });
    },
    *resetPage(__, { put }) {
      yield put({
        type: 'update',
        payload: {
          currentPage: 0,
        },
      });
    },
    *positionClick({ payload: { position } }, { put }) {
      yield put({
        type: 'update',
        payload: {
          position,
        },
      });
      yield put({
        type: 'resetPage',
      });
      yield put({
        type: 'searchJob',
      });
    },
    *searchJob(__, { select, put }) {
      const { totalList, position, search } = yield select((state) => state.jobs);
      let currentList = [...totalList];
      if (position !== 'all') {
        currentList = _.filter(totalList, (list) => {
          return String(list.category) === position;
        });
        // 不存在的职位链接跳转到/careers/job-opening
        if (!currentList.length) {
          return replace('/careers/job-opening');
        }
      }
      if (search) {
        currentList = _.filter([...currentList], (list) => {
          return String(list.title).toLowerCase().indexOf(search.toLowerCase()) > -1;
        });
      }
      const currentCount = currentList.length;
      yield put({
        type: 'update',
        payload: { currentList, currentCount },
      });
    },
    *getJobCategory(__, { put, call }) {
      const data = yield call(getJobCategory);
      yield put({
        type: 'update',
        payload: {
          jobCategory: data,
        },
      });
    },
  },
});
