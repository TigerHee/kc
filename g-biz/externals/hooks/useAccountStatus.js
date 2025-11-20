/*
 * @owner: borden@kupotech.com
 */
import { useState, useEffect } from 'react';
import storage from '@utils/storage';
// import { get as pull } from '@tools/request';

// 缓存账户状态的storage key
const UNIFIED_ACCOUNT_STATUS = 'unified_account_status';

// 账户类型枚举
export const ACCCOUNT_TYPE_ENUM = {
  CLASSIC: 'CLASSIC', // 经典账户
  UNIFIED: 'UNIFIED', // 统一账户
};

// 拉取接口
const fetchApi = async () => {
  // 后续三阶段删除
  return {
    'success': true,
    'code': '200',
    'msg': 'success',
    'retry': false,
    'data': {
      'accountType': ACCCOUNT_TYPE_ENUM.CLASSIC,
      'hasOpened': false,
      'isAnswered': false,
      'isHitGray': false,
    },
  };
  // return pull('/unified/inner/open/account-status', null, {
  //   baseURL: '/_api_unified/ultra-open-service',
  // });
};

let listeners = [];
let fetchLock = false;
let latestAccountStatus = null;

export default function useAccountStatus(uid) {
  const [accountStatus, setAccountStatus] = useState(latestAccountStatus);

  useEffect(() => {
    if (uid) {
      listeners.push(setAccountStatus);

      let timer;
      const fetchFn = () => {
        if (!fetchLock) {
          // 请求成功过一次，不再需要从请求获取新数据，直接锁定
          fetchLock = true;
          fetchApi()
            .then((res) => {
              // res.data.accountType = ACCCOUNT_TYPE_ENUM.UNIFIED;
              // res.data.isAnswered = true;
              // res.data.hasOpened = true;
              // res.data.isHitGray = true;
              latestAccountStatus = res.data;
              listeners.forEach((listener) => listener(res.data));
              storage.setItem(UNIFIED_ACCOUNT_STATUS, { [uid]: res.data });
            })
            .catch(() => {
              const storageData = storage.getItem(UNIFIED_ACCOUNT_STATUS);

              let defaultAccountStatus;
              if (storageData) {
                if (storageData[uid]) {
                  defaultAccountStatus = storageData[uid];
                } else {
                  storage.removeItem(UNIFIED_ACCOUNT_STATUS);
                }
              }
              // 失败优先走缓存里的，没缓存就到经典
              defaultAccountStatus = defaultAccountStatus || {
                isHitGray: false,
                accountType: ACCCOUNT_TYPE_ENUM.CLASSIC,
              };
              listeners.forEach((listener) => listener(defaultAccountStatus));

              fetchLock = false;
              // 请求失败，隔3s重试一次
              timer = setTimeout(() => {
                fetchFn();
              }, 3000);
            });
        }
      };
      fetchFn();
      return () => {
        listeners = listeners.filter((v) => v !== setAccountStatus);
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };
    }
  }, [uid]);

  return accountStatus;
}

export function updateAccountStatus(accountStatus) {
  latestAccountStatus = { ...latestAccountStatus, ...accountStatus };
  listeners.forEach((listener) => listener(latestAccountStatus));
}
