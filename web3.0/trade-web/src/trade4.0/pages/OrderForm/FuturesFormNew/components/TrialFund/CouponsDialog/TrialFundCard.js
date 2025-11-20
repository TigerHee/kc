/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback, useMemo } from 'react';

import { isNaN, toNumber } from 'lodash';

import Card from './Card';

import { CouponsTitle, CouponsAmount } from './style';

import { _t, _tHTML, toDP, formatCurrency } from '../../../builtinCommon';

// import { trackClick } from 'utils/sensors';
// import { TRIAL_FUND_DETAIL } from 'sensorsKey/trialFund';
import { FormatFontSize } from '../../../builtinComponents';
import {
  useTrialFundDetail,
  useWatchHidden,
  useSymbolSupportTrialFund,
  useTrialRuleDialog,
  getCurrenciesPrecision,
} from '../../../builtinHooks';
import { useGetSymbolInfo } from '../../../hooks/useGetData';

const TrialFundCard = ({ className, checked, onChange }) => {
  const trialFundDetail = useTrialFundDetail();
  const { showModal } = useTrialRuleDialog();
  const watchHidden = useWatchHidden();

  const { symbol } = useGetSymbolInfo();
  const isSupportCurrentSymbol = useSymbolSupportTrialFund(symbol);

  const handleGoRules = useCallback(() => {
    showModal({ code: trialFundDetail?.code });

    // 埋点-点击详情
    // trackClick(TRIAL_FUND_DETAIL);
  }, [showModal, trialFundDetail]);

  const trialFundBalance = useMemo(() => {
    const cardValue = trialFundDetail?.trialFundBalance;
    // 判断是否是数字，数字则走取小数的逻辑
    if (isNaN(toNumber(cardValue))) {
      return cardValue;
    }
    const { shortPrecision } = getCurrenciesPrecision(trialFundDetail?.currency);
    const fixedValue = toDP(cardValue)(shortPrecision);
    return fixedValue.valueOf();
  }, [trialFundDetail]);

  if (!trialFundDetail?.availableNum || watchHidden || !isSupportCurrentSymbol) return null;

  return (
    <Card
      className={className}
      type={trialFundDetail?.type}
      time={trialFundDetail?.expiredPeriod}
      title={
        <CouponsTitle>
          {`${_t('homepage.head.trial')} (${trialFundDetail?.availableNum})`}
        </CouponsTitle>
      }
      amount={
        <CouponsAmount className={trialFundDetail?.type}>
          <FormatFontSize className="amount" dir="ltr" value={trialFundBalance}>
            <div className="unit">{formatCurrency(trialFundDetail?.currency)}</div>
          </FormatFontSize>
        </CouponsAmount>
      }
      headerContent={
        <>
          <h3>{_t('homepage.head.trial')}</h3>
          <div className="explain">
            {_tHTML('trial2.trial.withdraw.num.max', {
              value: `${trialFundDetail?.maxValue} ${formatCurrency(trialFundDetail?.currency)}`,
            })}
          </div>
        </>
      }
      onRules={handleGoRules}
      checked={checked}
      onChange={onChange}
    />
  );
};

export default React.memo(TrialFundCard);
