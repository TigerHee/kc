/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import FutureTag from 'Bot/components/Common/FutureTag';
import PlaceOrderNum from 'Bot/Strategies/components/PlaceOrderNum.js';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import useStateRef from '@/hooks/common/useStateRef';
import { DebtRate } from '../config';
import FutureAddMargin from 'Bot/Strategies/components/FutureAddMargin';
import { addMarginApiConfig } from 'LeverageGrid/config';

const getBlowUpPrice = (blowUpPrice) => {
  let blowUpPriceNew;
  if (['0', 0].includes(blowUpPrice)) {
    blowUpPriceNew = 0;
  } else if (!blowUpPrice || Number(blowUpPrice) < 0) {
    blowUpPriceNew = '';
  } else {
    blowUpPriceNew = blowUpPrice;
  }
  return blowUpPriceNew;
};

export default ({ item, onFresh, coupon }) => {
  // item.status = 'PROFIT_STOP';
  const {
    name,
    symbol: symbolCode,
    status,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate, // 利润百分比
    strategyProfitYearRate, // 网格年华
    yearProfitRate, // 年华收益率
    buyNum, // 买单数量
    sellNum, // 卖单数量
    price, // 当前价格
    changeRate,
    strategyProfit, // 网格利润
    floatingAmount, // 浮动盈亏
    entryPrice, // 入场价格
    down,
    up,
    id,
    startTimeDifference, // 运行时间差
    canReInvestment, // 复投
    breakEvenPrice, // 盈亏平衡
    debtRate,
    direction,
    marginLeverage: leverage,
  } = item;
  // 统一杠杆倍数字段
  item.leverage = item.marginLeverage;
  const blowUpPriceNew = getBlowUpPrice(item.blowUpPrice);

  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const { symbolNameText, base, quota, pricePrecision, basePrecision, quotaPrecision } = symbolInfo;
  const isJustCreated = isJustCreateBot(id);
  const stopInfo = getStopInfo(item, symbolInfo);
  const useDataRef = useStateRef({
    coupon,
    item,
    symbolInfo,
  });
  const addInvestRef = React.useRef();
  const onTriggerInvestment = React.useCallback(() => {
    if (useDataRef.current.item.status !== 'RUNNING') return;
    addInvestRef.current.toggle(useDataRef.current);
  }, []);
  const operationProps = {
    isJustCreated,
    onTriggerInvestment,
    status,
    stopInfo,
    onFresh,
    item,
  };
  return (
    <>
      <TR className={`bot-${item.status}`}>
        <TD>
          <Text as="div" color="text60" className="running-middle-dot">
            {name}
          </Text>
          <div className="middle-row">
            <div>
              <Text pr={6} color="text" className="running-dot">
                {symbolNameText}
              </Text>
              <FutureTag direction={direction} leverage={leverage} mr={6} />
              <Price value={price} changeRate={changeRate} precision={pricePrecision} />
            </div>
            <Text color="text40" className="middle-arbitrage">
              <RunTimes item={item} />
            </Text>
          </div>
        </TD>

        <TD>
          <Text as="div" color="text40">
            {_t('futrgrid.marginnum')}({quota})
          </Text>
          <Text as="div" color="text60">
            <FormatNumber value={totalCost} precision={quotaPrecision} />
          </Text>
        </TD>
        <TD>
          <Text as="div" color="text40">
            {_t('card7')}({quota})
          </Text>
          <div className="sm-row">
            <Flex>
              <Profit value={totalProfit} precision={quotaPrecision} />
              <CouponTop coupon={coupon} />
            </Flex>
            <ChangeRate value={totalProfitRate} prefix="(" suffix=")" />
          </div>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <LabelPopover tipKey="gridprofit" straName="MARGIN_GRID">
              {_t('card8')}
            </LabelPopover>
            <span className="sm-split">/</span>
            <LabelPopover tipKey="float" straName="MARGIN_GRID">
              {_t('card9')}
            </LabelPopover>
          </Text>
          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber effective value={strategyProfit} precision={quotaPrecision} />
            </Text>
            <Text as="div" color="text60">
              <FormatNumber effective value={floatingAmount} precision={quotaPrecision} />
            </Text>
          </div>
        </TD>
        <TD>
          <Text Text as="div" color="text40" className="sm-two-label">
            {_t('card14')}
            <span className="sm-split">/</span>
            <span>{_t('futrgrid.blowupprice')}</span>
          </Text>

          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber value={Number(entryPrice || 0)} precision={pricePrecision} />
            </Text>
            <Text as="div" color="text60">
              <FormatNumber value={blowUpPriceNew} precision={pricePrecision} />
            </Text>
          </div>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <span>{_t('gridform26')}</span>
            <span className="sm-split">/</span>
            <span>{_t('futrgrid.formgridnum')}</span>
          </Text>
          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber value={down} precision={pricePrecision} />
              ~
              <FormatNumber value={up} precision={pricePrecision} />
            </Text>
            <PlaceOrderNum buyNum={buyNum} sellNum={sellNum} />
          </div>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <LabelPopover tipKey="debtrate" straName="MARGIN_GRID" debtRate={debtRate}>
              {_t('debtrate')}
            </LabelPopover>
            <span className="sm-split">/</span>
            <span>{_t('card10')}</span>
          </Text>
          <div className="sm-two-value">
            <DebtRate debtRate={debtRate} />
            <ChangeRate as="div" value={yearProfitRate} />
          </div>
        </TD>

        <TD className="operation-area">
          <RunningOperation {...operationProps} />
        </TD>
      </TR>
      <FutureAddMargin
        apiConfig={addMarginApiConfig}
        onFresh={onFresh}
        actionSheetRef={addInvestRef}
        hasPreCalcBlowUpPrice={false}
      />
    </>
  );
};
