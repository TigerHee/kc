/**
 * Owner: clyne@kupotech.com
 */
import React, { useContext } from 'react';

import SafeLink from 'components/SafeLink';
import { siteCfg } from 'config';

import { getBrandLink } from 'src/trade4.0/components/CompliantRule/hook';
import { BIClick, POSITIONS, POSITIONS_PRD } from 'src/trade4.0/meta/futuresSensors/list';
import { greaterThan } from 'src/utils/operation';

import Text from '@/components/Text';
import { useGetLeverage } from '@/hooks/futures/useLeverage';
import { WrapperContext } from '@/pages/Fund/config';
import ShareIcon from '@/pages/Futures/components/PnlShare/ShareIcon';
import { isContractSettlement } from '@/pages/Futures/hooks/useContractSettlement';
import { addLangToPath, styled, useGetPositionCalcData, useI18n } from '@/pages/Futures/import';
import { POS_LEVERAGE, useShowFallback } from '@/pages/Orders/FuturesOrders/hooks/useShowFallback';

import SymbolCell from '../../components/NewSymbolCell';
import { LineCancelWrapper, MarginAutoWrapper } from '../../style';
import AutoDepositCell from '../components/AutoDepositCell';
import ClosePositionCell from '../components/ClosePositionCell';
import LiquidPriceCell from '../components/LiquidPriceCell';
import MarginCell from '../components/MarginCell';
import MarkValueCell from '../components/MarkValueCell';
import OPAndMPCell from '../components/OPAndMPCell';
import PNLCell from '../components/PNLCell';
import QtyCell from '../components/QtyCell';
import RiskRateCell from '../components/RiskRateCell';
import SLAndSPCell from '../components/SLAndSPCell';
import UnPNLCell from '../components/UnPNLCell';

import { colors } from 'src/trade4.0/style/emotion';
import { BRAND_POSITION_LINK, CROSS, LONG, SELL } from '../config';


const SymbolTh = styled.span`
  display: inline;
  vertical-align: middle;
  .text-tip {
    color: ${(props) => colors(props, 'complementary')};
    vertical-align: middle;
    border-bottom: none;
  }
  .settle-active {
    color: ${(props) => colors(props, 'primary')}!important;
  }
`;

const HeaderTips = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 1.3;
  .header-explain {
    margin-top: 4px;
    color: ${(props) => props.theme.colors.complementary};
    font-size: 12px;
    line-height: 1.3;
  }
  .explain-label {
    margin-right: 2px;
  }
