/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import base from 'utils/common_models/base';
import { SIGN_TAB_KEY } from 'config';
import * as serv from 'services/register';

const initData = {
  signupVisible: false,
  tabKey: SIGN_TAB_KEY.SIGN_PHONE_TAB_KEY, // 注册tab类型  手机 邮箱
  initEmail: undefined, // 初始的邮箱
  initPhone: undefined, // 初始的手机号
  showBonusImg: false, // 是否展示奖励图片
  bonusImg: null, // 奖励小图片
  redirectSuccessUrl: null, // 注册成功后的跳转路径
  blockId: undefined,
  locationId: undefined,
  drawerSignUpTabKey: 'sign.email.tab',
  drawerSignUpInitEmail: '',
  drawerSignUpInitPhone: '',
  drawerSignUpOpen: false,
};
export default extend(base, {
  namespace: 'register',
  state: initData,
  effects: {
    *rest({ payload = {} }, { put }) {
      yield put({
        type: 'update',
        payload: initData,
      });
    },
    // 获取手续费折扣
    *getDiscount({ payload }, { call, put }) {
      const res = yield call(serv.getDiscount, payload);
      return res;
    },
  },
  reducers: {},
});
