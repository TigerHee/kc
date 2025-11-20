/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { isNull, pureNumber } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';

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
    price, // 当前价格
    changeRate,
    strategyProfit, // 网格利润
    floatingAmount, // 浮动盈亏
    minPrice,
    maxPrice,
    id,
    avgBuyPrice, // 持仓均价
    stopProfitPrice, // 本轮卖出价格
  } = item;

  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const { symbolNameText, quota, pricePrecision, quotaPrecision } = symbolInfo;
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
        {/* 投资额 */}
        <Text as="div" color="text40">
          {_t('card6')}({quota})
        </Text>
        <Text as="div" color="text60">
          <FormatNumber value={totalCost} precision={quotaPrecision} />
        </Text>
      </TD>
      <TD>
        {/* 总利润 */}
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
        {/* 套利利润/浮动盈亏 */}
        <Text as="div" color="text40" className="sm-two-label">
          <LabelPopover tipKey="soJMwxHAKzNREmaAgBB4Ki" straName="MARTIN_GALE">
            {_t('soJMwxHAKzNREmaAgBB4Ki')}
          </LabelPopover>
          <span className="sm-split">/</span>
          <LabelPopover tipKey="float" straName="MARTIN_GALE">
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
        {/* 持仓均价/年华 */}
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('holdcomprice')}</span>
          <span className="sm-split">/</span>
          <span>{_t('card10')}</span>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber value={avgBuyPrice} precision={pricePrecision} />
          </Text>
          <Text as="div" color="text60">
            <ChangeRate value={yearProfitRate} />
          </Text>
        </div>
      </TD>

      <TD>
        {/* 开仓区间 */}
        <Text as="div" color="text40">
          {_t('izbQXzqvjCwwkLBKMYe3u7')}
        </Text>

        <Text as="div" color="text60">
          {OpenPriceRange({ minPrice, maxPrice, pricePrecision })}
        </Text>
      </TD>
      <TD>
        {/* 本轮卖出价格 */}
        <Text as="div" color="text40">
          <LabelPopover tipKey="qxvFxz75XooWCpWU9VSzak" straName="MARTIN_GALE">
            {_t('qxvFxz75XooWCpWU9VSzak')}
          </LabelPopover>
        </Text>

        <Text as="div" color="text60">
          <FormatNumber value={stopProfitPrice} precision={pricePrecision} />
        </Text>
      </TD>

      <TD className="operation-area">
        <RunningOperation {...operationProps} />
      </TD>
    </TR>
  );
};

/**
 * @description: 开仓价格区间格式化
 * @param {*} minPrice
 * @param {*} maxPrice
 * @param {*} pricePrecision
 * @return {*}
 */
export const OpenPriceRange = ({ minPrice, maxPrice, pricePrecision }) => {
  if (isNull(minPrice) && isNull(maxPrice)) {
    return '--';
  }
  return `${isNull(minPrice) ? '' : pureNumber(minPrice, pricePrecision)} ～ ${
    isNull(maxPrice) ? '' : pureNumber(maxPrice, pricePrecision)
  }`;
};
