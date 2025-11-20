/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import {
  FormatNumber,
  Profit,
  ChangeRate,
  Price,
} from 'Bot/components/ColorText';
import RunningOperation, {
  getStopInfo,
} from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import CountDown from 'Bot/components/Common/CountDown';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import { getInverstCycle } from '../config';

/**
 * @description: 自定义类型
 * @return {*}
 */
const getCustomStatus = ({
  hasEnoughMoney,
  isReachMaxTotalCost,
  isNextExceedMaxTotalCost,
  status,
}) => {
  // 定投投资钱不够
  let customStatus = hasEnoughMoney === false ? 'DCA_MONEY_ENOUGH' : status;
  // 定投投资额度不够
  const isOutTotalLimit = !!isReachMaxTotalCost || !!isNextExceedMaxTotalCost;

  customStatus = isOutTotalLimit ? 'DCA_INVERST_VOL_NOT_ENOUGH' : customStatus;
  return customStatus;
};

export default ({
  item: newItem,
  onFresh,
  coupon,
}) => {
  // item.status = 'WAIT_OPEN_UNIT_PRICE';
  // newItem.isReachMaxTotalCost = true;
  const item = { ...newItem };
  item.status = getCustomStatus(item);

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
  const isJustCreated = isJustCreateBot(id);

  const stopInfo = getStopInfo(item, symbolInfo);

  const operationProps = {
    isJustCreated,
    status,
    stopInfo,
    onFresh,
    item,
  };

  const formater = React.useCallback(
    ({ day, time }) => {
      if (+day !== 0) {
        return _tHTML('auto.runcardcountdownwithday', {
          day,
          time,
          amount,
          base,
          quota,
        });
      } else {
        return _tHTML('auto.runcardcountdown', { time, amount, base, quota });
      }
    },
    [base, quota, amount],
  );
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
            <Price
              value={price}
              changeRate={changeRate}
              precision={pricePrecision}
            />
          </div>
          <Text color="text40" className="middle-arbitrage">
            <CountDown nextTime={item.nextTimeDifference} formater={formater} />
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
        <RunningOperation {...operationProps} />
      </TD>
    </TR>
  );
};
