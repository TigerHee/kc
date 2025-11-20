import React from 'react';
import { getAccountTransferBizKey, siteKeyMap } from './utils';
import { ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG, BIZ_PAGE, FRONT_PAGE, ONE_DAY_TIMESTAMP } from './constants';
import styles from './helper.module.scss';

const defaultTranslation = (value: string) => value;

interface TransferData {
  transferSwitchMap?: Record<string, boolean>;
  canTransfer?: boolean;
  targetSiteType?: string;
  originSiteType?: string;
  [key: string]: any;
}

/**
 * 格式化用户迁移的弹窗数据
 * @param {TransferData} data
 * @param {function} _t
 * @param {string} pathname
 */
export const formatAccountTransferResult = (data: TransferData, _t = defaultTranslation, pathname = '') => {
  const key = getAccountTransferBizKey(pathname);
  const canTransferRoute = key === ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG ? FRONT_PAGE : BIZ_PAGE;

  // 使用可选链和逻辑或运算符避免 bracket notation
  const transferSwitchValue = data?.transferSwitchMap ? data.transferSwitchMap[canTransferRoute as string] : undefined;
  const canTransfer = transferSwitchValue ?? data?.canTransfer;

  if (!canTransfer) {
    return {};
  }

  return {
    data: {
      [key]: {
        dismiss: true,
        visible: true,
        bizType: key,
        notice: {
          durationTime: ONE_DAY_TIMESTAMP,
          closable: true,
          targetSiteType: data?.targetSiteType,
          originalSiteType: data?.originSiteType,
          content: formatAccountTransferContent(data?.targetSiteType || '', _t),
          buttonAgree: _t('0e5612829fed4800a0b7'),
          buttonAgreeWebUrl: '/account/transfer',
          buttonRefuse: _t('96f0872977434800a621'),
        },
      },
    },
  };
};

/**
 * 获取站点名称
 * @param {string} key 如果要获取当前站全名
 * @returns
 */
const getSiteName = (key: string): string => {
  if (typeof key !== 'string') return '';
  const upperKey = key.toUpperCase();
  return siteKeyMap[upperKey as string] || '';
};

/**
 * 格式化弹窗的节点内容
 * @param {string} targetSiteType
 * @param {function} _t
 * @returns ReactNode
 */
const formatAccountTransferContent = (targetSiteType: string, _t: (key: string, params?: any) => string) => {
  const targetSiteName = getSiteName(targetSiteType);
  return (
    <div className={styles.DialogContentBox}>
      <div className={styles.DialogTitle}>{_t('8b2da0659a454800a2cc')}</div>
      <div className={styles.DialogDescription}>{_t('ed57cb44a83b4800a23d', { targetSiteName })}</div>
    </div>
  );
};