`;

const getSymbolProps = (row, screen, { crossLeverage, realLeverage }) => {
  const {
    symbol,
    isTrialFunds,
    marginMode,
    realLeverage: _realLeverage = 1,
    currentQty,
    leverage: _leverage,
    delevPercentage: adl,
  } = row;
  const isCross = marginMode === CROSS;

  let leverage;
  if (isCross) {
    leverage = crossLeverage || _leverage;
  } else {
    leverage = realLeverage || _realLeverage;
  }
  const side = greaterThan(currentQty)(0) ? LONG : SELL;
  return {
    ...row,
    levIsEdit: !isTrialFunds,
    symbol,
    isTrialFunds,
    marginMode,
    leverage,
    side,
    screen,
    isShowTrialFundsTips: true,
    isCross,
    adl,
  };
};

const SymbolCellRender = React.memo(({ row, screen, isMobile }) => {
  const { symbol, marginMode, isTrialFunds, realLeverage: _realLeverage, unrealisedRoePcnt } = row;
  const leverage = useGetLeverage({ symbol, marginMode, needDefault: false });
  const { realLeverage, ROE } = useGetPositionCalcData(symbol);
  const _leverage = useShowFallback({
    marginMode,
    value: leverage,
    type: POS_LEVERAGE,
  });
  const onClick = () => {
    BIClick([POSITIONS_PRD.BLOCK_ID, POSITIONS_PRD.SYMBOL_CLICK], { marginMode });
  };
  const onLevEdit = () => {
    BIClick([POSITIONS_PRD.BLOCK_ID, POSITIONS_PRD.EDIT_LEV], { marginMode });
  };
  const props = getSymbolProps(row, screen, {
    crossLeverage: _leverage,
    // 体验金需要特殊处理，不能从calc数据源里面获取
    realLeverage: isTrialFunds ? _realLeverage : realLeverage,
  });

  const isMd = screen === 'md';

  if (isMobile) {
    return (
      <LineCancelWrapper className={screen} isMd={isMd}>
        <SymbolCell
          isPos
          onSymbolClick={onClick}
          onLevEdit={onLevEdit}
          {...props}
          wrap={screen === 'md'}
          isMobile
          shareSlot={
            isMd ? null : (
              <ShareIcon
                data={{ ...row, roe: isTrialFunds ? unrealisedRoePcnt : ROE || unrealisedRoePcnt }}
                showLine
              />
            )
          }
          showTrialFundIcon
        />
        {isMd ? null : <ClosePositionCell row={row} />}
        {isMd ? (
          <ShareIcon
            data={{ ...row, roe: isTrialFunds ? unrealisedRoePcnt : ROE || unrealisedRoePcnt }}
          />
        ) : null}
      </LineCancelWrapper>
    );
  }
  return (
    <SymbolCell
      isPos
      onSymbolClick={onClick}
      onLevEdit={onLevEdit}
      {...props}
      isMobile={false}
      shareSlot={
        <ShareIcon
          data={{ ...row, roe: isTrialFunds ? unrealisedRoePcnt : ROE || unrealisedRoePcnt }}
          showLine
        />
      }
      showTrialFundIcon
    />
  );
});

export const useColumns = () => {
  const { _t } = useI18n();
  const screen = useContext(WrapperContext);
  const isMd = screen === 'md';
  const isMobile = isMd || screen === 'lg' || screen === 'lg1';

  const brandLinkMap = getBrandLink(BRAND_POSITION_LINK);
  /**
   * symbol
   */
  const SymbolItem = {
    title: _t('head.contracts'),
    align: 'left',
    dataIndex: 'symbol',
    noTitle: true,
    // TODO
    width: '200px',
    render: (v, row) => <SymbolCellRender row={row} screen={screen} isMobile={isMobile} />,
    trClassName: ({ symbol }) => {
      return isContractSettlement(symbol) ? 'tr-settle' : '';
    },
  };

  /**
   * qty
   */
  const QtyColumn = {
    title: (
      <Text cursor="help" tips={_t('trade.tooltip.positions.quantity')}>
        {_t('assets.depositRecords.amount')}
      </Text>
    ),
    dataIndex: 'currentQty',
    render: (v, row) => <QtyCell isFold={screen !== 'lg3'} row={row} />,
  };

  /**
   * value
   */
  const ValueColumn = {
    title: (
      <Text cursor="help" tips={_t('trade.tooltip.positions.value')}>
        {_t('assets.tradeHistory.value')}
      </Text>
    ),
    dataIndex: 'markPrice',
    render: (v, row) => <MarkValueCell row={row} />,
  };

  /**
   * open price & mark price
   */
  const OPAndMPColumn = {
    title: (
      <>
        <Text
          cursor="help"
          tips={
            <HeaderTips>
              <span>{_t('trade.tooltip.positions.entryPrice')}</span>
              <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.avgU}`)}>
                {_t('futures.usdsM.avgPrice.tips')}
              </SafeLink>
              <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.avgCoin}`)}>
                {_t('futures.coinM.avgPrice.tips')}
              </SafeLink>
            </HeaderTips>
          }
        >
          {_t('trade.positionsOrders.entryPrice')}
        </Text>
        {screen === 'lg2' || screen === 'lg3' ? <br /> : <span>/</span>}
        <Text
          cursor="help"
          tips={
            <HeaderTips>
              <span>{_t('trade.tooltip.positions.markPrice')}</span>
              <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.markPriceU}`)}>
                {_t('futures.usdsM.markPrice.tips')}
              </SafeLink>
            </HeaderTips>
          }
          id="position1"
        >
          <span>{_t('refer.markPrice')}</span>
        </Text>
      </>
    ),
    dataIndex: 'avgEntryPrice',
    render: (v, row) => {
      const { avgEntryPrice, markPrice, symbol } = row;
      return <OPAndMPCell symbol={symbol} avgEntryPrice={avgEntryPrice} markPrice={markPrice} />;
    },
  };

  /**
   * 强平价格
   */
  const LiquidPriceColumn = {
    title: (
      <Text
        cursor="help"
        tips={
          <HeaderTips>
            <div>
              <div className="explain-label">{_t('trade.tooltip.positions.liquidationPrice')}</div>
              <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.isolatedLIQ}`)}>
                {_t('futures.isolated.liquidation.link')}
              </SafeLink>
            </div>
            <div className="header-explain">
              <div className="explain-label">{_t('futures.cross.liquidation.tips')}</div>
              <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.crossLIQ}`)}>
                {_t('futures.cross.liquidation.link')}
              </SafeLink>
            </div>
          </HeaderTips>
        }
      >
        {_t('trade.positionsOrders.liquidationPrice')}
      </Text>
    ),
    dataIndex: 'liquidationPrice',
    render: (v, row) => {
      return <LiquidPriceCell row={row} />;
    },
  };

  /**
   * 仓位保证金
   */
  const MarginColumn = {
    title: (
      <Text cursor="help" tips={_t('kumex_cross_leverage_margin_desc')}>
        {_t('trade.positionsOrders.margin')}
      </Text>
    ),
    width: '100px',
    dataIndex: 'margin',
    render: (v, row) => {
      return <MarginCell row={row} />;
    },
  };

  /**
   * 未实现盈亏
   */
  const UnPNLColumn = {
    title: (
      <Text
        cursor="help"
        tips={
          <HeaderTips>
            <span>{_t('trade.tooltip.positions.unrealisedPNL')}</span>
            <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.avgU}`)}>
              {_t('futures.usdsM.unPnl.tips')}
            </SafeLink>
            <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.avgCoin}`)}>
              {_t('futures.coinM.unPnl.tips')}
            </SafeLink>
          </HeaderTips>
        }
      >
        {_t('trade.positionsOrders.unrealisedPNL')}
      </Text>
    ),
    dataIndex: 'unrealisedPNL',
    render: (v, row) => {
      return <UnPNLCell row={row} />;
    },
  };

  /**
   * PNL
   */
  const PNLColumn = {
    title: _t('assets.transactionHistory.type.RealisedPNL'),
    width: '100px',
    dataIndex: 'realisedPNL',
    render: (v, row) => {
      return <PNLCell row={row} />;
    },
  };

  /**
   * 仓位止盈止损
   */
  const SLAndSPColumn = {
    title: (
      <Text tips={_t('futures.tpsl.position.tips')}>
        <span>{_t('stopClose.profitLoss')}</span>
      </Text>
    ),
    width: '120px',
    dataIndex: 'SLAndSPCell',
    render: (v, row) => {
      return <SLAndSPCell row={row} />;
    },
  };

  /**
   * riskRate
   */
  const RiskRateColumn = {
    title: (
      <Text
        cursor="help"
        tips={
          <HeaderTips>
            <span>{_t('kumex_cross_risk_rate_desc')}</span>
            <SafeLink href={addLangToPath(`${siteCfg.MAINSITE_HOST}${brandLinkMap.crossRisk}`)}>
              {_t('futures.cross.riskRate.tips')}
            </SafeLink>
          </HeaderTips>
        }
      >
        {_t('futures.positon.riskRate')}
      </Text>
    ),
    dataIndex: 'riskRate',
    render: (v, row) => {
      return <RiskRateCell row={row} />;
    },
  };

  /**
   * 自动追加保证金
   */

  const AutoMarginDepositColumn = {
    title: (
      <Text cursor="help" tips={<>{_t('trade.tooltip.positions.autoDepositMargin1')}</>}>
        {_t('preferences.autoMarginDeposit')}
      </Text>
    ),
    width: '100px',
    dataIndex: 'AutoDepositCell',
    render: (v, row) => {
      const { isTrialFunds, trialCode, autoDeposit, symbol, marginMode } = row;
      return (
        <AutoDepositCell
          isTrialFunds={isTrialFunds}
          trialCode={trialCode}
          autoDeposit={autoDeposit}
          symbol={symbol}
          marginMode={marginMode}
        />
      );
    },
  };

  /**
   * 自动追加和保证金
   */
  const MarginAndAutoMarginColumn = {
    title: (
      <>
        <Text cursor="help" tips={_t('kumex_cross_leverage_margin_desc')}>
          {_t('trade.positionsOrders.margin')}
        </Text>
        {screen === 'lg2' || screen === 'lg3' ? <br /> : <span>/</span>}
        <Text cursor="help" tips={<>{_t('trade.tooltip.positions.autoDepositMargin1')}</>}>
          {_t('preferences.autoMarginDeposit')}
        </Text>
      </>
    ),
    width: '120px',
    dataIndex: 'MarginCell',
    render: (v, row) => {
      const { isTrialFunds, trialCode, autoDeposit, symbol, marginMode } = row;
      return (
        <div>
          <MarginCell row={row} />
          <MarginAutoWrapper>
            <AutoDepositCell
              isTrialFunds={isTrialFunds}
              trialCode={trialCode}
              autoDeposit={autoDeposit}
              symbol={symbol}
              marginMode={marginMode}
            />
          </MarginAutoWrapper>
        </div>
      );
    },
  };

  /**
   * 平仓
   */
  const ClosePositionColumn = {
    title: (
      <Text cursor="help" tips={_t('trade.tooltip.positions.closeOrder')}>
        {_t('trade.positionsOrders.closePosition')}
      </Text>
    ),
    dataIndex: 'closePosition',
    width: '150px',
    align: 'right',
    noTitle: screen === 'sm' || screen === 'md',
    render: (v, row) => {
      return <ClosePositionCell row={row} noTitle={screen === 'sm' || screen === 'md'} />;
    },
  };
  if (screen === 'lg3') {
    return [
      SymbolItem,
      QtyColumn,
      ValueColumn,
      OPAndMPColumn,
      LiquidPriceColumn,
      MarginColumn,
      UnPNLColumn,
      PNLColumn,
      SLAndSPColumn,
      RiskRateColumn,
      AutoMarginDepositColumn,
      ClosePositionColumn,
    ];
  }
  if (screen === 'lg2') {
    return [
      SymbolItem,
      QtyColumn,
      OPAndMPColumn,
      LiquidPriceColumn,
      MarginAndAutoMarginColumn,
      UnPNLColumn,
      PNLColumn,
      SLAndSPColumn,
      RiskRateColumn,
      ClosePositionColumn,
    ];
  }
  if (screen === 'lg1') {
    return [
      [SymbolItem],
      [QtyColumn, OPAndMPColumn, LiquidPriceColumn, MarginColumn],
      [UnPNLColumn, PNLColumn, SLAndSPColumn, AutoMarginDepositColumn],
      [RiskRateColumn],
    ];
  }

  if (screen === 'lg') {
    return [
      [SymbolItem],
      [QtyColumn, OPAndMPColumn, LiquidPriceColumn],
      [MarginColumn, AutoMarginDepositColumn, UnPNLColumn],
      [PNLColumn, SLAndSPColumn, { ...RiskRateColumn, flex: 1 }],
    ];
  }

  return [
    SymbolItem,
    QtyColumn,
    OPAndMPColumn,
    LiquidPriceColumn,
    MarginColumn,
    UnPNLColumn,
    PNLColumn,
    SLAndSPColumn,
    RiskRateColumn,
    AutoMarginDepositColumn,
    ClosePositionColumn,
  ];
};
