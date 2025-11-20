/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD, EndTime } from 'Bot/components/Common/CTable';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate } from 'Bot/components/ColorText';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import { HistoryMore } from 'Bot/Strategies/components/RunningOperation';
import ReturnAssetsPopover from 'Bot/Strategies/components/ReturnAssetsPopover';
import { getSymbolsNameTexts } from '../util';
import { getLimitTextByMethod } from '../config';

export default ({ item, coupon, onDetail }) => {
  const {
    name,
    symbol: symbolCode,
    status,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate,
    id,
    startTimeDifference, // 运行时间差
    snapshots,
    method, // 调仓方式
    executeTimeCountdown, // 按时间调仓倒计时
    yearProfitRate,
    endTime,
  } = item;

  const symbolInfo = {
    quota: 'USDT',
    quotaPrecision: 3,
    pricePrecision: 3,
    // 组合显示的交易对名字
    symbolNameText: getSymbolsNameTexts(snapshots),
  };
  const { symbolNameText, quota, quotaPrecision } = symbolInfo;

  return (
    <TR className={`bot-${item.status}`}>
      <TD>
        <Text as="div" color="text60" className="sm-row-sb">
          {name}
          <HistoryMore item={item} className="only-show-sm" />
        </Text>
        <div className="middle-row">
          <Text pr={6} color="text" as="div" className="running-dot">
            {symbolNameText}
          </Text>
          <Text color="text40" className="middle-arbitrage">
            {formatSpanDuration(item.startTimeDifference)}
          </Text>
        </div>
      </TD>

      <TD>
        <ReturnAssetsPopover
          coupon={coupon}
          transferDetails={item.transferDetails}
        >
          <Text as="div" color="text40" cursor="pointer">
            {_t('card6')}({quota})
          </Text>
        </ReturnAssetsPopover>
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
        <Text as="div" color="text40">
          {_t('smart.ajustway')}
        </Text>
        <Text as="div" color="text60">
          {getLimitTextByMethod(method)}
        </Text>
      </TD>
      <TD>
        <Text as="div" color="text40">
          {_t('card10')}
        </Text>
        <ChangeRate as="div" value={yearProfitRate} />
      </TD>

      <TD />
      <TD />

      <TD className="operation-area">
        <Flex vc className="history-operation">
          <EndTime endTime={endTime} />
          <HistoryMore item={item} className="only-show-not-sm" />
        </Flex>
      </TD>
    </TR>
  );
};
