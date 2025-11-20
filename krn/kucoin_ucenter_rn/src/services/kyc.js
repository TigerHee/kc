import {pull, post} from 'utils/request';

/**
 * 获取权益列表
 */
export async function getPrivileges() {
  // return post('http://10.40.0.133:10001/mock/225/web/kyc/privileges');
  return post('/kyc/web/kyc/privileges', {}, false, true);
}

/**
 * 获取kyc认证状态（新）verifyStatus 会返回 6，7，8（EKYC的认证状态）
 * /kyc/kyc/info的接口状态6、7返回状态0、状态8返回状态2
 * @param {*} params
 * @returns
 */
export const getKycResult = params => {
  // const url = `http://10.40.0.133:10001/mock/225/web/kyc/result/personal`;
  const url = '/kyc/web/kyc/result/personal';
  return pull(url, params);
};

// 获取kyc认证状态
export const getKycInfo = params => {
  return pull('/kyc/kyc/info', params);
};

//查询kyc打回状态
export const getKycClearInfo = params => {
  return pull('/kyc/kyc/clear/info', params);
};
//打回kyc--重置数据
export const clearInfo = params => {
  return post('/kyc/kyc/clear?clearType=0', params, false, true);
};

// 获取KYC3的福利信息--显示文案
export const getKYC3RewardInfo = () => {
  // return pull('http://10.40.0.133:10001/mock/85/v2/newcomer/user-task/info');
  return pull('/platform-reward/v2/newcomer/user-task/info');
};

/**
 * 获取用户是否入金、交易记录
 */
export const getUserDepositFlag = params => {
  return pull('/user-portrait/web/user-label/trade-action', params);
};

// PI - KYC准入认证列表
export const getFinanceList = params => {
  return pull('/kyc/web/compliance/finance/list', params);
};

// PI - 准入标准选择接口
export const postFinanceChoose = params => {
  return post('/kyc/web/compliance/finance/choose', params, false, true);
};

// 获取用户是否可迁移
export async function pullUserCanTransfer() {
  return post(
    '/user-dismiss-front/web/siteTransfer/userTransferNotice',
    {
      entrySource: 'KYC',
    },
    false,
    true,
  );
}
