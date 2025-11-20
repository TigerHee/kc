/**
 * Owner: garuda@kupotech.com
 * 合约资产组件模块
 */

import React, { useMemo, memo } from 'react';
import { map } from 'lodash';
import clsx from 'clsx';

import { _t } from 'utils/lang';

import Tooltip from '@mui/Tooltip';

import { useGetCurrentSymbol, useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import useWalletForSymbol from '@/hooks/futures/useWalletForSymbol';
import { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';

import { TOTAL_ASSETS_TIPS, USDS_CURRENCY } from './config';
import { AssetsWrapper, AssetsTitle, AssetsBox, AssetsItem, PrettyValue } from './commonStyle';

const AssetsBar = ({ isMd }) => {
  const currentSymbol = useGetCurrentSymbol();
  const symbolInfo = useGetCurrentSymbolInfo();
  const { switchTrialFund } = useSwitchTrialFund();
  const currentWallet = useWalletForSymbol(currentSymbol, switchTrialFund);

  const title = useMemo(() => {
    const { currency } = currentWallet;
    if (USDS_CURRENCY.includes(currency)) {
      return _t(`futuresAssets.${currency}`);
    }
    return _t(`futuresAssets.COIN`);
  }, [currentWallet]);

  return (
    <AssetsWrapper>
      <AssetsTitle>{title}</AssetsTitle>
      <AssetsBox isMd={isMd}>
        <AssetsItem className="assets-item">
          <Tooltip
            title={
              <AssetsBox className="tip-box">
                {map(TOTAL_ASSETS_TIPS, ({ title: itemTitle, valueKey, showColor }) => (
                  <AssetsItem className="assets-item" key={valueKey}>
                    <span className="tip-title">{_t(itemTitle)}</span>
                    <PrettyValue
                      value={currentWallet?.[valueKey]}
                      currency={symbolInfo?.settleCurrency}
                      isShort
                      showColor={showColor}
                    />
                  </AssetsItem>
                ))}
              </AssetsBox>
            }
          >
            <span className={clsx('item-label', 'underline')}>{_t('futuresAssets.total')}</span>
          </Tooltip>
          <PrettyValue
            value={currentWallet?.margin}
            currency={symbolInfo?.settleCurrency}
            isShort
          />
        </AssetsItem>
        <AssetsItem className="assets-item">
          <span className="item-label">{_t('futuresAssets.availableBalance')}</span>
          <PrettyValue
            value={currentWallet?.availableBalance}
            currency={symbolInfo?.settleCurrency}
            isShort
          />
        </AssetsItem>
      </AssetsBox>
    </AssetsWrapper>
  );
};

export default memo(AssetsBar);
