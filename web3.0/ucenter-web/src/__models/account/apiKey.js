/**
 * Owner: willen@kupotech.com
 */
import base from 'common/models/base';
import filter from 'common/models/filter';
import { message } from 'components/Toast';
import extend from 'dva-model-extend';
import _ from 'lodash';
import * as serv from 'services/apiKeys2.0';
import { createBrokerApiKey, deleteBrokerApiKey, queryBrokerApiKeyList } from 'services/apiKeys2.0';
import { checkValidations } from 'services/security';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';

export default extend(base, filter, {
  namespace: 'api_key',
  state: {
    filters: {
      bizType: '',
    },
    apiKeys: [], // 普通用户 api key列表
    brokerApiKeys: [], // broker api key列表
    ApiWordModalVisible: false,
    securityModalVisible: false,
    needActions: [],
    ready: false,
    api: null,
    enabledApis: 0,
    isNotice: false,
    nowTab: 'trade',
    addData: {},
    editData: {},
    createSuccessVisible: false,
    createSuccessData: {},
    verifyData: { verifyType: [], bizType: '' },
    detailData: { authGroupMap: {} },
    nowApiKey: '', // 当前操作的apiKey
    nowVerifyId: '', // 当前操作的verifyId
    brokerList: [],
    currentIp: '',
    permissionMap: {}, // API创建时可以点击的
    isKycDialogVisible: false,
    isLeadTraderAccount: false, // 是否有带单权限
    leadTraderApiKeys: [], // 带单 api key 列表
    // 创建带单 api key 的信息，放在这里不与外层的混淆
    leadTradeInfo: {
      currentIp: '',
      needCaptcha: false,
      permissionMap: {},
    },
  },
  reducers: {},
  effects: {
    *pull({ query = {} }, { put, call, select }) {
      const {
        filters: { sub },
        subName,
      } = yield select((state) => state.api_key);
      const { data } = yield call(serv.getApiList, query.sub || sub || subName);
      const newData = data.map((d) => {
        return {
          ...d,
          disabled: true,
          origin_list: d.ipWhitelist,
        };
      });
      const cloneData = _.cloneDeep(newData);
      yield put({
        type: 'update',
        payload: {
          apiKeys: [...newData],
          cloneApiKeys: [...cloneData],
          ready: true,
        },
      });
    },
    *pullBrokerList(__, { put, call, select }) {
      const { data } = yield call(serv.getNameList);
      if (data && data.length > 0) {
        const list = _.map(data, (item) => {
          if (item) {
            return {
              value: item.name,
              label: item.displayName,
            };
          }
        });
        yield put({
          type: 'update',
          payload: {
            brokerList: list,
          },
        });
      }
    },
    *createApi({ payload }, { put, call }) {
      try {
        // eslint-disable-next-line prefer-const
        let { extra: rsaPubKey, passphrase, subName, useType } = payload || {};
        if (!rsaPubKey) {
          // 没有rsaPubKey，单独调接口获取一次
          const { data: _rsaPubKey = '' } = yield call(serv.getRsaPubKey);
          rsaPubKey = _rsaPubKey || '';
        }
        if (passphrase && rsaPubKey) {
          const pubKey = `-----BEGIN PUBLIC KEY-----\n${rsaPubKey}\n-----END PUBLIC KEY-----`;
          const { KJUR, KEYUTIL, hextob64 } = yield import('jsrsasign');
          const pub = KEYUTIL.getKey(pubKey);
          const enc = KJUR.crypto.Cipher.encrypt(passphrase, pub);
          const _passphrase = enc ? hextob64(enc) : '';
          if (_passphrase) {
            payload.passphrase = _passphrase;
          }
        }

        const result = yield call(
          useType === 'broker' ? createBrokerApiKey : serv.createAPI,
          payload,
        );

        const { data } = result || {};
        message.success(_t('operation.succeed'));
        if (subName) {
          // 子账号创建
          yield put({
            type: 'update',
            payload: { createSuccessData: data || {} },
          });
          yield put({
            type: 'showCreateSuccess',
            payload,
          });
        } else {
          // 创建api激活流程更改
          // 创建状态，可能存在值success - 成功 | verify - 需要邮件授权 | failed - 失败 | expired - 过期，后两种状态只会出现在被风控需要邮件授权的情况下
          const { apiKey, verifyId, status, isActivated } = data || {};
          if (apiKey) {
            yield put({
              type: 'update',
              payload: {
                nowApiKey: apiKey,
              },
            });
          }

          if (status === 'success') {
            // 需判断是否需要激活
            if (isActivated === false) {
              push('/account/api/activation');
            } else {
              yield put({
                type: 'update',
                payload: { createSuccessData: { ...data, useType } || {} },
              });
              yield put({
                type: 'showCreateSuccess',
                payload,
              });
            }
          } else if (status === 'verify') {
            if (verifyId) {
              yield put({
                type: 'update',
                payload: {
                  nowVerifyId: verifyId,
                },
              });
              push(`/account/api/verify/${verifyId}`);
            }
          } else {
            message.error('Failed to create API. Please contact customer service for solution');
          }
        }
        return result;
      } catch (e) {
        if (e?.code === '400303') {
          yield put({
            type: 'update',
            payload: {
              isKycDialogVisible: true,
            },
          });
        } else {
          message.error(e?.msg || '');
        }

        return {
          success: false,
          code: e?.code || '',
          msg: e.msg || '',
        };
      }
    },
    *closeApiWordModal(action, { put }) {
      yield put({
        type: 'update',
        payload: {
          ApiWordModalVisible: false,
        },
      });
    },
    *updateApi({ payload }, { call }) {
      const { subName, brokerId, isLeadTradeApi } = payload;
      // 处理brokerId， 为null时后端会报错
      if (!brokerId) {
        delete payload.brokerId;
      }
      yield call(serv.updateAPI, payload);
      message.success(_t('operation.succeed'));
      // 带单 api key 本质上是子账号的，但业务需要其在母账号页面展示，所以成功后也是跳回母账号页面
      const url =
        !isLeadTradeApi && subName ? `/account-sub/api-manager/${subName}` : '/account/api';
      push(url);
    },
    *deleteApi({ payload: { id, subName, isLeadTradeApi } }, { put, call }) {
      try {
        yield call(serv.deleteAPI, { id, subName });
        message.success(_t('operation.succeed'));
      } finally {
        yield put({
          type: isLeadTradeApi ? 'pullLeadTradeApiList' : 'pull',
        });
      }
    },
    *checkIsSecurity({ payload = {} }, { put, call, select }) {
      const { filters, subName } = yield select((state) => state.api_key);
      const { sub } = filters;
      const { bizType } = filters;
      const { query = {} } = payload;
      let realBiz = bizType;
      const isSubApi = query.sub || sub || subName;
      const bizMap = {
        UPDATE_API: 'UPDATE_SUB_ACCOUNT_API',
        CREATE_API: 'CREATE_SUB_ACCOUNT_API',
      };

      if (isSubApi) {
        realBiz = bizMap[bizType];
      }

      if (isSubApi) {
        // realBiz = isSubApi ? 'CREATE_SUB_ACCOUNT_API' : 'CREATE_API';
        yield put({
          type: 'filter',
          payload: {
            bizType: realBiz,
          },
        });
        // console.log('CREATE_SUB_ACCOUNT_API');
      }

      let isSecurity = false;
      try {
        // const { bizType } = yield select(state => state.api_key.filters);
        const { data } = yield call(checkValidations, {
          bizType: realBiz,
        });
        let securityModalVisible = false;
        if (data && data.length) {
          securityModalVisible = true;
          isSecurity = false;
        } else {
          securityModalVisible = false;
          isSecurity = true;
        }
        yield put({
          type: 'update',
          payload: {
            needActions: [...data],
            ApiWordModalVisible: false,
            securityModalVisible,
          },
        });
      } finally {
        if (isSecurity) {
          yield put({
            type: 'securitySuccess',
          });
        }
      }
    },
    *checkResult({ payload }, { put }) {
      const { extra = '' } = payload || {};
      yield put({
        type: 'update',
        payload: {
          securityModalVisible: false,
          needActions: [],
        },
      });
      yield put({
        type: 'securitySuccess',
        payload: {
          rsaPubKey: extra || '',
        },
      });
    },
    *securitySuccess({ payload }, { put, call, select }) {
      const {
        filters: { bizType, api, sub, step = '', idx = 0 },
        subName,
      } = yield select((state) => state.api_key);
      let { rsaPubKey = '' } = payload || {};
      if (bizType === 'CREATE_API' || bizType === 'CREATE_SUB_ACCOUNT_API') {
        const _payload = {
          ...api,
          subName: sub || subName,
        };
        if (!rsaPubKey) {
          // 没有rsaPubKey，单独调接口获取一次
          const { data: _rsaPubKey = '' } = yield call(serv.getRsaPubKey);
          rsaPubKey = _rsaPubKey || '';
        }
        const { passphrase = '' } = api || {};
        if (passphrase && rsaPubKey) {
          const pubKey = `-----BEGIN PUBLIC KEY-----\n${rsaPubKey}\n-----END PUBLIC KEY-----`;
          const { KJUR, hextob64, KEYUTIL } = yield import('jsrsasign');
          const pub = KEYUTIL.getKey(pubKey);
          const enc = KJUR.crypto.Cipher.encrypt(passphrase, pub);
          _payload.passphrase = enc ? hextob64(enc) : '';
          // _payload.version = 2;
        }
        yield put({
          type: 'createApi',
          payload: _payload,
        });
      } else if (bizType === 'UPDATE_API' || bizType === 'UPDATE_SUB_ACCOUNT_API') {
        if (step === 'step1') {
          const now = api[idx || 0] || {};
          const { apiKey = '' } = now;
          const { data = {} } = yield call(serv.getAPIDetail, { apiKey, subName: sub || subName });
          api[idx || 0] = {
            ...now,
            ...data,
          };
          yield put({
            type: 'update',
            payload: {
              apiKeys: [...api],
            },
          });
        } else {
          yield put({
            type: 'updateApi',
            payload: {
              ...api,
              subName: sub || subName,
            },
          });
        }
      }
    },
    *getCreateInfo({ payload: { subName } }, { call, put }) {
      const { success, data } = yield call(serv.getCreateInfo, { subName });
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            currentIp: data.currentIp,
            needCaptcha: data.needCaptcha,
            permissionMap: data.permissionMap || {},
          },
        });
      }
    },
    *getEnabledApi(action, { call, put }) {
      const result = yield call(serv.getEnabledApi);
      yield put({
        type: 'update',
        payload: {
          enabledApis: result.data,
        },
      });
    },
    *getApiIpNoticeStatus(__, { put, call }) {
      const { data } = yield call(serv.getApiIpNoticeStatus);
      yield put({
        type: 'update',
        payload: {
          isNotice: data,
        },
      });
    },
    *updateApiIpNoticeStatus({ payload: { isNotice } }, { put, call }) {
      try {
        yield call(serv.updateApiIpNoticeStatus, { isNotice });
      } finally {
        yield put({
          type: 'getApiIpNoticeStatus',
        });
      }
    },
    *cacheAddData({ payload }, { put }) {
      yield put({
        type: 'update',
        payload: {
          addData: { ...payload },
        },
      });
    },
    // 打开成功弹窗
    *showCreateSuccess(a, { put }) {
      yield put({
        type: 'update',
        payload: {
          createSuccessVisible: true,
        },
      });
    },
    // 关闭成功弹窗
    *closeCreateSuccess(a, { put }) {
      yield put({
        type: 'update',
        payload: {
          createSuccessVisible: false,
        },
      });
    },
    // 验证页面的数据
    *cacheVerifyData({ payload }, { put }) {
      yield put({ type: 'update', payload: { verifyData: { ...payload } } });
    },
    // 编辑器api时获取api详情
    *getApiDetail({ payload: { apiKey, subName } }, { put, call }) {
      try {
        const { data = {} } = yield call(serv.getAPIDetail, { apiKey, subName });
        const _data = { ...data };
        const { authGroupMap } = data || {};
        if (!authGroupMap || !authGroupMap.API_COMMON) {
          _data.authGroupMap = {};
          _data.authGroupMap.API_COMMON = true;
        }
        yield put({
          type: 'update',
          payload: {
            detailData: _data,
          },
        });
        return { success: true, data };
      } catch (e) {
        return {
          success: false,
          msg: e.msg || '',
        };
      }
    },
    *sendActivationEmail({ payload }, { put, call, select }) {
      let _apiKey = '';
      const { apiKey } = payload || {};
      if (apiKey) {
        _apiKey = apiKey;
        yield put({
          type: 'update',
          payload: {
            nowApiKey: apiKey,
          },
        });
      } else {
        const { nowApiKey } = yield select((state) => state.api_key);
        _apiKey = nowApiKey;
      }
      if (_apiKey) {
        const { success } = yield call(serv.activateEmail, { apiKey: _apiKey });
        if (success) {
          message.success(_t('sepa.recharge.email.success.tips'));
        }
      }
    },
    *goActivation({ payload }, { put, call }) {
      const { token } = payload || {};
      if (token) {
        // 去激活
        const { success, data } = yield call(serv.goActivate, { token });
        if (success && data) {
          // 激活成功
          yield put({
            type: 'update',
            payload: { createSuccessData: data || {} },
          });
          yield put({
            type: 'showCreateSuccess',
          });
        }
      }
    },
    *sendVerifyEmail({ payload }, { put, call, select }) {
      let _verifyId = '';
      const { verifyId } = payload || {};
      if (verifyId) {
        _verifyId = verifyId;
        yield put({
          type: 'update',
          payload: {
            nowVerifyId: verifyId,
          },
        });
      } else {
        const { nowVerifyId } = yield select((state) => state.api_key);
        _verifyId = nowVerifyId;
      }
      if (_verifyId) {
        const { success } = yield call(serv.resendVerifyEmail, { verifyId: _verifyId });
        if (success) {
          message.success(_t('sepa.recharge.email.success.tips'));
        }
      }
    },
    *verifyEmail({ payload }, { put, call }) {
      const { token } = payload || {};
      if (token) {
        // 去授权
        const { success, data } = yield call(serv.verifyEmail, { verifyToken: token });
        if (success && data) {
          if (data.status !== 'success') {
            message.error('Failed to create API. Please contact customer service for solution');
          } else {
            // 授权成功
            yield put({
              type: 'update',
              payload: { createSuccessData: data || {} },
            });
            yield put({
              type: 'showCreateSuccess',
            });
          }
        }
      }
    },
    *queryBrokerApiKeyList({ payload }, { put, call }) {
      const { data } = yield call(queryBrokerApiKeyList);
      yield put({ type: 'update', payload: { brokerApiKeys: data || [] } });
    },

    *deleteBrokerApiKey({ payload }, { put, call }) {
      yield call(deleteBrokerApiKey, payload);
      // 删除成功重新拉列表
      yield put({ type: 'queryBrokerApiKeyList' });
    },
    /** 是否有带单权限 */
    *pullIsLeadTraderAccount(_, { call, put }) {
      const res = yield call(serv.pullIsLeadTraderAccount);
      if (res.success) {
        const isLeadTraderAccount = res.data ?? false;
        yield put({
          type: 'update',
          payload: { isLeadTraderAccount },
        });
        return isLeadTraderAccount;
      }
    },
    /** 拉取带单 api key 列表 */
    *pullLeadTradeApiList(_, { put, call }) {
      const { data } = yield call(serv.getLeadTradeApiList);
      yield put({
        type: 'update',
        payload: {
          leadTraderApiKeys:
            data?.map?.((d) => {
              return {
                ...d,
                disabled: true,
                origin_list: d.ipWhitelist,
              };
            }) ?? [],
          ready: true,
        },
      });
    },
    /** 拉取创建带单 api 的可用权限 */
    *getCreateLeadTradeInfo(_, { call, put }) {
      const { success, data } = yield call(serv.getCreateLeadTradeInfo);
      if (success && data) {
        yield put({
          type: 'update',
          payload: {
            leadTradeInfo: {
              currentIp: data.currentIp,
              needCaptcha: data.needCaptcha,
              permissionMap: data.permissionMap || {},
            },
          },
        });
      }
    },
  },
});
