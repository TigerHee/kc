/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { _t } from 'utils/lang';

import CoinCurrency from '@/components/CoinCurrency';
import PrettyCurrency from '@/components/PrettyCurrency';
import { mockTax } from '@/mockData';

// FIXME: 后续迁移
// import { useShowWithdrawMargin } from '@/hooks/futures/useOperatorMargin';

import OverviewItem, { ItemWrapper } from './Item';

const Overview = ({ data, isShowTax }) => {
  // const showWithdrawMargin = useShowWithdrawMargin();
  return (
    <>
      <ItemWrapper className="item-wrapper">
        <OverviewItem
          title={_t('realised.detail.pnl')}
          amount={
            <PrettyCurrency isShort value={data.realisedGrossCost} currency={data.currency} />
          }
          coin={
            <CoinCurrency
              className="coin-color"
              value={data.realisedGrossCost}
              coin={data.currency}
            />
          }
        />
        <OverviewItem
          title={_t('assets.withdraw.fees')}
          amount={<PrettyCurrency isShort value={data.dealComm} currency={data.currency} />}
          coin={<CoinCurrency className="coin-color" value={data.dealComm} coin={data.currency} />}
        />
        {isShowTax ? (
          <OverviewItem
            title={_t('futures.tax')}
            amount={<PrettyCurrency isShort value={data.tax || mockTax} currency={data.currency} />}
            coin={<CoinCurrency value={data.tax || mockTax} coin={data.currency} />}
          />
        ) : null}

        <OverviewItem
          title={_t('refer.funding')}
          amount={<PrettyCurrency value={data.fundingFee} currency={data.currency} isShort />}
          coin={
            <CoinCurrency className="coin-color" value={data.fundingFee} coin={data.currency} />
          }
        />
      </ItemWrapper>
      {/* 体验金仓位 or 不展示提取保证金 or 接口里面字段没值，不展示 */}
      {/* data.isTrialFunds || !showWithdrawMargin || !data.withdrawPnl */}
      {data.isTrialFunds || !data.withdrawPnl ? null : (
        <OverviewItem
          title={_t('withdraw.margin.title')}
          amount={<PrettyCurrency value={data.withdrawPnl} currency={data.currency} isShort />}
          coin={<CoinCurrency value={data.withdrawPnl} coin={data.currency} />}
        />
      )}
    </>
  );
};

export default React.memo(Overview);
