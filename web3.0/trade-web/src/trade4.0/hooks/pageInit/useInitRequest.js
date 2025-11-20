/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-09-10 16:55:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-18 10:27:27
 * @FilePath: /trade-web/src/trade4.0/hooks/pageInit/useInitRequest.js
 * @Description:
 */
/*
 * @owner: borden@kupotech.com
 * @desc: 请求整理，会在首屏发起的请求，需要处理请求时机，使其尽可能完成按需
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import useIsMargin from '@/hooks/useIsMargin';
import useTradePwdStatus from '@/pages/OrderForm/hooks/useTradePwdStatus';
import useEtfCoin from 'utils/hooks/useEtfCoin';
import { SPOT, MARGIN, ISOLATED } from '@/meta/const';
import { setAppInfo } from '@/hooks/common/useApp';
import { isDisplayMargin } from '@/meta/multiTenantSetting';

export default function useInitRequest() {
  const dispatch = useDispatch();
  const etfCoin = useEtfCoin();
  const isMargin = useIsMargin();
  const { checkVerify } = useTradePwdStatus();
  const isLogin = useSelector((state) => state.user.isLogin);
  const openFlag = useSelector((state) => state.marginMeta.userPosition?.openFlag);
  const currentTradeType = useSelector((state) => state.trade.tradeType);
  const isComplianceTaxTradeType = [SPOT, MARGIN, ISOLATED].includes(currentTradeType); // 只在现货，杠杆交易类型下展示
  // 全局的私有请求和非私有请求
  useEffect(() => {
    if (isLogin) {
      // 因为全局展示的杠杆倍数需要依赖下方配置，所以需要初始化的时候拉取
      // 拉取杠杆白名单配置，已经请求成功过的话会被阻断，不会重复请求
      if (isDisplayMargin()) {
        dispatch({ type: 'marginMeta/pullConfigsByUser' });
        dispatch({ type: 'symbols/pullIsolatedSymbolsByUser' });
      }
      // Header和划转依赖高频的开通状态
      dispatch({ type: 'user_assets/queryUserHasHighAccount' });
      // 查询kyc信息的弹框的文案提示
      dispatch({
        type: 'user/queryIpDismiss',
        payload: {
          bizType: 'FORCE_KYC_DIALOG',
        },
      });
      // 登录后校验一次是否需要交易密码
      checkVerify();
    } else if (isLogin === false) {
      if (isDisplayMargin()) {
        dispatch({ type: 'marginMeta/pullConfigs' });
        dispatch({ type: 'symbols/pullIsolatedSymbols' });
      }
    }
  }, [checkVerify, dispatch, isLogin]);
  // 杠杆代币开通状态初始化
  useEffect(() => {
    if (etfCoin && isLogin) {
      if (isDisplayMargin()) {
        dispatch({
          type: 'leveragedTokens/checkUserAgreement',
        });
      }
    }
  }, [dispatch, etfCoin, isLogin]);
  // 杠杆开通状态初始化
  useEffect(() => {
    if (isMargin && isLogin && !openFlag) {
      if (isDisplayMargin()) {
        dispatch({
          type: 'marginMeta/pullUserMarginPostion',
        });
      }
    }
  }, [isMargin, isLogin, openFlag, dispatch]);
  // 杠杆通用私有请求
  useEffect(() => {
    if (isMargin && isLogin) {
      if (isDisplayMargin()) {
        dispatch({
          type: 'bonus/pullMarginBonusStatus',
        });
      }
    }
  }, [isMargin, isLogin, dispatch]);
  // 获取判断用户是否需要交税
  useEffect(() => {
    if (isLogin && isComplianceTaxTradeType) {
      dispatch({ type: 'app/isNeedToPayTax' });
    }
  }, [isLogin, dispatch]);
  // 获取用户税费提示文案
  useEffect(() => {
    if (isLogin && isComplianceTaxTradeType) {
      dispatch({
        type: 'app/queryTaxTips',
        payload: {
          type: 'SPOT_TAX_TIPS',
        },
      });
    }
  }, [isLogin, dispatch]);

  useEffect(() => {
    setAppInfo({ dispatch });
  }, [isLogin, dispatch]);
}
