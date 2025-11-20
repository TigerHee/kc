/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate, Price } from 'Bot/components/ColorText';
import PlaceOrderNum from 'Bot/Strategies/components/PlaceOrderNum.js';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import LabelPopover from 'Bot/Strategies/components/LabelPopover';
import useStateRef from '@/hooks/common/useStateRef';
import { getBlowUpPrice } from '../util';
import Popover from 'Bot/components/Common/Popover';
import FutureTag from 'Bot/components/Common/FutureTag';
import FutureAddMargin from 'Bot/Strategies/components/FutureAddMargin';
import { addMarginApiConfig } from 'FutureGrid/config';

export default ({ item, onFresh, coupon }) => {
  // item.status = 'RUNNING';
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
    direction,
    leverage,
    down,
    up,
    id,
    fundingFee, // 资金费率
    startTimeDifference, // 运行时间差
    canReInvestment, // 复投
    breakEvenPrice, // 盈亏平衡
  } = item;

  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const { symbolNameText, quota, precision, profitPrecision } = symbolInfo;
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
    status,
    stopInfo,
    onFresh,
    item,
    onTriggerInvestment,
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
              <Price value={price} changeRate={changeRate} precision={precision} />
            </div>
            <Text color="text40" className="middle-arbitrage">
            <RunTimes item={item} />
            </Text>
          </div>
        </TD>

        <TD>
          <RiskProtectionWrapper item={item} symbolInfo={symbolInfo}>
            <Text as="div" color="text40">
              {_t('card6')}({quota})
            </Text>
            <Text as="div" color="text60">
              <FormatNumber value={totalCost} precision={precision} />
            </Text>
          </RiskProtectionWrapper>
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
              <FormatNumber effective value={strategyProfit} precision={profitPrecision} />
            </Text>
            <Text as="div" color="text60">
              <FormatNumber effective value={floatingAmount} precision={profitPrecision} />
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
          <Text as="div" color="text40" className="sm-two-label">
            <span>{_t('gridform26')}</span>
            <span className="sm-split">/</span>
            <span>{_t('futrgrid.formgridnum')}</span>
          </Text>
          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber value={down} precision={precision} />
              ~
              <FormatNumber value={up} precision={precision} />
            </Text>
            <PlaceOrderNum buyNum={buyNum} sellNum={sellNum} />
          </div>
        </TD>
        <TD>
          <Text as="div" color="text40" className="sm-two-label">
            <LabelPopover tipKey="funding" straName="CONTRACT_GRID">
              {_t('futrgrid.assetrate')}
            </LabelPopover>
            <span className="sm-split">/</span>
            <span>{_t('futrgrid.blowupprice')}</span>
          </Text>
          <div className="sm-two-value">
            <Text as="div" color="text60">
              <FormatNumber value={fundingFee} precision={profitPrecision} />
            </Text>
            <Text as="div" color="text60">
              {getBlowUpPrice(item.blowUpPrice, precision)}
            </Text>
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
      />
    </>
  );
};

/**
 * @description: 触发风险限额 会有popover提示
 * @param {*} item
 * @param {*} symbolInfo
 * @param {*} children
 * @return {*}
 */
function RiskProtectionWrapper({ item, symbolInfo, children }) {
  if (item.status !== 'RISK_PROTECTION') return children;
  return (
    <Popover
      placement="top"
      content={
        <div>
          <p>
            {_t('futrgrid.restsureasset')}:{' '}
            <FormatNumber value={item.currentCost || 0} precision={symbolInfo.precision} />
          </p>
          <p>
            {_t('futrgrid.restpos')}: {+item.currentQty ? +item.currentQty : 0}{' '}
            {_t('futrgrid.zhang')}
          </p>
        </div>
      }
    >
      <div>{children}</div>
    </Popover>
  );
}
