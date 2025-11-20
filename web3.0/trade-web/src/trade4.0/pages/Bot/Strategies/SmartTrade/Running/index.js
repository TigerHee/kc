/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { TR, TD } from 'Bot/components/Common/CTable';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { FormatNumber, Profit, ChangeRate } from 'Bot/components/ColorText';
import RunningOperation, { getStopInfo } from 'Bot/Strategies/components/RunningOperation';
import { isJustCreateBot } from 'Bot/utils/util';
import { formatSpanDuration } from 'Bot/helper';
import { CouponTop } from 'Bot/Strategies/components/Coupon';
import RunTimes from 'Bot/Strategies/components/RunningOperation/RunTimes';
import useStateRef from '@/hooks/common/useStateRef';
import Method from '../components/Method';
import { getSymbolsNameTexts } from '../util';
import CoinsPopover from '../components/CoinsPopover';
import AddInvest from 'SmartTrade/components/AddInvest';

export default ({ item, onFresh, coupon }) => {
  // item.status = 'WAIT_OPEN_UNIT_PRICE';
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
  } = item;

  const symbolInfo = {
    quota: 'USDT',
    quotaPrecision: 3,
    pricePrecision: 3,
    // 组合显示的交易对名字
    symbolNameText: getSymbolsNameTexts(snapshots),
  };
  const { symbolNameText, quota, quotaPrecision } = symbolInfo;

  const isJustCreated = isJustCreateBot(id);
  const stopInfo = getStopInfo(item, symbolInfo);
  const useDataRef = useStateRef({
    coupon,
    item,
    symbolInfo,
  });
  const addInvestRef = React.useRef();
  const onTriggerInvestment = React.useCallback(() => {
    const { item: block } = useDataRef.current;
    if (block.status !== 'RUNNING') return;
    addInvestRef.current.toggle({ item: block });
  }, []);
  const operationProps = {
    isJustCreated,
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
            <CoinsPopover item={item}>
              <Text pr={6} color="text" as="div" cursor="pointer" className="running-dot">
                {symbolNameText}
              </Text>
            </CoinsPopover>

            <Text color="text40" className="middle-arbitrage">
              {formatSpanDuration(item.startTimeDifference)}
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
          <Text as="div" color="text40">
            {_t('smart.ajustway')}
          </Text>
          <Text as="div" color="text60">
            <Method onFresh={onFresh} options={item} />
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
          <RunningOperation {...operationProps} />
        </TD>
      </TR>
      <AddInvest actionSheetRef={addInvestRef} onFresh={onFresh} />
    </>
  );
};
