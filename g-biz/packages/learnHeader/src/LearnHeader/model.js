/**
 * Owner: iron@kupotech.com
 */
import { forEach } from 'lodash';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import * as services from './service';
import { PREFIX } from '../common/constants';
import { addSpmIntoQuery } from '../common/tools';
import { checkLastOperateTimestampUnexpired } from './tools';

export const namespace = `${PREFIX}_learn_header`;

const getClassifyList = (t) => [
  {
    id: 12,
    name: t('iuoTRTcDNqQFVhYQxDQaks'),
    topicsEnglishName: 'trading',
  },
  {
    id: 13,
    name: t('qsuboVmkk9bUaJUPz8gSVp'),
    topicsEnglishName: 'crypto',
  },
  {
    id: 14,
    name: t('2d7SPBLJ1PVE2vQxCUZd1v'),
    topicsEnglishName: 'web3',
  },
  // {
  //   id: 15,
  //   name: t('6if5Yd7jjsbR9ZZyzGMdLQ'),
  //   topicsEnglishName: 'glossary',
  // },
];

const initialValue = {
  langList: [],
  langListMap: {},
  navList: [],
  classifyList: [],
  topicList: [],
  crashCourseList: [],
  currencyList: [],
  prices: {},
};

export default {
  namespace,
  state: initialValue,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *pullLangList(_, { call, put }) {
      try {
        const { data } = yield call(services.getLangList);
        if (data) {
          const langListMap = {};
          forEach(data, (item) => {
            langListMap[item[0]] = {
              lang: item[0],
              langName: item[1],
            };
          });
          yield put({
            type: 'update',
            payload: {
              langList: data,
              langListMap,
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *logout({ payload: { to, spm } = {} }, { call }) {
      const { code } = yield call(services.logout);
      if (code === '200') {
        if (to) {
          window.location.href = addSpmIntoQuery(
            queryPersistence.formatUrlWithStore(`${window.location.origin}${to}`),
            spm,
          );
        } else {
          window.location.reload();
        }
      }
    },
    *getClassify({ payload }, { put, call }) {
      const { data } = yield call(services.getClassify, payload);
      yield put({
        type: 'update',
        payload: {
          navList: data || [],
        },
      });
    },
    *getAllNavItems({ t = (str) => str }, { put, call, all }) {
      const [topicList, crashCourseList] = yield all([
        call(services.getNavItems, { type: 'topic', flag: true }),
        call(services.getNavItems, { type: 'course', flag: true }),
      ]);

      const [classify, course, topic] = yield all([
        call(services.getClassify, {
          classifies: [12, 13, 14].join(','),
        }),
        call(services.getTopic, {
          course: crashCourseList?.map((i) => i?.topicsEnglishName)?.join(','),
        }),
        call(services.getTopic, {
          topics: topicList?.map((i) => i?.topicsEnglishName)?.join(','),
        }),
      ]);
      const classifyList = getClassifyList(t);
      console.log('===', t('iuoTRTcDNqQFVhYQxDQaks'), classifyList);
      yield put({
        type: 'update',
        payload: {
          classifyList: classifyList?.filter((i) => classify?.find((item) => item === i?.id)),
          crashCourseList: crashCourseList?.filter((i) =>
            course?.find((item) => item === i?.topicsEnglishName),
          ),
          topicList: topicList?.filter((i) => topic?.find((item) => item === i?.topicsEnglishName)),
        },
      });
    },
    *pullPrices({ payload: { currency } }, { call, put }) {
      if (checkLastOperateTimestampUnexpired(services.getPrices, 1000)) return;
      const { data } = yield call(services.getPrices, currency);
      yield put({
        type: 'update',
        payload: { prices: data || {} },
      });
    },
  },
};
