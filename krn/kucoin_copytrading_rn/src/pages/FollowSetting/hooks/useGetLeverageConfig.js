import {useMemo} from 'react';
import {getSiteType} from 'site/tenant';

import {CopyMaxLeverageByKycLevel} from 'constants/compliance';
import {useQuery} from 'hooks/react-query';
import {getUserKycLevel} from 'services/copy-trade';
import {usePullCopyFormConfig} from './usePullCopyFormConfig';

/**
 * @description 针对澳大利亚站点，异步获取用户的KYC等级并确定相应的最大杠杆。
 * @param {boolean} isAuSite
 * @returns {{kycLevelMaxLeverage: number}}
 */
const usePullAuKycLevelInfo = isAuSite => {
  const {data} = useQuery({
    queryKey: ['getUserKycLevel'],
    queryFn: getUserKycLevel,
    enabled: isAuSite,
    cacheTime: 0,
  });
  return {
    kycLevelMaxLeverage: CopyMaxLeverageByKycLevel[data?.data],
  };
};

/**
 * @description 获取跟单交易最终最大杠杆配置的hook
 * 它同时考虑了基础表单配置和特殊的合规规则（例如，基于KYC等级的澳大利亚用户规则）。
 * @returns {{copyMaxLeverage: number}} - 最终计算出的最大杠杆。
 */
export const useGetLeverageConfig = () => {
  // 拉取跟单交易的基础表单配置
  const {data: formConfigResp} = usePullCopyFormConfig();
  // 从表单配置中解构并获取copyMaxLeverage，默认值为10。
  const {copyMaxLeverage: formConfigCopyMaxLeverage = 10} =
    formConfigResp?.data || {};
  // 检查当前站点是否为澳大利亚站点， 有特殊的合规规则。
  const isAuSite = getSiteType() === 'australia';
  const {kycLevelMaxLeverage} = usePullAuKycLevelInfo(isAuSite);

  const copyMaxLeverage = useMemo(() => {
    // 对于澳大利亚站点，最大杠杆取KYC等级设定值和表单配置设定值中的较小值
    if (isAuSite) {
      return Math.min(kycLevelMaxLeverage, formConfigCopyMaxLeverage);
    }
    return formConfigCopyMaxLeverage;
  }, [formConfigCopyMaxLeverage, isAuSite, kycLevelMaxLeverage]);

  return {
    copyMaxLeverage,
  };
};
