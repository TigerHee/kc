import {postJson} from 'utils/request';

const eKycPrefix = '/kyc';

/**
 * 是否需要做kyc引导
 * @param {string} biz // 业务线 default-kyc业务 kucard-支付业务 customer-客服业务 currency-现货业务 futures-合约业务 tradingbot-机器人业务 operation-平台运营
 */
export const getKycGuide = params => {
  return postJson(`${eKycPrefix}/common/kyc/guide`, params);
};

export const getKycGuideContent = params => {
  return postJson(`${eKycPrefix}/common/kyc/guide/content`, params);
};
