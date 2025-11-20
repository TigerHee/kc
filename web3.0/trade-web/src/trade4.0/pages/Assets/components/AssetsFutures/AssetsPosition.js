/**
 * Owner: garuda@kupotech.com
 * 合约资产组件模块
 */

import React, { useCallback, useEffect, useState, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { filter } from 'lodash';

import { _t } from 'utils/lang';
import {
  dividedBy,
  percent as toPercent,
  minus,
  greaterThan,
  lessThanOrEqualTo,
  toFixed,
} from 'utils/operation';

import { fx, styled } from '@/style/emotion';
import Tooltip from '@mui/Tooltip';
import SymbolText from '@/components/SymbolText';

import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import useWalletForSymbol from '@/hooks/futures/useWalletForSymbol';
import { useGetSymbolPositionsData } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';

import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';

import { isSpotTypeSymbol } from 'src/trade4.0/hooks/common/useIsSpotSymbol';
import { AssetsWrapper, AssetsTitle, AssetsBox, AssetsItem, PrettyValue } from './commonStyle';

const RiskSpan = styled.span`
  font-size: 12px;
  font-weight: 500;
  &.primary {
    color: ${(props) => props.theme.colors.primary};
  }
  &.secondary {
    color: ${(props) => props.theme.colors.secondary};
  }
  &.complementary {
    color: ${(props) => props.theme.colors.complementary};
  }
`;

const TrialText = styled.span`
  ${(props) => fx.color(props, 'complementary')}
  ${(props) => fx.backgroundColor(props, 'complementary8')}
  padding: 0 4px;
  border-radius: 4px;
  word-break: normal;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  margin-left: 4px;
`;

const emptyObject = {};
const AssetsPosition = memo(({ isMd }) => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();
  const isSpotSymbol = isSpotTypeSymbol(currentSymbol);

  const { switchTrialFund: isTrialFunds } = useSwitchTrialFund();
  const currentWallet = useWalletForSymbol(currentSymbol, isTrialFunds);

  const position = useGetSymbolPositionsData({
    symbol: currentSymbol,
    isTrialFunds,
  });

  const calcData = useGetPositionCalcData(currentSymbol);

  const [positionState, setPositionState] = useState({});

  // 如果 position 没值，则使用 positionState 的值，防止 position 接口未请求
  const {
    maintMargin,
    unrealisedPnl,
    isTrialFunds: positionTrialFunds,
  } = useMemo(() => {
    if (!isLogin) return emptyObject;
    return position.symbol ? position : positionState;
  }, [isLogin, position, positionState]);

  const handleGetPositionData = useCallback(
    async (symbol) => {
      const data = await dispatch({
        type: 'futuresAssets/getPositionDetail',
        payload: { symbol },
      });
      if (data?.data) {
        const updateData = filter(data.data, (item) => !!item.isTrialFunds === !!isTrialFunds);
        setPositionState(updateData);
      }
    },
    [dispatch, isTrialFunds],
  );

  useEffect(() => {
    if ((!position || !Object.keys(position).length) && isLogin && !isSpotSymbol && currentSymbol) {
      handleGetPositionData(currentSymbol);
    }
  }, [currentSymbol, handleGetPositionData, isLogin, isSpotSymbol, position]);

  // 体验金仓位不需要取计算值，其余需要取计算值确保更新
  const positionMargin = useMemo(() => {
    return isTrialFunds ? maintMargin : calcData?.totalMargin || maintMargin;
  }, [calcData, isTrialFunds, maintMargin]);

  // 体验金仓位不需要取计算值，其余需要取计算值确保更新
  const positionUnPnl = useMemo(() => {
    return isTrialFunds ? unrealisedPnl : calcData?.unPnl || unrealisedPnl;
  }, [calcData, isTrialFunds, unrealisedPnl]);

  const marginRateMap = useMemo(() => {
    if (!positionMargin) {
      return {
        riskCls: '',
        value: '--',
      };
    }
    const marginRate = dividedBy(positionMargin)(
      minus(currentWallet?.margin)(currentWallet?.orderMargin),
    );
    let riskCls = 'primary';
    // 计算保证金比率 0-20% low | 20% - 60% medium | 60% - x high
    if (greaterThan(marginRate)(0.2) && lessThanOrEqualTo(marginRate)(0.6)) {
      riskCls = 'complementary';
    } else if (greaterThan(marginRate)(0.6)) {
      riskCls = 'secondary';
    }
    return {
      riskCls,
      value: toFixed(toPercent(marginRate)(0.01))(2),
    };
  }, [currentWallet, positionMargin]);

  return (
    <AssetsWrapper>
      <AssetsTitle>
        <SymbolText symbol={currentSymbol} />
        {positionTrialFunds ? (
          <TrialText className="trial-fund">{_t('homepage.head.trial')}</TrialText>
        ) : null}
      </AssetsTitle>
      <AssetsBox isMd={isMd}>
        <AssetsItem className="assets-item">
          <span className="item-label">{_t('futuresAssets.positionMargin')}</span>
          <PrettyValue
            value={positionMargin}
            currency={symbolInfo?.settleCurrency}
            isShort
            placeholder="--"
          />
        </AssetsItem>
        <AssetsItem className="assets-item">
          <Tooltip title={_t('futuresAssets.marginRate.tip')}>
            <span className={clsx('item-label', 'underline')}>
              {_t('futuresAssets.marginRate')}
            </span>
          </Tooltip>
          <PrettyValue>
            <RiskSpan className={marginRateMap?.riskCls}>{`${marginRateMap?.value}%`}</RiskSpan>
          </PrettyValue>
        </AssetsItem>
        <AssetsItem className="assets-item">
          <Tooltip title={_t('trade.tooltip.positions.unrealisedPNL')}>
            <span className={clsx('item-label', 'underline')}>
              {_t('futuresAssets.unrealisedPNL')}
            </span>
          </Tooltip>
          <PrettyValue
            value={positionUnPnl}
            currency={symbolInfo?.settleCurrency}
            isShort
            showColor
            placeholder="--"
          />
        </AssetsItem>
      </AssetsBox>
    </AssetsWrapper>
  );
});

export default memo(AssetsPosition);
