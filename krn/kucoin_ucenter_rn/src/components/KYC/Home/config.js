import {openNative} from '@krn/bridge';
import {getSource} from 'hooks/useTracker';

export const kyc3StatusEnum = {
  // 未认证
  UNVERIFIED: 'UNVERIFIED',
  // 认证中
  VERIFYING: 'VERIFYING',
  // 假失败
  FAKE: 'FAKE',
  // 认证中断
  SUSPEND: 'SUSPEND',
  // 认证失败
  REJECTED: 'REJECTED',
  // 认证成功
  VERIFIED: 'VERIFIED',
  // 待打回
  CLEARANCE: 'CLEARANCE',
  // 已打回
  RESET: 'RESET',
};

/**
 * @description: 跳社区
 * @return {*}
 */
export const jumpCommunity = () => {
  openNative(
    `/link?url=${encodeURIComponent('https://t.me/KucoinVerifyservice')}`,
  );
};

export const jumpVerify = (kycClearInfo = {}) => {
  const {clearStatus} = kycClearInfo;
  const {kyc_biz, kyc_from} = getSource();

  const url = `/flutter?route=${encodeURIComponent(
    `/kyc/edit?kyc_biz=${kyc_biz}&kyc_from=${kyc_from}&clear_status=${clearStatus}`,
  )}`;
  openNative(url);
};
