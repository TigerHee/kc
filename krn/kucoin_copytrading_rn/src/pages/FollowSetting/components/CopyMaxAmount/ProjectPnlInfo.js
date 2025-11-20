import {useRafInterval, useUnmount} from 'ahooks';
import {useGetTraderPositionSummaryInfo} from 'pages/FollowSetting/hooks/useGetTraderPositionSummaryInfo';
import React, {memo} from 'react';
import {getBaseCurrency} from 'site/tenant';

import {COMMON_REFRESH_INTERVAL} from 'constants/index';
import useLang from 'hooks/useLang';
import {isValidNumber, numberFixed} from 'utils/helper';
import {dividedBy} from 'utils/operation';
import {PnlInfoText, PnlInfoWrap} from './styles';

const ProjectPnlInfo = ({copyAmount}) => {
  const {_t, numberFormat} = useLang();

  const {data: traderPositionSummaryInfoResp, refetch} =
    useGetTraderPositionSummaryInfo();
  const {totalPnl} = traderPositionSummaryInfoResp?.data || {};
  const pnlAmountRate = dividedBy(totalPnl)(copyAmount);
  const clearInterval = useRafInterval(
    () => {
      // 定时拉取
      refetch();
    },
    COMMON_REFRESH_INTERVAL,
    {immediate: false},
  );

  useUnmount(() => {
    clearInterval?.();
  });
  const profitNumberFormat = (val, params = {}) => {
    const {isPositive = false, isPercent = false} = params || {};
    return numberFormat(val, {
      isPositive,
      options: {
        style: isPercent ? 'percent' : 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      },
    });
  };

  const param = {
    copyAmount: `${profitNumberFormat(copyAmount)} ${getBaseCurrency()}`,
    pnlAmount: isValidNumber(totalPnl)
      ? `${profitNumberFormat(numberFixed(totalPnl, 2), {
          isPositive: true,
        })} ${getBaseCurrency()}`
      : '-',
    pnlAmountRate: isValidNumber(pnlAmountRate)
      ? `${profitNumberFormat(numberFixed(pnlAmountRate, 4), {
          isPercent: true,
        })}`
      : '-',
  };

  return (
    <PnlInfoWrap>
      <PnlInfoText>{_t('17d3513e480f4000aaf7', param)}</PnlInfoText>
    </PnlInfoWrap>
  );
};

export default memo(ProjectPnlInfo);
