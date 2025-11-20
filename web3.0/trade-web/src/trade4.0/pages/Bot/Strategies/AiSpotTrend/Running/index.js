/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex, Div, Divider } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import PlaceOrderNum from 'Bot/Strategies/components/PlaceOrderNum.js';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import { getTrendText } from '../config';

export default ({ item, onFresh, coupon }) => {
  // item.status = 'PROFIT_STOP';
  const {
    name,
    symbol: symbolCode,
    status,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate, // 利润百分比
    yearProfitRate, // 年华收益率
    buyNum, // 买单数量
    sellNum, // 卖单数量
    price, // 当前价格
    changeRate,
    strategyProfit, // 网格利润
    floatingAmount, // 浮动盈亏
    id,
    trend, // 趋势
    baseAmount, // base 数量,
    avgBuyPrice, // 持仓均价
  } = item;

  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const { symbolNameText, base, quota, pricePrecision, basePrecision, quotaPrecision } = symbolInfo;
  const isJustCreated = isJustCreateBot(id);
  const stopInfo = getStopInfo(item, symbolInfo);

  const operationProps = {
    isJustCreated,
    status,
    stopInfo,
    onFresh,
    item,
  };
  return (
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
          <LabelPopover tipKey="realizedProfit" straName="CTA">
            {_t('realizedProfit')}
          </LabelPopover>
          <span className="sm-split">/</span>
          <LabelPopover tipKey="float" straName="CTA">
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
          <LabelPopover tipKey="shorttimetrend" straName="CTA">
            {_t('shorttimetrend')}
          </LabelPopover>
        </Text>

        <Text as="div" color="text60">
          {getTrendText(trend)}
        </Text>
      </TD>
      <TD>
        <Text as="div" color="text40">
          {_t('currentpositionsratio')}
        </Text>
        <Text as="div" color="text60">
          <FormatNumber value={baseAmount} precision={basePrecision} />
        </Text>
      </TD>
      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <LabelPopover tipKey="currentcost" straName="CTA">
            {_t('currentcost')}
          </LabelPopover>
          <span className="sm-split">/</span>
          <span>{_t('card10')}</span>
        </Text>
        <Div className="sm-two-value" color="text60">
          <FormatNumber value={avgBuyPrice} precision={pricePrecision} />
          <ChangeRate as="div" value={yearProfitRate} />
        </Div>
      </TD>

      <TD className="operation-area">
        <RunningOperation {...operationProps} />
      </TD>
    </TR>
  );
};
