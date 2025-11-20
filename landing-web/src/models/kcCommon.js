/**
 * Owner: jesse.shao@kupotech.com
 */
import extend from 'dva-model-extend';
import { isFunction } from 'lodash';
import base from 'utils/common_models/base';
import {
  userSignIn,
  getUserIsSignIn,
  getInvitationCode,
  getNewInvitationCode,
} from 'services/kcCommon';
import * as serv from 'services/kcCommon';
import Toast from 'components/Toast';

const MAX_LEN = 4; //昵称的最大长度
export default extend(base, {
  namespace: 'kcCommon',
  state: {
    showName: '', //展示的昵称
    isSign: false, // 是否报名
    inviteCode: undefined, // 邀请码
    sharePosterVisible: false, // 分享弹窗是否展示
    newShareImg: undefined,  // newShareModal 使用的分享图
    newSharePictures: undefined, // newShareModal 使用的覆盖在分享图上的自定义文案dom生成的svg图片
  },
  effects: {
    //处理header用户昵称展示信息
    *updateUserNick({ payload }, { put, select }) {
      const { maxLen = MAX_LEN, ellipsis = false } = payload || {};
      const { isLogin, user = {} } = yield select((state) => state.user);
      let nick = '';
      if (isLogin && user) {
        //nickname --- email --- phone
        try {
          const { nickname, email, phone, type, subAccount } = user;
          if (nickname) {
            nick = nickname;
          } else if (email) {
            nick = email;
          } else if (phone) {
            nick = phone;
          } else if (type === 3 && subAccount) {
            // 子账号
            nick = subAccount;
          }
          // 统一处理展示长度
          const len = nick.length;
          if (len > maxLen) {
            nick = nick.slice(0, maxLen);
            if (ellipsis) {
              nick += '...';
            }
          }
          // 更新showName
          yield put({
            type: 'update',
            payload: {
              showName: nick,
            },
          });
        } catch (e) {
          console.log(e);
        }
      }
    },
    *goSignUp({ payload, callback }, { call, put }) {
      const res = yield call(userSignIn, payload);
      isFunction(callback) && callback(res);
      if (res.success) {
        // 更新 用户是否 isSignUp
        yield put({
          type: 'getUserIsSignUp',
        });
      }
    },
    *getUserIsSignUp({ payload, callback }, { call, put }) {
      const res = yield call(getUserIsSignIn, payload);
      isFunction(callback) && callback(res);
      if (res.success) {
        // 更新 用户是否 isSignUp
        yield put({
          type: 'update',
          payload: {
            isSign: res.data,
          },
        });
      }
    },
    // 获取邀请码
    *getInviteCode({ payload }, { call, put }) {
      const { isUseNewCode = false } = payload || {};
      if (isUseNewCode) {
        yield put({
          type: 'getNewInviteCode',
        });
        return;
      } else {
        const { data } = yield call(getInvitationCode);
        yield put({
          type: 'update',
          payload: {
            inviteCode: data || undefined,
          },
        });
      }
    },
    *getNewInviteCode(_, { call, put }) {
      const { data } = yield call(getNewInvitationCode);
      yield put({
        type: 'update',
        payload: {
          inviteCode: data || undefined,
        },
      });
    },
    // 获取用户信息-盲盒
    *getUserInfo(_, { call, put }) {
      try {
        const { data } = yield call(serv.getUserInfo);
        yield put({
          type: 'update',
          payload: { userInfo: data },
        });
      } catch (e) {
        const { msg } = e || {};
        Toast({ msg });
      }
    },
    // 开通杠杆业务
    *openMargin({ callBack }, { call, put }) {
      try {
        const { success } = yield call(serv.openMargin);
        if (success) {
          yield put({ type: 'user/pullUser' });
          yield put({ type: 'getUserInfo' });
        }
      } catch (e) {
        const { msg } = e || {};
        Toast({ msg });
      }
      if (callBack) {
        callBack();
      }
    },
    // 开通合约业务: 需先开通用户协议和风险协议
    *openFuture({ callBack }, { call, put }) {
      try {
        yield call(serv.openUser);
        yield call(serv.openRisk);
        yield call(serv.openFuture);
        const { success } = yield call(serv.openFuture);
        if (success) {
          yield put({ type: 'user/pullUser' });
          yield put({ type: 'getUserInfo' });
        }
      } catch (e) {
        const { msg } = e || {};
        Toast({ msg });
      }
      if (callBack) {
        callBack();
      }
    },
    // 领取优惠券
    *getCoupons({ payload }, { call, put }) {
      try {
        const { success } = yield call(serv.getCoupons, payload);
        if (success) {
          yield put({ type: 'getUserInfo' });
        }
      } catch (e) {
        const { msg } = e || {};
        Toast({ msg });
      }
      yield put({ type: 'user/pullUser' });
      yield put({ type: 'getUserInfo' });
    },
  },
});
