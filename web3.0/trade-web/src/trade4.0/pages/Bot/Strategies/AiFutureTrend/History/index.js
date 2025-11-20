/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD, EndTime } from 'Bot/components/Common/CTable';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex, Divider, Div } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import { HistoryMore } from 'Bot/Strategies/components/RunningOperation';
import ReturnAssetsPopover from 'Bot/Strategies/components/ReturnAssetsPopover';
import PlaceOrderNum from 'Bot/Strategies/components/PlaceOrderNum.js';
import { getTrendText } from 'AiSpotTrend/config';
import FutureTag from 'Bot/components/Common/FutureTag';

export default ({ item, coupon }) => {
  const {
    name,
    symbolCode,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate, // 利润百分比
    yearProfitRate, // 年华收益率
    price, // 当前价格
    changeRate,
    strategyProfit, // 网格利润
    floatingAmount, // 浮动盈亏
    trend, // 趋势
    avgBuyPrice,
    direction,
    endTime,
  } = item;

  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { symbolNameText, quota, precision, profitPrecision } = symbolInfo;

  return (
    <TR className={`bot-${item.status}`}>
      <TD>
        <Text as="div" color="text60" className="sm-row-sb">
          {name}
          <HistoryMore item={item} className="only-show-sm" />
        </Text>
        <div className="middle-row">
          <div>
            <Text pr={6} color="text" className="running-dot">
              {symbolNameText}
            </Text>
            <Price value={price} changeRate={changeRate} precision={precision} />
          </div>
          <Text color="text40" className="middle-arbitrage">
          <RunTimes item={item} />
          </Text>
        </div>
      </TD>

      <TD>
        <ReturnAssetsPopover coupon={coupon} transferDetails={item.transferDetails}>
          <Text as="div" color="text40" cursor="pointer">
            {_t('card6')}({quota})
          </Text>
        </ReturnAssetsPopover>
        <Text as="div" color="text60">
          <FormatNumber value={totalCost} precision={precision} />
        </Text>
      </TD>
      <TD>
        <Text as="div" color="text40">
          {_t('card7')}({quota})
        </Text>
        <div className="sm-row">
          <Flex>
            <Profit value={totalProfit} precision={profitPrecision} />
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
          <LabelPopover tipKey="futurecta.float" straName="CTA">
            {_t('card9')}
          </LabelPopover>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber effective value={strategyProfit} precision={profitPrecision} />
          </Text>
          <Text as="div" color="text60">
            <FormatNumber effective value={floatingAmount} precision={profitPrecision} />
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
          <LabelPopover tipKey="direction" straName="CTA">
            {_t('positiondirection')}
          </LabelPopover>
        </Text>
        <Text as="div" color="text60">
          {direction ? <FutureTag direction={direction} hasBk={false} /> : '--'}
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
        <Div color="text60" className="sm-two-value">
          <FormatNumber value={avgBuyPrice} precision={precision} />
          <ChangeRate as="div" value={yearProfitRate} />
        </Div>
      </TD>

      <TD className="operation-area">
        <Flex vc className="history-operation">
          <EndTime endTime={endTime} />
          <HistoryMore item={item} className="only-show-not-sm" />
        </Flex>
      </TD>
    </TR>
  );
};
