/*
 * @owner: borden@kupotech.com
 */
import { useState, useEffect } from 'react';
import storage from 'tools/storage';
// import { pull } from 'tools/request';

// 缓存账户状态的storage key
const UNIFIED_ACCOUNT_STATUS = 'unified_account_status';

// 账户类型枚举
export enum AccountTypeEnum {
  CLASSIC = 'CLASSIC', // 经典账户
  UNIFIED = 'UNIFIED', // 统一账户
}

// 定义账户状态接口
interface AccountStatus {
  isHitGray: boolean;
  accountType: AccountTypeEnum;
  isAnswered?: boolean;
  hasOpened?: boolean;
}

// 定义接口响应结构
interface ApiResponse {
  success: boolean;
  code: string | number;
  msg: string;
  retry: boolean;
  data: AccountStatus;
}

// 拉取接口
const fetchApi = async(): Promise<ApiResponse> => {
  // 后续三阶段删除
  return {
      "success": true,
      "code": "200",
      "msg": "success",
      "retry": false,
      "data": {
          "accountType": AccountTypeEnum.CLASSIC,
          "hasOpened": false,
          "isAnswered": false,
          "isHitGray": false
      }
  }
  // return pull('/unified/inner/open/account-status', void 0, {
  //   baseURL: '/_api_unified/ultra-open-service',
  // });
};

type Listener = (accountStatus: AccountStatus) => void;

let listeners: Listener[] = [];
let fetchLock = false;
let latestAccountStatus: AccountStatus | null = null;

export default function useAccountStatus(uid: string | null): AccountStatus | null {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(latestAccountStatus);

  useEffect(() => {
    if (uid) {
      listeners.push(setAccountStatus);

      let timer: NodeJS.Timeout | undefined;
      const fetchFn = () => {
        if (!fetchLock) {
          fetchLock = true;
          fetchApi()
            .then((res) => {
              latestAccountStatus = res.data;
              listeners.forEach((listener) => listener(res.data));
              storage.setItem(UNIFIED_ACCOUNT_STATUS, { [uid]: res.data });
            })
            .catch(() => {
              const storageData = storage.getItem(UNIFIED_ACCOUNT_STATUS);

              let defaultAccountStatus: AccountStatus;
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
                accountType: AccountTypeEnum.CLASSIC,
              };
              listeners.forEach((listener) => listener(defaultAccountStatus));

              fetchLock = false;
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
          timer = undefined;
        }
      };
    }
  }, [uid]);

  return accountStatus;
}

export function updateAccountStatus(accountStatus: Partial<AccountStatus>): void {
  latestAccountStatus = { ...latestAccountStatus, ...accountStatus } as AccountStatus;
  listeners.forEach((listener) => listener(latestAccountStatus!));
}