/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { getCommunityGroupConfig } from 'src/services/community';

export default extend(base, {
  namespace: 'community',
  state: {
    loading: false,
    // 社群的配置
    communityGroupConfig: [],
    // 移动端切换语言弹框是否开启
    menuVisible: false,
  },
  effects: {
    *queryCommunityGroupConfig({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: {
          loading: true,
        },
      });

      try {
        const { data } = yield call(getCommunityGroupConfig);

        yield put({
          type: 'update',
          payload: {
            loading: false,
            communityGroupConfig: data,
          },
        });
      } catch (err) {
        yield put({
          type: 'update',
          payload: {
            loading: false,
          },
        });
        throw err;
      }
    },
  },
  reducers: {},
});
