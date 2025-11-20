/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex, Divider } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';

export default ({ item, onFresh, coupon }) => {
  // item.status = 'PROFIT_STOP';
  const {
    name,
    symbolCode,
    status,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate, // 利润百分比
    yearProfitRate, // 年华收益率
    price, // 当前价格
    changeRate,
    strategyProfit, // 网格利润
    floatingAmount, // 浮动盈亏
    down,
    up,
    id,
  } = item;

  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { symbolNameText, quota, precision, profitPrecision } = symbolInfo;
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
            <Price value={price} changeRate={changeRate} precision={precision} />
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
          <LabelPopover tipKey="realizedProfit" straName="WIN_TWO_WAY">
            {_t('realizedProfit')}
          </LabelPopover>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber effective value={strategyProfit} precision={profitPrecision} />
          </Text>
        </div>
      </TD>
      <TD>
        <Text Text as="div" color="text40">
          <LabelPopover tipKey="float" straName="WIN_TWO_WAY">
            {_t('card9')}
          </LabelPopover>
        </Text>

        <Text as="div" color="text60">
          <FormatNumber effective value={floatingAmount} precision={profitPrecision} />
        </Text>
      </TD>

      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('card10')}</span>
        </Text>
        <div className="sm-two-value">
          <ChangeRate as="div" value={yearProfitRate} />
        </div>
      </TD>
      <TD />
      <TD className="operation-area">
        <RunningOperation {...operationProps} />
      </TD>
    </TR>
  );
};
