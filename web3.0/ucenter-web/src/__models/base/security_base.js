/**
 * Owner: willen@kupotech.com
 */
/**
 * 使用说明
 *
 * 可以使用该model 扩展，或者使用扩展后的security_new;
 * 1、init 设置当前的bizType,
 * 2、如果需要获取验证码，则调用 sec_get_code，否则不调用
 * 3、验证调用 sec_verify
 *
 *
 * 如果需要更改验证类型，调用 init 或 sec_setVerify_type;
 * 每个调用均返回了其结果
 *
 * Todo 增加事务概念，每次生成一个事务，通过事务id来继续操作，避免反复的重新设置校验类型
 *
 */
import base from 'common/models/base';
import extend from 'dva-model-extend';
import _ from 'lodash';
import * as SecurityService from 'services/security';
import { _t } from 'tools/i18n';
// import { SECURITY_LOGIN_INVALID } from 'codes';
// import { push as routerPush } from 'utils/router';

import { evtEmitter } from 'helper';

const evt = evtEmitter.getEvt();

const isTaking = true;

// dispatch 具柄
let dispatchHandle = null;

/**
 * 获取命名空间
 * @param action
 * @returns {*}
 */
const getSendChannel = (isVoiceSend, sendChannel) => {
  if (isVoiceSend && sendChannel && sendChannel.toLowerCase() === 'my_sms') {
    return 'MY_VOICE';
  }
  if (isVoiceSend && sendChannel && sendChannel.toLowerCase() === 'sms') {
    return 'VOICE';
  }
  return sendChannel;
};

const getNamespace = (action) => {
  return action.split('/')[0];
};

