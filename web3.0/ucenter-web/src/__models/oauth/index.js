/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import { forEach } from 'lodash';
import qs from 'qs';
import { authCheck, authCode, getInvitationCodeByBrokerName, getLangList } from 'services/oauth';
import { addLangToPath } from 'tools/i18n';

export default extend(base, {
  namespace: 'oauth',
  state: {
    // 邀请码
    invitationCode: '',
    langList: [],
    langListMap: {},
  },
  effects: {
    *authCodeJump({ payload }) {
      let host = '/';
      if (!_DEV_) {
        host = window.location.origin;
      } else {
        host = 'https://nginx-web-01.dev.kucoin.net';
      }
      const url = `${host}/_oauth/v2/auth-code`;
      let queryStr = qs.stringify(payload) || '';
      if (queryStr) {
        if (url.indexOf('?') === -1) {
          queryStr = `?${queryStr}`;
        } else {
          queryStr = `&${queryStr}`;
        }
      }
      window.location.href = addLangToPath(`${url}${queryStr}`);
    },

    *authCode({ payload }, { call }) {
      return yield call(authCode, payload);
    },

    *authCheck({ payload }, { call }) {
      return yield call(authCheck, payload);
    },

    *pullLangList(_, { call, put }) {
      try {
        const { data } = yield call(getLangList);
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

    *getInvitationCodeByBrokerName({ payload }, { call, put }) {
      try {
        const res = yield call(getInvitationCodeByBrokerName, payload);
        yield put({
          type: 'update',
          payload: {
            invitationCode: res?.data || '',
          },
        });
      } catch (err) {
        console.error('err..', err);
      }
    },
  },
});
