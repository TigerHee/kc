/**
 * Owner: iron@kupotech.com
 */
import { noop, isArray } from 'lodash';
import { PREFIX, VERIFY_SUCCESS, VERIFY_QUIT, VALIDATE_ERROR } from '../common/constants';
import { getRequiredValidations, sendValidationCode, verifyValidations } from './service';

export const namespace = `${PREFIX}_security_verify`;

const initialState = {
  needVerifyActions: [],
  bizType: null,
  validationCodeLimits: {},
  errors: [],
  errorMsg: '',
};

export default {
  namespace,
  state: initialState,
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    reset(state) {
      return {
        ...state,
        ...initialState,
      };
    },
  },
  effects: {
    *securityVerifyFlow({ payload: { bizType }, afterVerify = noop }, { put, take, select, race }) {
      // 获取需要校验的类型
      yield put({
        type: 'checkSecurity',
        payload: {
          bizType,
        },
      });

      yield take('checkSecurity/@@end');

      const { needVerifyActions } = yield select((state) => state[namespace]);

      if (needVerifyActions.length > 0) {
        // 在校验成功和退出校验之间启动race
        const { success } = yield race({
          success: take(VERIFY_SUCCESS),
          quit: take(VERIFY_QUIT),
        });

        if (success) {
          // 如果消息是验证成功执行回调
          afterVerify(success);
        }
        // 不管成功或者退出都重置needVerifyActions状态
        yield put({
          type: 'reset',
        });
      } else {
        // 不需要校验，执行回调函数
        afterVerify();
      }
    },
    // 检查是否需要校验
    *checkSecurity({ payload: { bizType } }, { put, call }) {
      const { data } = yield call(getRequiredValidations, { bizType });
      if (isArray(data)) {
        const upperCaseData = data.map((group) => {
          const upperCaseGroup = group.map((item) => item.toUpperCase());
          return upperCaseGroup;
        });
        yield put({
          type: 'update',
          payload: {
            needVerifyActions: upperCaseData,
            bizType,
          },
        });
      }
    },
    *sendValidationCode({ payload: { sendChannel } }, { call, select, put }) {
      const { bizType, validationCodeLimits } = yield select((state) => state[namespace]);
      if (bizType) {
        const {
          data: { retryAfterSeconds, retryTimes, maxRetryTimes, needValidate },
        } = yield call(sendValidationCode, { sendChannel, bizType });
        yield put({
          type: 'update',
          payload: {
            validationCodeLimits: {
              ...validationCodeLimits,
              [sendChannel]: {
                retryAfterSeconds,
                retryTimes,
                maxRetryTimes,
                needValidate,
              },
            },
          },
        });
      }
    },
    *verify({ payload }, { call, select, put }) {
      const { bizType } = yield select((state) => state[namespace]);
      try {
        const { data } = yield call(verifyValidations, { bizType, validations: payload });
        yield put({
          type: VERIFY_SUCCESS,
          payload: data,
        });
      } catch (e) {
        const { data, msg, code } = e;
        if (code === VALIDATE_ERROR) {
          yield put({
            type: 'update',
            payload: {
              errorMsg: msg,
              errors: data,
            },
          });
        } else {
          throw e;
        }
      }
    },
  },
};
