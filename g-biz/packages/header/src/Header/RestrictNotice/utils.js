import addLangToPath from '@tools/addLangToPath';
import {
  getUserInfo,
  queryEnglandDismiss,
  queryIpDismiss,
  queryUserTransferStatus,
  writeDisplayed,
} from '../service';
import {
  ENGLAND_DISMISS_NOTICE_TYPE,
  IP_DISMISS_NOTICE_TYPE,
  TRANSFER_NOTICE_TYPE,
} from './constants';
import { getCsrf, setCsrf } from '@tools/csrf';

// 与ucenter-web的映射保持一致
export const siteKeyMap = {
  GLOBAL: 'KuCoin',
  EUROPE: 'KuCoin Europe',
  AUSTRALIA: 'KuCoin Australia',
};

const TRANSFER_PAGE_PATH = '/account/transfer';

export const ACCOUNT_TRANSFER_BIZ_TYPE = 'ACCOUNT_TRANSFER';

const getTransferNoticeByInfo = (transferInfo, _t, message) => {
  const { transferStatus, status, targetSiteType = '' } = transferInfo || {};
  if (!['TRANSFERRING', 'FINISH'].includes(transferStatus)) {
    return {};
  }

  const currentStatus = transferStatus === 'TRANSFERRING' ? 'TRANSFERRING' : status;
  const targetSiteName = siteKeyMap[targetSiteType?.toUpperCase()];
  const baseNoticeData = {
    'showPrivacy': true,
    'displayType': 'SUCCESS', // 根据状态显示样式
    'topMessage': '', // 根据状态显示文案
    'closable': false, // 仅当SUCCESS的时候为true
    'title': _t('ecacb714f3824800a8a9'),
    'closeShow': undefined,
    'buttonAgree': '', // 根据状态显示按钮文案
    'buttonAgreeWebUrl': '',
    'buttonAgreeAppUrl': '', // app暂时没有该顶飘可以忽略
    'buttonRefuse': _t('99htGfgYTkdyH6qvAZRJsw'),
  };

  const failData = {
    ...baseNoticeData,
    displayType: 'ERROR',
    topMessage: _t('d8855d9488734000a08c', { targetSiteName }),
    buttonAgree: _t('21c39ab2198d4000a2c6'),
    buttonAgreeWebUrl: addLangToPath('/account/transfer'),
  };

  const map = {
    'SUCCESS': {
      ...baseNoticeData,
      topMessage: _t('89befb2a887f4800afb5'),
      buttonAgree: _t('ff22a5f2edb84800aeaf'),
      buttonAgreeWebUrl: '/account/kyc', // todo: 根据状态显示，SUCCESS待产品确认，
      closable: true,
      closeShow: async () => {
        try {
          // 用户手动关闭后 更新状态不再显示顶飘
          await writeDisplayed();
        } catch (error) {
          message.error(error?.msg || error?.message);
        }
      },
    },
    'FAIL': failData,
    'ROLLBACK': failData,
    'TRANSFERRING': {
      ...baseNoticeData,
      displayType: 'WARN',
      topMessage: _t('a4621da5cb6d4000ae11'),
    },
  };

  const noticeData = {
    data: {
      [ACCOUNT_TRANSFER_BIZ_TYPE]: {
        'dismiss': true,
        'notice': map[currentStatus],
        'bizType': [ACCOUNT_TRANSFER_BIZ_TYPE],
      },
    },
  };

  return noticeData;
};

const formatNoticeData = (result, t, message) => {
  const { alreadyDisplayed } = result?.data || {};

  // 已展示过成功迁移状态界面，或用户关闭后将不再展示
  if (alreadyDisplayed) {
    return {};
  }

  return getTransferNoticeByInfo(result?.data, t, message);
};

export const checkIsAccountTransferPage = () => {
  return window.location.pathname?.indexOf(TRANSFER_PAGE_PATH) > -1;
};

/**
 * 顶飘数据优先级处理
 * @param {string} currentPathScene
 * @param {function} t
 * @returns
 */
export const resolveNoticeFetch = async (currentPathScene, t, message) => {
  let result = {};
  let type = '';

  /**
   * 用户迁移：更优先获取和展示顶飘数据
   * 如果用户当前在非迁移页时，才请求展示迁移顶飘
   */
  if (!checkIsAccountTransferPage()) {
    try {
      if (!getCsrf()) {
        const { data } = (await getUserInfo()) || {};
        setCsrf(data?.csrf);
      }
      const res = await queryUserTransferStatus();
      result = formatNoticeData(res, t, message);
      type = TRANSFER_NOTICE_TYPE;
    } catch (e) {
      console.error(e);
    }
  }

  if (!result.data || !Object.keys(result.data).length) {
    // 特殊逻辑：优先获取英国顶飘
    try {
      result = await queryEnglandDismiss({ bizType: 'ENGLAND_SPECIAL_TOP_MESSAGE' });
      type = ENGLAND_DISMISS_NOTICE_TYPE;
    } catch (e) {
      console.error(e);
    }
  }

  // 取不到英国顶飘再走正常顶飘获取
  if (!result.data || !Object.keys(result.data).length) {
    try {
      result = await queryIpDismiss({
        bizType: 'IP_TOP_MESSAGE,FORCE_KYC_MESSAGE,CLEARANCE_MESSAGE',
        scene: currentPathScene,
      });
      type = IP_DISMISS_NOTICE_TYPE;
    } catch (e) {
      console.log(e);
    }
  }
  return { result, type };
};
