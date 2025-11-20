import { useMemo } from 'react';
import { GuidanceStatus } from '../types';
import { useUserStore } from '@/store/user';

const useGuidanceButtonStatus = () => {
  const isLogin = useUserStore(state => state.isLogin);
  const hasTrade = useUserStore(state => state.hasTrade);
  const totalAssets = useUserStore(state => state.totalAssets);
  const hasBalance = Number(totalAssets) > 0;

  const kycStatusInfo = useUserStore(state => state.kycStatusInfo);
  const loading = kycStatusInfo === undefined || totalAssets === undefined || hasTrade === undefined;

  // 登录后，没kyc的，展示kyc按钮。(默认是不展示kyc按钮)
  const { kycLimit = true } = kycStatusInfo || {};

  /**
   * 按钮状态
   * - 未登录：展示注册按钮
   * - 登录&未KYC：展示去KYC按钮
   * - KYC&未入金：展示充值和买币按钮
   * - 已入金：展示交易按钮
   *
   */
  const guidanceStatus = useMemo(() => {
    if (loading) {
      return GuidanceStatus.needSignup;
    }
    if (!isLogin) {
      return GuidanceStatus.needSignup;
    }
    if (kycLimit) {
      return GuidanceStatus.needKyc;
    }
    if (!hasBalance) {
      return GuidanceStatus.needDeposit;
    }
    return GuidanceStatus.trade;
  }, [kycLimit, hasBalance, isLogin, loading]);
  return { guidanceStatus };
};

export default useGuidanceButtonStatus;