export default extend(base, {
  namespace: 'security',
  state: {
    sec_bizType: '', // 校验的业务
    sec_code: '', // 校验码
    sec_channel: '', // 校验码获取方式  sms/email

    instanceArr: {},
    dispatchHandle: null,
    retryAfterSeconds: 0,
  },
  reducers: {
    sec_clear() {
      return {
        sec_bizType: '',
        sec_code: '',
        sec_channel: '',
      };
    },
  },
  effects: {
    *sec_init({ payload }, { put }) {
      yield put({
        type: 'sec_setVerify_type',
        payload,
      });
    },

    // 设置/修改 校验种类 g2af/sms/email 等，以及相应的bizType
    *sec_setVerify_type({ payload }, { put }) {
      const { bizType, sec_code = '', sec_channel = '' } = payload;
      yield put({
        type: 'update',
        payload: {
          sec_bizType: bizType,
          sec_code,
          sec_channel,
        },
      });
    },

    // 校验
    *sec_verify({ payload, type, clear = true }, { call, put, select }) {
      const namespace = getNamespace(type);
      const { sec_bizType } = yield select((state) => state[namespace]);

      // validationType 目前有 sms / email / google_2fa / my_sms / my_email
      // 其余值请根据业务需要传递
      const {
        validationType,
        validationVal,
        bizType = '',
        id,
        validations = null,
        extraParams = {},
        address = null,
        isVoiceSend = false,
      } = payload;

      let result = null;
      try {
        const _validationType = (getSendChannel(isVoiceSend, validationType) || '').toLowerCase();
        let opts = {
          [`validations[${_validationType}]`]: validationVal,
        };
        if (address) {
          opts.address = address;
        }
        if (validations) {
          opts = Object.keys(validations).reduce((sum, cur) => {
            const _cur = (getSendChannel(isVoiceSend, cur) || '').toLowerCase();
            return { ...sum, [`validations[${_cur}]`]: validations[cur] };
          }, {});
        }
        result = yield call(SecurityService.verify, {
          bizType: bizType || sec_bizType,
          // [`validations[${validationType}]`]: validationVal,
          ...opts,
          ...extraParams,
        });
        // 重置
        if (result && result.code === '200' && clear) {
          yield put({
            type: 'sec_clear',
          });
        }
      } catch (e) {
        result = e;
      }
      if (id) {
        evt.emit(`${id}/verify`, result || {});
      }

      return result;
    },

    // 如果需要发送验证码，调用该方法
    *sec_get_code({ payload, type, silent = false }, { call, put, select }) {
      const namespace = getNamespace(type);
      const { sec_bizType, sec_channel } = yield select((state) => state[namespace]);
      const {
        address,
        channel = '',
        bizType = null,
        id,
        ext = '',
        extraParams = {},
        isVoiceSend = false,
      } = payload;
      const upBiz = (bizType || sec_bizType).toUpperCase();
      let result = null;
      yield put({ type: 'update', payload: { retryAfterSeconds: 0 } });
      try {
        // sendChannel 的允许值
        // GOOGLE_2FA, SMS, EMAIL, MY_SMS, MY_EMAIL,
        // TRADE_PASSWORD, PASSWORD, REAL_NAME, OPTIONAL
        const sendChannel = getSendChannel(isVoiceSend, channel || sec_channel);
        result = yield call(SecurityService.getValidationCode, {
          bizType: bizType || sec_bizType,
          address,
          sendChannel,
          ext,
          ...extraParams,
        });
        const isSuccess = result && result.code === '200';

        const { data: { retryAfterSeconds = 0 } = {} } = result || {};
        if (id && sendChannel) {
          if (['voice', 'my_voice'].includes(sendChannel.toLowerCase())) {
            evt.emit('__VOICE_SEND_SUCCESS__');
          } else {
            evt.emit(id, {
              send: isSuccess,
              bizType: upBiz,
              delay: retryAfterSeconds,
            });
          }
        }
        if (isSuccess) {
          yield put({ type: 'update', payload: { retryAfterSeconds } });
        }
        if (isSuccess && !silent) {
          yield put({
            type: 'app/setToast',
            payload: { type: 'success', message: result.msg || _t('operation.succeed') },
          });
        }
      } catch (e) {
        result = e;
        if (!silent) {
          yield put({
            type: 'app/setToast',
            payload: { type: 'error', message: e.msg || _t('send.failed') },
          });
        }

        evt.emit(id, {
          send: false,
          upBiz,
        });
      }
      return result;
    },

    *watch({ payload, type }, { take, put, select, race }) {
      const { key } = payload;
      const modelName = getNamespace(type);

      while (isTaking) {
        const { getCode, verify } = yield race({
          init: take(`${key}/init`),
          getCode: take(`${key}/getCode`),
          verify: take((action) => {
            return action.type.indexOf(`${key}/verify`) > -1;
          }),
        });
        const { instanceArr } = yield select((state) => state[modelName]);
        const tar = instanceArr[key];
        if (getCode) {
          // const ext = Object.entries(tar.ext).map(v => v.join('=')).join(',');
          const ext = _.entries(tar.ext || {})
            .map((v) => v.join('='))
            .join(',');

          yield put({
            type: 'sec_get_code',
            payload: {
              ...tar.opts,
              extraParams: tar.extraParams,
              id: tar.id,
              ext,
            },
          });
        }
        if (verify) {
          // const code = verify.type.split('/').reverse()[0];
          yield put({
            type: 'sec_verify',
            payload: {
              ...tar.opts,
              // Todo 校验需要根据后端接口重新设定，
              extraParams: tar.extraParams,
              id: tar.id,
            },
          });
        }
      }
    },

    *gen_instance({ payload, type }, { put, select }) {
      const { bizType, sec_code = '', channel = '', validationType = '', handleKey = '' } = payload;
      const namespace = getNamespace(type);

      const { instanceArr } = yield select((state) => state[namespace]);
      const key = handleKey || `${bizType}_${Date.now()}`;

      const inst = {
        id: key,
        opts: {
          bizType,
          sec_code,
          channel,
          validationType,
          validations: null,
          isVoiceSend: false,
        },
        ext: {},
        extraParams: {},
        update(opts = {}, optName = 'opts') {
          inst[optName] = { ...inst[optName], ...opts };
        },
      };

      // 获取验证码
      inst.getCode = () => {
        return dispatchHandle({
          type: `${key}/getCode`,
        });
      };
      // 验证
      inst.verify = () => {
        return dispatchHandle({
          type: `${key}/verify`,
        });
      };
      yield put({
        type: 'watch',
        payload: {
          key,
        },
      });
      yield put({
        type: 'update',
        payload: {
          instanceArr: { ...instanceArr, [key]: inst },
        },
      });
      return inst;

      // return inst;
    },

    *get_instance({ payload, type }, { select }) {
      const { key } = payload;
      const namespace = getNamespace(type);

      const { instanceArr } = yield select((state) => state[namespace]);

      return instanceArr[key];
    },

    *get_verify_type({ payload = {} }, { call }) {
      // const { bizType } = payload;
      let result = null;
      try {
        result = yield call(SecurityService.checkValidations, { ...payload });
      } catch (e) {
        // if (e.code && e.code === SECURITY_LOGIN_INVALID) {
        //   // 登录失效需要重新登录
        //   routerPush('/ucenter/signin');
        // }
        // message.error(e.msg || 'ERROR');
        result = { data: null, error: e };
        throw e; // 交给showError处理
      }
      return result.data;
    },
    *cancellationAccount({ payload = {} }, { call }) {
      let result = null;
      try {
        result = yield call(SecurityService.cancellation, { ...payload });
      } catch (e) {
        result = { data: null, error: e };
        throw e; // 交给showError处理
      }
      return result;
    },
  },
  subscriptions: {
    setUp({ dispatch }) {
      dispatchHandle = dispatch;
    },
  },
});
