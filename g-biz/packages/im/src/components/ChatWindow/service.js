/**
 * Owner: iron@kupotech.com
 */
import { Base64 } from 'js-base64';
import { get } from '@tools/request';
import { APP_KEY, SEC_KEY } from '../../config';

let base64_auth_string = '';
const getAuthString = (env) => {
  if (base64_auth_string) {
    return base64_auth_string;
  }
  base64_auth_string = Base64.encode(`${APP_KEY[env]}:${SEC_KEY[env]}`);
  return base64_auth_string;
};

const timeoutData = { code: -2 };

const callback = (obj, ...args) => {
  return new Promise((resolve) => {
    if (obj && obj.onSuccess) {
      obj
        .onSuccess((successData) => {
          if (successData.code) {
            delete successData.code;
          }
          if (args[0] && args[0] instanceof Function) {
            args[0](successData);
          }
          resolve(successData);
        })
        .onFail((errorData) => {
          if (args[1] && args[1] instanceof Function) {
            args[1](errorData);
          }
          resolve(errorData);
        })
        .onTimeout(() => {
          if (args[2] && args[2] instanceof Function) {
            args[2]();
          }
          resolve(timeoutData);
        });
    }
  });
};

const msgCallback = (obj, ...args) => {
  return new Promise((resolve) => {
    if (obj && obj.onSuccess) {
      obj
        .onSuccess((successData, msgs) => {
          if (successData.key) {
            msgs.key = successData.key;
          }
          msgs.unread_count = successData.unread_count || 0;
          if (args[0] && args[0] instanceof Function) {
            args[0](msgs);
          }
          resolve(msgs);
        })
        .onFail((errorData) => {
          if (args[1] && args[1] instanceof Function) {
            args[1](errorData);
          }
          resolve(errorData);
        })
        .onTimeout(() => {
          if (args[2] && args[2] instanceof Function) {
            args[2]();
          }
          resolve(timeoutData);
        });
    }
  });
};

// 登出
export const loginOut = (success) => {
  return new Promise((resolve) => {
    window.JIM.loginOut();
    if (success && success instanceof Function) {
      success();
    }
    resolve();
  });
};

// 登录
export const login = (loginObj, success, error, timeout) => {
  const params = { username: loginObj.username, password: loginObj.userPassword };
  return callback(window.JIM.login(params), success, error, timeout);
};

/**
 * 注册
 * @param {*} registerObj { username: '', password }
 * @param {*} success
 * @param {*} error
 * @param {*} timeout
 */
export const register = (registerObj, success, error, timeout) => {
  const params = { username: registerObj.username, password: registerObj.userPassword };
  return callback(window.JIM.register(params), success, error, timeout);
};

/**
 * 发送或者转发单聊文本
 * @param {*} singleMsg { target_username: '', content: '' }
 * @param {*} success
 * @param {*} error
 * @param {*} timeout
 */
export const sendSingleMsg = (singleMsg, success, error, timeout) => {
  return msgCallback(window.JIM.sendSingleMsg(singleMsg), success, error, timeout);
};

// 发送或者转发单聊图片
export const sendSinglePic = (singlePic, success, error, timeout) => {
  return msgCallback(window.JIM.sendSinglePic(singlePic), success, error, timeout);
};

// 上报单聊已读回执
export const addSingleReceiptReport = (msgObj, success, error, timeout) => {
  return callback(window.JIM.addSingleReceiptReport(msgObj), success, error, timeout);
};

// 获取静态资源路径
export const getResource = (urlObj, success, error, timeout) => {
  return callback(window.JIM.getResource(urlObj), success, error, timeout);
};

export const getIMHistory = ({ env = 'DEV', ...restParams }) => {
  return get('/im-service/queryImHistory', {
    ...restParams,
    authorization: `Basic ${getAuthString(env)}`,
  });
};
