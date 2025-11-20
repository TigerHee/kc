import {useMemoizedFn} from 'ahooks';
import {useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getSiteType} from 'site/tenant';

import {AU_KYC_RESTRICT_TYPE} from 'components/GlobalModal/AuKycRestrictModal/constant';
import {AU_KYC_RESTRICT_LEVEL_BUSINESS_MAP} from 'constants/compliance';
import {useMutation} from 'hooks/react-query';
import {getUserKycLevel} from 'services/copy-trade';

export const usePullAuKycLevelInfo = () => {
  return useMutation({
    queryKey: ['getUserKycLevel'],
    mutationFn: getUserKycLevel,
    enabled: getSiteType() === 'australia',
  });
};

export const useAuKycLevelModalControl = () => {
  const {visible, interceptType} =
    useSelector(state => state.globalModal.kycLevelRestrictModal) || {};
  const dispatch = useDispatch();
  const {mutateAsync} = usePullAuKycLevelInfo();

  const closeModal = useMemoizedFn(() =>
    dispatch({
      type: 'globalModal/update',
      payload: {
        kycLevelRestrictModal: {
          visible: false,
          interceptType: '',
        },
      },
    }),
  );

  const validateKycLevelRestrict = useCallback(
    async interceptType => {
      // 非澳洲站点 无需校验 直接返回 true
      const isAuSite = getSiteType() === 'australia';
      if (!isAuSite) {
        return true;
      }
      const {data: kycLevel} = (await mutateAsync()) || {};

      if (kycLevel === AU_KYC_RESTRICT_LEVEL_BUSINESS_MAP.AU_FINANCE_COMMON) {
        dispatch({
          type: 'globalModal/update',
          payload: {
            kycLevelRestrictModal: {
              visible: true,
              interceptType,
            },
          },
        });
        return false;
      }
      return true;
    },
    [dispatch, mutateAsync],
  );

  /** 验证申请交易员KYC等级限制
   * @returns {Promise<boolean>} 返回 true 表示通过验证继续
   */
  const validateApplyTraderKycLevelRestrict = useCallback(
    async () =>
      await validateKycLevelRestrict(AU_KYC_RESTRICT_TYPE.interceptApplyLeader),
    [validateKycLevelRestrict],
  );

  /** 验证发起跟单KYC等级限制
   * @returns {Promise<boolean>} 返回 true 表示通过验证继续
   */
  const validateCopyTradeKycLevelRestrict = useCallback(
    async () =>
      await validateKycLevelRestrict(AU_KYC_RESTRICT_TYPE.interceptCopyTrade),
    [validateKycLevelRestrict],
  );

  return {
    visible,
    interceptType,
    closeModal,
    validateApplyTraderKycLevelRestrict,
    validateCopyTradeKycLevelRestrict,
  };
};
