/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD, EndTime } from 'Bot/components/Common/CTable';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import {
  FormatNumber,
  Profit,
  ChangeRate,
  Price,
} from 'Bot/components/ColorText';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import { HistoryMore } from 'Bot/Strategies/components/RunningOperation';
import ReturnAssetsPopover from 'Bot/Strategies/components/ReturnAssetsPopover';
import FutureTag from 'Bot/components/Common/FutureTag';

export default ({ item, coupon }) => {
  const {
    name,
    symbolCode,
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
    endTime,
    fundingFee,
    direction,
    leverage,
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
            <FutureTag direction={direction} leverage={leverage} mr={6} />
            <Price
              value={price}
              changeRate={changeRate}
              precision={precision}
            />
          </div>
          <Text color="text40" className="middle-arbitrage">
          <RunTimes item={item} />
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
          <LabelPopover tipKey="gridprofit" straName="CONTRACT_GRID">
            {_t('card8')}
          </LabelPopover>
          <span className="sm-split">/</span>
          <LabelPopover tipKey="float" straName="CONTRACT_GRID">
            {_t('card9')}
          </LabelPopover>
        </Text>

        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber
              effective
              value={strategyProfit}
              precision={profitPrecision}
            />
          </Text>
          <Text as="div" color="text60">
            <FormatNumber
              effective
              value={floatingAmount}
              precision={profitPrecision}
            />
          </Text>
        </div>
      </TD>

      <TD>
        <Text as="div" color="text40" className="sm-two-label">
          <span>{_t('card14')}</span>
          <span className="sm-split">/</span>
          <span>{_t('card10')}</span>
        </Text>
        <div className="sm-two-value">
          <Text as="div" color="text60">
            <FormatNumber value={entryPrice} precision={precision} />
          </Text>
          <Text as="div" color="text60">
            <ChangeRate value={yearProfitRate} />
          </Text>
        </div>
      </TD>

      <TD>
        <Text as="div" color="text40">
          {_t('gridform26')}
        </Text>
        <Text as="div" color="text60">
          <FormatNumber value={down} precision={precision} />
          ~
          <FormatNumber value={up} precision={precision} />
        </Text>
      </TD>

      <TD>
        <Text as="div" color="text40">
          <LabelPopover tipKey="funding" straName="CONTRACT_GRID">
            {_t('futrgrid.assetrate')}
          </LabelPopover>
        </Text>
        <Text as="div" color="text60">
          <FormatNumber value={fundingFee} precision={profitPrecision} />
        </Text>
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
