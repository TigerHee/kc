/*
 * @owner: borden@kupotech.com
 * @desc: 会跨模块订阅的topic，其兜底的轮训需要统一处理，不重复启动轮训
 */
import { useEffect } from 'react';
// import * as ws from '@kc/socket';
import { useSelector } from 'dva';
import { SPOT, MARGIN, ISOLATED } from '@/meta/const';
import useIsMargin from '@/hooks/useIsMargin';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { getTopic } from '@/hooks/useWorkerSubscribe';
import usePolling from '@/hooks/usePolling';
import { topicName } from '@/pages/Assets/config';
import { useIsTradingBot } from '@/hooks/common/useTradeMode';

export default function useSocketFallback() {
  const isMargin = useIsMargin();
  const isBot = useIsTradingBot();
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const isLogin = useSelector((state) => state.user.isLogin);
  const statistics = useSelector((state) => state.socket.statistics);
  const openFlag = useSelector((state) => state.marginMeta.userPosition?.openFlag);

  const isolatedPositionTopic = getTopic('/margin/isolatedPosition:{SYMBOL_LIST}', currentSymbol);

  // 余额推送订阅次数
  const accountBalanceSnapshot = Boolean(statistics[topicName]);
  // 全仓基础仓位信息(可用 + 冻结)订阅次数
  const marginAccount = Boolean(statistics['/margin/account']);
  // 全仓仓位状态(仓位状态&负债)订阅次数
  const marginPosition = Boolean(statistics['/margin/position']);
  // 全仓仓位状态 || 余额推送
  const crossPosition = marginAccount || marginPosition;
  // 逐仓仓位订阅次数
  const isolatedPosition = Boolean(statistics[isolatedPositionTopic]);

  // 币币账户
  const { startPolling: startTradePolling, cancelPolling: cancelTradePolling } =
    usePolling(
      'user_assets/pullTradeAccountCoins',
      'user_assets/registerTradeAccountPolling',
    );

  // 全仓账户
  const { startPolling: startCrossPolling, cancelPolling: cancelCrossPolling } =
    usePolling(
      'marginMeta/pullUserMarginPostionDetail',
      'marginMeta/registerCrossAccountPolling',
    );

  // 逐仓账户
  const { startPolling: startIsolatedPolling, cancelPolling: cancelIsolatedPolling } = usePolling(
    'isolated/pullIsolatedAppoint',
    'isolated/registerIsolatedAccountPolling',
  );

  // 杠杆标记价格
  const { startPolling: startTargetPricePolling, cancelPolling: cancelTargetPricePolling } =
    usePolling('isolated/pullTargetPrice', 'isolated/registerTargetPricePolling');

  // 币币账户数据
  useEffect(() => {
    if ((tradeType === SPOT || isBot) && isLogin && accountBalanceSnapshot) {
      startTradePolling();
    }
    return () => {
      if ((tradeType === SPOT || isBot) && isLogin && accountBalanceSnapshot) {
        cancelTradePolling();
      }
    };
  }, [tradeType, isLogin, isBot, accountBalanceSnapshot]);
  // 全仓账户数据
  useEffect(() => {
    if (tradeType === MARGIN && openFlag && crossPosition) {
      startCrossPolling();
    }
    return () => {
      if (tradeType === MARGIN && openFlag && crossPosition) {
        cancelCrossPolling();
      }
    };
  }, [tradeType, Boolean(openFlag), crossPosition]);
  // 逐仓账户数据
  useEffect(() => {
    if (tradeType === ISOLATED && openFlag && isolatedPosition) {
      startIsolatedPolling();
    }
    return () => {
      if (tradeType === ISOLATED && openFlag && isolatedPosition) {
        cancelIsolatedPolling();
      }
    };
  }, [tradeType, Boolean(openFlag), isolatedPosition]);
  // 杠杆标记价格数据
  useEffect(() => {
    if (isMargin) {
      startTargetPricePolling();
    }
    return () => {
      if (isMargin) {
        cancelTargetPricePolling();
      }
    };
  }, [isMargin]);
}
