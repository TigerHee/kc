/**
 * Owner: garuda@kupotech.com
 * 全仓账务 -- 全仓总保证金 + 可用余额 + 账户权益 + 未实现盈亏
 * 逐仓 or 体验金 -- 账户权益 + 未实现盈亏
 * 根据标记价格来驱动计算未实现盈亏，避免跟仓位那边的计算互相影响，最高计算频率 （1s）
 * 需要特别注意：体验金目前不支持全仓交易，计算是单独的
 * 全仓的账务是另外的一套，判断到全仓账务开启后，走全仓流程，体验金还是原有流程
 * 未实现盈亏带正负，保证金占有全部加 abs
 */
import { forEach } from 'lodash';

import { minus, plus, max, abs } from 'utils/operation';

import { MARGIN_MODE_CROSS, MARGIN_MODE_ISOLATED } from '@/meta/futures';

import { getOpenedCross } from '@/pages/Futures/components/MarginMode/hooks';

import { formatCurrency } from '@/pages/Futures/import';

export const makePositionWallet = ({
  positionWalletMap,
  totalMargin = 0,
  unPnl = 0,
  unrealisedPnl,
  currency,
  marginMode,
  isTrialFunds,
  maintMargin,
  posMargin,
  posFunding,
}) => {
  if (!positionWalletMap[currency]) {
    positionWalletMap[currency] = {
      crossUnPnl: 0, // 全仓未实现盈亏
      isolatedPosMargin: 0, // 逐仓持仓占用
      isolatedPosTotalMargin: 0, // 逐仓持仓总占用
      selfUnPnl: 0, // 自有资金的未实现盈亏，包括全仓+逐仓
      trialPosTotalMargin: 0, // 体验金持仓总占用
      trialUnPnl: 0, // 体验金未实现盈亏
    };
  }

  // 体验金计算
  if (!isTrialFunds) {
    // 全仓计算
    if (marginMode === MARGIN_MODE_CROSS) {
      positionWalletMap[currency].crossUnPnl = plus(positionWalletMap[currency].crossUnPnl)(unPnl);
    }
    // 计算所有的未实现盈亏
    positionWalletMap[currency].selfUnPnl = plus(positionWalletMap[currency].selfUnPnl)(
      unPnl ?? positionWalletMap[currency].crossUnPnl ?? unrealisedPnl,
    );
    // 逐仓计算
    if (marginMode === MARGIN_MODE_ISOLATED || !marginMode) {
      positionWalletMap[currency].isolatedPosMargin = plus(
        abs(positionWalletMap[currency].isolatedPosMargin),
      )(abs(minus(posMargin)(posFunding)));
      positionWalletMap[currency].isolatedPosTotalMargin = plus(
        abs(positionWalletMap[currency].isolatedPosTotalMargin),
      )(abs(totalMargin ?? maintMargin));
    }
  }
};

export const makeCalcWallet = ({
  walletList,
  positionWalletMap,
  isolatedOrderMarginMap,
  posOrderMarginCurrency,
  accountTotalMargin,
}) => {
  const opened = getOpenedCross();

  const updateWallet = [...walletList];

  forEach(
    updateWallet,
    (
      {
        withdrawHold,
        walletBalance,
        isTrialFunds,
        currency: itemCurrency,
        availableBalance: itemAvailable,
        orderMargin,
      } = {},
      index,
    ) => {
      // 如果可用余额获取不到，直接不计算
      if (itemAvailable == null) return;
      const currency = formatCurrency(itemCurrency);

      const positionData = positionWalletMap[currency] || {
        crossUnPnl: 0,
        isolatedPosMargin: 0,
        isolatedPosTotalMargin: 0,
        selfUnPnl: 0, // 自有资金的未实现盈亏，包括全仓+逐仓
        trialPosTotalMargin: 0,
        trialUnPnl: 0,
      };

      // 非体验金计算
      if (!isTrialFunds) {
        if (opened) {
          const posOrderMargin = posOrderMarginCurrency[currency];
          // 全仓账务下的非体验金的 全仓总保证金 + 可用余额 + 账户权益 + 未实现盈亏的 计算更新
          // 全仓账务权益 钱包余额 + 总未实现盈亏（全仓+逐仓）
          let calcCrossTotalMargin = minus(walletBalance)(withdrawHold);

          calcCrossTotalMargin = minus(
            minus(plus(calcCrossTotalMargin)(positionData.crossUnPnl))(
              positionData.isolatedPosMargin,
            ),
          )(isolatedOrderMarginMap[currency])?.toString();

          const availableBalance = posOrderMargin
            ? minus(calcCrossTotalMargin)(posOrderMargin)?.toString()
            : itemAvailable;

          const margin = plus(walletBalance)(positionData.selfUnPnl)?.toString();
          // 用于仓位，操作外层的对象
          accountTotalMargin[currency] = calcCrossTotalMargin.toString();
          updateWallet[index] = {
            ...updateWallet[index],
            totalMargin: calcCrossTotalMargin,
            availableBalance: max(0, availableBalance),
            margin,
            unrealisedPNL: positionData.selfUnPnl,
          };
        } else {
          // 不开启全仓账务模式，账户权益 + 未实现盈亏的 计算更新
          // 逐仓 总权益 可用余额+订单占用+提币冻结+持仓占用
          const margin = plus(plus(plus(itemAvailable)(orderMargin))(withdrawHold))(
            positionData.isolatedPosTotalMargin,
          )?.toString();
          updateWallet[index] = {
            ...updateWallet[index],
            margin,
            unrealisedPNL: positionData.selfUnPnl,
          };
        }
      }
    },
  );

  return updateWallet;
};
