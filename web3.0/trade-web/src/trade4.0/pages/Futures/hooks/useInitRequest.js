/**
 * Owner: garuda@kupotech.com
 * 合约初始化接口请求
 */

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'dva';

import { searchToJson } from 'helper';

import { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { useTradeType } from '@/hooks/common/useTradeType';
import useFuturesReady from '@/hooks/futures/useFuturesReady';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';

import { FUTURES, isFuturesNew } from '@/meta/const';

import { usePullContractDetail } from '@/pages/InfoBar/hooks/usePullContract';

export default function useInitRequest() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const { pullContractDetail } = usePullContractDetail();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);
  const { switchTrialFund } = useSwitchTrialFund();
  const futuresReady = useFuturesReady();
  const openContract = useSelector((state) => state.openFutures.openContract);

  // 合约请求
  useEffect(() => {
    if (isFuturesNew()) {
      // 开启合约 symbols 轮询check，由于依赖 contracts 数据，所以第一次肯定会执行
      dispatch({
        type: `symbols/checkFuturesSymbols@polling`,
      });
      return () => {
        dispatch({
          type: `symbols/checkFuturesSymbols@polling:cancel`,
        });
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (tradeType === FUTURES && isFuturesNew() && futuresReady) {
      const { preview } = searchToJson() || {};
      // 如果存在 preview ，则请求一次，用来做 preview 模式下的展示
      if (preview) {
        dispatch({
          type: 'symbols/pullFuturesSymbolActive',
          payload: { preview },
        });
      }
    }
  }, [dispatch, futuresReady, tradeType]);

  // 请求用户手续费
  useEffect(() => {
    // 登录 && 存在当前交易对 && 是合约类型的交易对
    if (isLogin && currentSymbol && !isSpotSymbol) {
      dispatch({
        type: 'futuresCommon/getUserFee',
        payload: { symbol: currentSymbol },
      });
    }
  }, [currentSymbol, dispatch, isLogin, isSpotSymbol]);

  /**
   * 获取合约的市场价格，标记价格与指数价格
   * 获取当前交易对详情
   */
  useEffect(() => {
    if (currentSymbol && tradeType === FUTURES && !isSpotSymbol) {
      dispatch({
        type: 'futuresMarket/getMPAndIP',
        payload: {
          symbol: currentSymbol,
        },
      });
      pullContractDetail();
    }
  }, [dispatch, currentSymbol, tradeType, pullContractDetail, isSpotSymbol]);

  // 获取合约的开通状态
  useEffect(() => {
    if (isLogin) {
      dispatch({
        type: 'overview/checkKumexIsOpen',
      });
      dispatch({ type: 'openFutures/getOpenStatus' });
    }
  }, [dispatch, isLogin]);

  // 获取合约用户信息
  useEffect(() => {
    if (isLogin && isFuturesNew()) {
      dispatch({ type: 'futuresCommon/getFuturesUserInfo' });
    }
  }, [dispatch, isLogin]);

  // 获取合约资产
  useEffect(() => {
    if (isLogin && tradeType === FUTURES && openContract) {
      dispatch({ type: 'futuresAssets/pullOverview' });
      // 开启合约资产轮询check
      dispatch({
        type: `futuresAssets/checkWalletSocket@polling`,
      });
      return () => {
        dispatch({
          type: `futuresAssets/checkWalletSocket@polling:cancel`,
        });
      };
    }
  }, [dispatch, isLogin, openContract, tradeType]);

  // 获取合约 marketList
  useEffect(() => {
    if (isFuturesNew()) {
      dispatch({ type: 'futuresMarket/getMarketList' });
    }
  }, [dispatch]);

  // 获取合约 用户杠杆
  useEffect(() => {
    // 登录 && 存在当前交易对 && 是合约类型的交易对 && 体验金没开
    if (isLogin && currentSymbol && !isSpotSymbol) {
      // 需要获取一下用户的配置
      dispatch({
        type: 'futuresCommon/getContractUserConfig',
      });

      if (!switchTrialFund) {
        dispatch({
          type: 'futuresCommon/getUserMaxLeverage',
          payload: { symbol: currentSymbol },
        });
      } else {
        dispatch({
          type: 'futuresCommon/getTrialFundUserMaxLeverage',
          payload: { symbol: currentSymbol },
        });
      }
    }
  }, [currentSymbol, dispatch, isLogin, isSpotSymbol, switchTrialFund]);

  useEffect(() => {
    // 登录 && 存在当前交易对 && 是合约类型的交易对
    if (isLogin && tradeType === FUTURES && !isSpotSymbol) {
      // 获取用户 kyc
      dispatch({
        type: 'futuresCommon/getUserKyc',
      });
      // 请求用户 vip 等级
      dispatch({
        type: 'futuresCommon/getUserVIPInfo',
      });
    }
  }, [dispatch, isLogin, isSpotSymbol, tradeType]);
}
