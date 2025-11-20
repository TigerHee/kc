/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD, EndTime } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import {
  FormatNumber,
  Profit,
  ChangeRate,
  Price,
} from 'Bot/components/ColorText';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import { HistoryMore } from 'Bot/Strategies/components/RunningOperation';
import ReturnAssetsPopover from 'Bot/Strategies/components/ReturnAssetsPopover';
import { getInverstCycle } from '../config';

export default ({ item, coupon, onDetail }) => {
  const {
    name,
    symbol: symbolCode,
    status,
    totalCost, // 总成本
    totalProfit, // 总利润
    totalProfitRate, // 利润百分比
    yearProfitRate, // 年华收益率
    price, // 当前价格
    changeRate,
    floatingAmount, // 浮动盈亏
    id,
    startTimeDifference, // 运行时间差
    profitTarget, // 盈利目标
    totalSize, // 已经购买base数量
    investedNum, //  已经购买次数
    interval, // 多久头一次
    amount, // 每次投资金额
    avgBuyPrice, // 仓位均价
    hasEnoughMoney, // 币币账户钱是否够 : 为false不够
    isReachMaxTotalCost, // 是否已经达到定投额度
    isNextExceedMaxTotalCost, // 下次投资是否达到定投额度
    endTime,
  } = item;

  const symbolInfo = useSpotSymbolInfo(symbolCode);
  const {
    symbolNameText,
    base,
    quota,
    pricePrecision,
    basePrecision,
    quotaPrecision,
  } = symbolInfo;

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
            <Price
              value={price}
              changeRate={changeRate}
              precision={pricePrecision}
            />
          </div>
          <Text color="text40" className="middle-arbitrage">
            {formatSpanDuration(startTimeDifference)}
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
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('auto.commonprice')}</span>
          <span className="sm-split">/</span>
          <span>{_t('card9')}</span>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber
              effective
              value={avgBuyPrice}
              precision={pricePrecision}
            />
          </Text>
          <Text as="div" color="text60">
            <FormatNumber
              effective
              value={floatingAmount}
              precision={quotaPrecision}
            />
          </Text>
        </div>
      </TD>

      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('auto.whentoinverst')}</span>
          <span className="sm-split">/</span>
          <span>{_t('auto.perinvertmuch2')}</span>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            {getInverstCycle(interval)}
          </Text>
          <Text as="div" color="text60">
            <FormatNumber value={amount} precision={pricePrecision} />
          </Text>
        </div>
      </TD>

      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('auto.transferrecord')}</span>
          <span className="sm-split">/</span>
          <span>{_t('auto.hasbuynum')}</span>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber value={investedNum} precision={0} />
          </Text>
          <Text as="div" color="text60">
            <FormatNumber value={totalSize} precision={basePrecision} />
          </Text>
        </div>
      </TD>

      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('card10')}</span>
          <span className="sm-split">/</span>
          <span>{_t('auto.profittarget')}</span>
        </Text>
        <div className="sm-two-value">
          <ChangeRate as="div" value={yearProfitRate} />
          <ChangeRate
            value={profitTarget}
            hasUnit={false}
            color="text60"
            as="div"
          />
        </div>
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
