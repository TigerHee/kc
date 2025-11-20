/**
 * Owner: vijay.zhou@kupotech.com
 * 拷贝自 platform-operation-web: src/components/$/KuRewards/NewCustomerTask/Task/LimitTaskArea/config.js
 */
import { useCtx } from '../components/Context';

export const numOptions = {
  maximumFractionDigits: 2,
};

/* 固定配置 */
export const newCommerConfig = {
  myApr: 900, // apr百分比
  blockId: 'earnnewgo',
  cliamId: 'limitedearnredeem',
  cliamLocation: '1',
};

export const vipConfig = {
  myApr: 5,
  blockId: 'earnvipgo',
  cliamId: 'limitedearnredeem',
  cliamLocation: '2',
};

/**
 * 使用服务器返回的数据，覆盖固定配置中的apr
 */
export function useLimitTaskConfig() {
  const { taskList } = useCtx();
  const { tempTask: limitTask } = taskList || {};
  const fixedNewCommerConfig = {
    ...newCommerConfig,
    financialBenefitSubTitle: limitTask?.financialNewcomerTaskInfo?.financialBenefitSubTitle,
    myApr: parseInt(limitTask?.financialNewcomerTaskInfo.extraApr, 10) || newCommerConfig.myApr,
  };

  const fixedVipConfig = {
    ...vipConfig,
    financialBenefitSubTitle: limitTask?.financialVipTaskInfo?.financialBenefitSubTitle,
    myApr: parseInt(limitTask?.financialVipTaskInfo.extraApr, 10) || vipConfig.myApr,
  };

  return {
    newCommerConfig: fixedNewCommerConfig,
    vipConfig: fixedVipConfig,
  };
}

export const minCoverNum = 1000;
