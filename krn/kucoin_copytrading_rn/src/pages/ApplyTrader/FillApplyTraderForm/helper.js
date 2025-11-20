import {storage} from '@krn/toolkit';

import {GroupAccountType} from '../constants';

export const convertFormValueToPayload = formValues => {
  const {nickName, avatar, profile, groupType, groupAccount} = formValues;

  return {
    avatar,
    nickName,
    profile,
    telegramAccount:
      GroupAccountType.Telegram === groupType ? groupAccount : '',
    twitterAccount: GroupAccountType.Twitter === groupType ? groupAccount : '',
  };
};

/** 申请交易员 修改头像跨页面通信 选中头像数据管理器*/
export class ApplyTraderGetSelectAvatarManager {
  static CACHE_KEY = 'ApplyTraderGetSelectAvatarValue';
  static async setValue(avatarFileId) {
    storage.setItem(this.CACHE_KEY, avatarFileId);
  }

  static async getValue() {
    return storage.getItem(this.CACHE_KEY);
  }

  static reset() {
    storage.removeItem(this.CACHE_KEY);
  }
}
