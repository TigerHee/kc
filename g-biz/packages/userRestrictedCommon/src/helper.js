import { styled } from '@kux/mui';
import { getAccountTransferBizKey, siteKeyMap } from './utils';
import {
  ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG,
  BIZ_PAGE,
  FRONT_PAGE,
  ONE_DAY_TIMESTAMP,
} from './constants';

const DialogContentBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DialogTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  line-height: 130%;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const DialogDescription = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  line-height: 150%;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text60};
`;

const defaultTranslation = (value) => value;

/**
 * 格式化用户迁移的弹窗数据
 * @param {canTransferData} data
 * canTransferData: {canTransfer:boolean; targetSiteType:string; ... }
 * @param {function} _t
 */
export const formatAccountTransferResult = (data, _t = defaultTranslation, pathname = '') => {
  const key = getAccountTransferBizKey(pathname);
  const canTransferRoute = key === ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG ? FRONT_PAGE : BIZ_PAGE;
  const canTransfer = data?.transferSwitchMap?.[canTransferRoute] ?? data?.canTransfer;
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
          content: formatAccountTransferContent(data?.targetSiteType, _t),
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
 * @param {string} key 如果要获取当前站全名，使用 window._BRAND_SITE_FULL_NAME_
 * @returns
 */
const getSiteName = (key) => {
  if (typeof key !== 'string') return '';
  return siteKeyMap[key.toUpperCase()] || '';
};

/**
 * 格式化弹窗的节点内容
 * @param {string} targetSiteType
 * canTransferData: { targetSiteType:string; ... }
 * @param {function} _t
 * @returns ReactNode
 */
const formatAccountTransferContent = (targetSiteType, _t) => {
  const targetSiteName = getSiteName(targetSiteType);
  return (
    <DialogContentBox>
      <DialogTitle>{_t('8b2da0659a454800a2cc')}</DialogTitle>
      <DialogDescription>{_t('ed57cb44a83b4800a23d', { targetSiteName })}</DialogDescription>
    </DialogContentBox>
  );
};
