/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex, Divider } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import PlaceOrderNum from 'Bot/Strategies/components/PlaceOrderNum.js';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import useStateRef from '@/hooks/common/useStateRef';
import AddMoneyActionSheet from 'InfinityGrid/components/AddMoneyActionSheet';
import UpdatePriceRangeActionSheet from 'InfinityGrid/components/UpdatePriceRangeActionSheet';

export default ({ item, onFresh, coupon }) => {
  // item.status = 'WAIT_OPEN_UNIT_PRICE';
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
    id,
  } = item;

  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const { symbolNameText, quota, pricePrecision, quotaPrecision } = symbolInfo;
  const isJustCreated = isJustCreateBot(id);
  const stopInfo = getStopInfo(item, symbolInfo);
  const useDataRef = useStateRef({
    coupon,
    item,
    symbolInfo,
  });
  // 修改区间
  const priceRangeRef = React.useRef();
  const onTriggerPriceRange = React.useCallback(() => {
    const { item: block } = useDataRef.current;
    if (block.status !== 'RUNNING') return;
    const childProps = {
      taskId: block.id,
      down: block.down,
      symbolCode,
    };
    priceRangeRef.current.toggle(childProps);
  }, []);

  const addInvestRef = React.useRef();
  const onTriggerInvestment = React.useCallback(() => {
    const { item: block } = useDataRef.current;
    if (block.status !== 'RUNNING') return;
    addInvestRef.current.toggle({ item: block });
  }, []);

  const operationProps = {
    isJustCreated,
    onTriggerPriceRange,
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
              <Price value={price} changeRate={changeRate} precision={pricePrecision} />
            </div>
            <Text color="text40" className="middle-arbitrage">
            <RunTimes item={item} />
            </Text>
          </div>
        </TD>

        <TD>
          <Text as="div" color="text40">
            {_t('card6')}({quota})
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
            <LabelPopover tipKey="gridprofit" straName="INFINITY_GRID">
              {_t('card8')}
            </LabelPopover>
            <span className="sm-split">/</span>
            <LabelPopover tipKey="float" straName="INFINITY_GRID">
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
          <Text Text as="div" color="text40">
            {_t('card14')}
          </Text>
          <Text as="div" color="text60">
            <FormatNumber value={entryPrice} precision={pricePrecision} />
          </Text>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <span>{_t('minprice')}</span>
            <span className="sm-split">/</span>
            <span>{_t('futrgrid.formgridnum')}</span>
          </Text>
          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber value={down} precision={pricePrecision} />
            </Text>
            <PlaceOrderNum buyNum={buyNum} sellNum={sellNum} />
          </div>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <span>{_t('card11')}</span>
            <span className="sm-split">/</span>
            <span>{_t('card10')}</span>
          </Text>
          <div className="sm-two-value">
            <ChangeRate as="div" value={strategyProfitYearRate} />
            <ChangeRate as="div" value={yearProfitRate} />
          </div>
        </TD>

        <TD className="operation-area">
          <RunningOperation {...operationProps} />
        </TD>
      </TR>
      <UpdatePriceRangeActionSheet actionSheetRef={priceRangeRef} />
      <AddMoneyActionSheet actionSheetRef={addInvestRef} />
    </>
  );
};
