import type { TranslationFunction } from '@/hooks/useTranslation';
import { GuidanceStatus, type SensorConfig } from './types';

const guidancePathMap = {
  [GuidanceStatus.needSignup]: '/ucenter/signup',
  [GuidanceStatus.needKyc]: '/account/kyc',
  [GuidanceStatus.needDeposit]: '/assets/coin',
  [GuidanceStatus.trade]: '/trade',
};

const guidanceKeyMap = {
  [GuidanceStatus.needSignup]: 'b3a4a4d825484000ac36',
  [GuidanceStatus.needKyc]: '7bfc6d335c904800a75a',
  [GuidanceStatus.needDeposit]: '93b587d732174800aed8',
  [GuidanceStatus.trade]: 'b13725437f984000a382',
};

const guidanceSensorConfigMap: Record<GuidanceStatus, SensorConfig> = {
  [GuidanceStatus.needSignup]: {
    spm: ['registerInputClick', '1'],
    data: { yesOrNo: false },
  },
  // todo: 去做kyc的埋点补充 spm, data
  [GuidanceStatus.needKyc]: {
    spm: ['kyc', '1'],
    data: {},
  },
  [GuidanceStatus.needDeposit]: {
    spm: ['deposit', '1'],
    data: {
      after_page_id: 'B5DepositCryptoPage',
      norm_version: 1,
    },
  },
  [GuidanceStatus.trade]: {
    spm: ['tradeNow', '1'],
    data: { after_page_id: 'B5trading', norm_version: 1 },
  },
};

export const getGuidanceConfig = (key: GuidanceStatus, t: TranslationFunction) => {
  if (!key || !t) {
    return null;
  }
  const path = guidancePathMap[key];
  const text = t(guidanceKeyMap[key]);
  const { spm, data } = guidanceSensorConfigMap[key] || {};
  return { path, text, spm, data };
};
