/**
 * Owner: garuda@kupotech.com
 */
import React, { useMemo } from 'react';

import clsx from 'clsx';

import { toPercent, Decimal, getDigit } from 'helper';

import { _t } from 'utils/lang';
import { greaterThan, lessThan } from 'utils/operation';

import PrettyCurrency from '@/components/PrettyCurrency';
import SymbolText from '@/components/SymbolText';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { BUY } from '@/meta/futures';
import { formatNumber } from '@/utils/futures';

import { useGetControlDisplay, useGetShareInfo } from '../hook';

const ShareInfo = () => {
  const shareInfo = useGetShareInfo();
  const { shareDisplayProfit } = useGetControlDisplay();

  const tickSizeFixed = useMemo(() => {
    const { tickSize = 1 } = getSymbolInfo({ symbol: shareInfo?.symbol, tradeType: FUTURES });
    return getDigit(tickSize);
  }, [shareInfo]);

  return (
    <div className="share-info">
      <div className="share-info-symbol">
        <SymbolText symbol={shareInfo?.symbol} />
        {shareInfo?.type === BUY ? (
          <span className="side-long">{_t('trade.long')}</span>
        ) : (
          <span className="side-short">{_t('trade.short')}</span>
        )}
      </div>
      <div className="share-info-value">
        {shareInfo?.roe ? (
          <div
            className={clsx('profit-roe', {
              'profit-win': greaterThan(shareInfo?.roe)(0),
              'profit-loss': lessThan(shareInfo?.roe)(0),
            })}
          >
            {toPercent(shareInfo?.roe, 2, false, Decimal.ROUND_HALF_UP, true)}
          </div>
        ) : null}
        <div className="profit-value">
          {shareDisplayProfit ? (
            <PrettyCurrency
              className={clsx({
                'profit-win': greaterThan(shareInfo?.profit)(0),
                'profit-loss': lessThan(shareInfo?.profit)(0),
              })}
              isShort
              value={shareInfo?.profit}
              currency={shareInfo?.currency}
            />
          ) : null}
        </div>
      </div>
      <div className="share-info-price">
        {shareInfo?.shareType === 'pnl' ? (
          <>
            {shareInfo?.avgEntryPrice !== undefined ? (
              <div className="price-item">
                <span className="item-title">{_t('futures.openPosition.price')}</span>
                <span className="item-value">
                  {formatNumber(shareInfo?.avgEntryPrice, { fixed: tickSizeFixed })}
                </span>
              </div>
            ) : null}
            {shareInfo?.closePrice !== undefined ? (
              <div className="price-item">
                <span className="item-title">{_t('futures.closePosition.price')}</span>
                <span className="item-value">
                  {formatNumber(shareInfo?.closePrice, { fixed: tickSizeFixed })}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="price-item">
              <span className="item-title">{_t('futures.openPosition.price')}</span>
              <span className="item-value">
                {formatNumber(shareInfo?.avgEntryPrice, { fixed: tickSizeFixed })}
              </span>
            </div>
            <div className="price-item">
              <span className="item-title">{_t('futures.lastPrice')}</span>
              <span className="item-value">
                {formatNumber(shareInfo?.currentPrice, { fixed: tickSizeFixed })}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(ShareInfo);
