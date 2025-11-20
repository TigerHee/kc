/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useMemo } from 'react';

import Decimal from 'decimal.js/decimal';
import { toPercent } from 'helper';
import { _t } from 'utils/lang';

import { greaterThan } from 'utils/operation';

import PrettyCurrency from '@/components/PrettyCurrency';
import Text from '@/components/Text';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { styled, fx } from '@/style/emotion';

const UnRealisedCellWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  white-space: normal;
  word-break: break-all;
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
  >span {
    margin-right: 2px;
  }
`;

const ContentWrapper = styled.div`
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
`;

const TipsContent = styled.div``;

const TipsItem = styled.div`
  ${fx.display('flex')}
  ${fx.justifyContent('space-between')}
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const TipsLabel = styled.span`
  ${fx.textAlign('left')}
  ${fx.minWidth('100', 'px')}
  ${(props) => {
    return fx.color(props, props.theme.colors.mode === 'light' ? 'textEmphasis' : 'text');
  }}
`;

const TipsValue = styled.div`
  ${(props) => fx.color(props, props.color === 'primary' ? 'primary' : 'secondary')}
  ${fx.textAlign('right')}
  margin-left: 8px;
`;

const UnRealisedCell = ({ row = {} }) => {
  const { unrealisedPnl, settleCurrency, unrealisedRoePcnt, realisedPnl, isTrialFunds, symbol } =
    row || {};
  const calcData = useGetPositionCalcData(symbol);
  // 体验金的仓位不需要计算，有推送
  const unPnl = isTrialFunds ? unrealisedPnl : calcData?.unPnl || unrealisedPnl;
  const ROE = isTrialFunds ? unrealisedRoePcnt : calcData?.ROE || unrealisedRoePcnt;
  const color = greaterThan(unPnl)(0) ? 'primary' : 'secondary';
  const colorPnl = greaterThan(realisedPnl)(0) ? 'primary' : 'secondary';

  const tips = useMemo(
    () => (
      <TipsContent>
        <TipsItem>
          <TipsLabel>{_t('futuresAssets.unrealisedPNL')}</TipsLabel>
          <TipsValue color={color}>
            <PrettyCurrency isShort value={unPnl} currency={settleCurrency} />
          </TipsValue>
        </TipsItem>
        <TipsItem>
          <TipsLabel>{_t('assets.transactionHistory.type.RealisedPNL')}</TipsLabel>
          <TipsValue color={colorPnl}>
            <PrettyCurrency isShort value={realisedPnl} currency={settleCurrency} />
          </TipsValue>
        </TipsItem>
      </TipsContent>
    ),
    [color, colorPnl, realisedPnl, settleCurrency, unPnl],
  );

  return (
    <UnRealisedCellWrapper color={color} className="sm-item">
      <Text tips={tips}>
        <ContentWrapper color={color}>
          <PrettyCurrency isShort value={unPnl} currency={settleCurrency} />
        </ContentWrapper>
      </Text>
      <span>{`(${toPercent(ROE, 2, false, Decimal.ROUND_HALF_UP, true)})`}</span>
    </UnRealisedCellWrapper>
  );
};

export default memo(UnRealisedCell);
