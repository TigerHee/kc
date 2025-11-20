/**
 * Owner: iron@kupotech.com
 */
import Http from '@kc/gbiz-base/lib/Http';
import * as services from './service';

const httpTool = Http.create('@kc/kyc');

export default {
  namespace: 'kycDemo',

  state: {},

  effects: {
    *queryUserInfo({ payload }, { call }) {
      const { data } = yield call(services.queryUserInfo, payload);
      httpTool.addParams({ c: data.csrf });
    },
  },

  reducers: {},
};
