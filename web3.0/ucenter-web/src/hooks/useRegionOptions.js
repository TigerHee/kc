/**
 * Owner: vijay.zhou@kupotech.com
 * 生成国家 options，用在 kyc 业务选择证件发行国
 */
import { styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const CountryOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .autoCompleteTip {
    color: ${({ theme }) => theme.colors.text40};
    font-size: 14px;
  }
`;

const useRegionOptions = (regions = [], siteType) => {
  return regions
    .filter(
      (i) =>
        i.code !== 'OT' &&
        // 传了 siteType 就过滤，否则不过滤
        (!siteType || i.siteType === siteType),
    )
    .map((item) => {
      /**
       * kyc的国家列表是读 uc 的接口取 siteType 的，极端场景下可能出现 siteType 为 null 的 case
       * 跟后端/测试/产品沟通对齐结论是前后端都需要做兼容处理，即缺省值为 global
       */
      const siteType = item.siteType || 'global';
      if (item.regionType !== 3) {
        // regionType：国家类型（1-受限制等级1，如CN;2-受限制等级2，如US,HK等;3-普通，即不受限制）
        return {
          label: () => {
            return (
              <CountryOption>
                {item.name}
                <div className="autoCompleteTip">{_t('fe85cf1500764800ad29')}</div>
              </CountryOption>
            );
          },
          value: item.code,
          title: item.name,
          siteType,
          disabled: true,
        };
      }
      return {
        label: () => {
          return (
            <CountryOption>
              <img src={item.icon} width={24} height={16} alt="country" />
              {item.name}
            </CountryOption>
          );
        },
        value: item.code,
        title: item.name,
        siteType,
      };
    });
};

export default useRegionOptions;
