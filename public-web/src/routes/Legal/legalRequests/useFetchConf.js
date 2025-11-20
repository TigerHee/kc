/**
 * Owner: odan.ou@kupotech.com
 */
import { useSnackbar } from '@kux/mui';
import { useFetch } from 'hooks';
import { useMemo } from 'react';
import {
  addLegalRequests,
  legalLogin,
  legalRegister,
  legalResetPassword,
  legalUpload,
  legalUserVerify,
  legalUserVerifyRes,
  legalVerifyCode,
} from 'services/cs/legal';
import { _t } from './utils';

const LegalStoreKey = `LEGAL_USER_DATA_${window?.navigator?.userAgent?.toLowerCase()}`;

/**
 * 司法协查数据请求
 */
export const useLegalRequest = (api, conf) => {
  const { showErrorMsg = true, ...fetchConf } = conf || {};
  const { message } = useSnackbar();
  const { data, loading, run, runAsync } = useFetch(api, {
    manual: true,
    ...conf,
    onError(e, params) {
      // 判断token是否过期
      const isExpired =
        e?.code === '4000000001' || (e?.code === '300000' && e?.msg === 'Token invalid!');
      if (isExpired) {
        window?.sessionStorage?.removeItem(LegalStoreKey);
      }
      if (showErrorMsg) {
        message.error(String(e?.msg || e?.message || 'error'));
      }
      conf?.onError(e, params);
    },
  });

  return { data, loading, run, runAsync };
};

/**
 * 更新用户信息（注册or更新密码）
 * @param {booelan} type 1注册、修改密码是3
 * @param {Function} onOk 1注册、修改密码是3
 */
export const useUpdataUser = (type, onOk) => {
  const { message } = useSnackbar();
  return useLegalRequest(type === 1 ? legalRegister : legalResetPassword, {
    onSuccess() {
      message.success(_t('operation.succeed'));
      onOk?.();
    },
  });
};

/**
 * 获取验证码
 * type=>1注册、2登录、修改密码是3
 * @param {{
 *  type: 1 | 2 | 3,
 *  email: string,
 * }} params
 * @returns
 */
export const useLegalVerifyCode = (params, conf) => {
  return useLegalRequest(
    (v) =>
      legalVerifyCode({
        ...params,
        ...v,
      }),
    conf,
  );
};

/**
 * 登录
 */
export const useLegalLogin = () => {
  const res = useLegalRequest(legalLogin, {
    onSuccess: (data) => {
      try {
        window?.sessionStorage?.setItem(LegalStoreKey, JSON.stringify(data));
      } catch (err) {}
    },
  });
  const { data } = res;
  const userData = useMemo(() => {
    if (!data) {
      try {
        const val = window?.sessionStorage?.getItem(LegalStoreKey);
        if (!val) return undefined;
        return JSON.parse(val);
      } catch (err) {
        return undefined;
      }
    }
    return data;
  }, [data, LegalStoreKey]);
  const token = userData?.token;
  const userVerifyRes = useLegalRequest(() => legalUserVerifyRes({ token }), {
    manual: false,
    ready: !!token,
    refreshDeps: [token],
  });
  return {
    ...res,
    data: userData,
    token,
    userVerifyRes,
  };
};

/**
 * 提交审核资料
 * @param {Function} cb
 */
export const useLegalUserVerify = (cb) => {
  return useLegalRequest(legalUserVerify, {
    onSuccess() {
      cb?.();
    },
  });
};

/**
 * 司法协查数据请求
 */
export const useLegalRequestForm = (onOk) => {
  return useLegalRequest(addLegalRequests, {
    onSuccess() {
      onOk?.();
    },
  });
};

/**
 * 文件上传
 */
export const useLegalUpload = () => {
  return useLegalRequest(legalUpload);
};
