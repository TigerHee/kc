import {isEqual} from 'lodash';
import {copyTradingBridge} from '@krn/bridge';
import {storage} from '@krn/toolkit';

import {getPathname} from 'utils/helper';
const {requestRefreshCopyTradingAccountInfo} = copyTradingBridge;

const comparator = (obj1, obj2) => isEqual(obj1, obj2);

export class AsyncLeadAccountInfoController {
  static CACHE_KEY = 'cacheLeadAccountInfo';

  static getCacheLeadAccountInfo = async () => {
    return await storage.getItem(this.CACHE_KEY);
  };

  static setCacheLeadAccountInfo = async activeLeadSubAccountInfo => {
    return await storage.setItem(this.CACHE_KEY, activeLeadSubAccountInfo);
  };

  static async notifyAccount(activeLeadSubAccountInfo) {
    let cacheInfo = await this.getCacheLeadAccountInfo();
    // avatar 包含动态时间戳 此处抹平
    const patchAccountInfo = Object.keys(activeLeadSubAccountInfo || {})?.length
      ? {
          ...(activeLeadSubAccountInfo || {}),
          avatar: getPathname(activeLeadSubAccountInfo?.avatar),
        }
      : activeLeadSubAccountInfo;
    const isSame = comparator(cacheInfo, patchAccountInfo);

    if (isSame) {
      return;
    }

    this.setCacheLeadAccountInfo(patchAccountInfo);

    requestRefreshCopyTradingAccountInfo();
  }
}
