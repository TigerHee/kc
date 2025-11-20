/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback } from 'react';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import OpenOrderPK from 'Bot/components/Common/OpenOrderPK';
import OpenOrderTable from 'Bot/components/Common/OpenOrderTable';
import OpenOrdersLimit from 'Bot/components/Common/OpenOrdersLimit';
import useTicker from 'Bot/hooks/useTicker';
import { formatNumber } from 'Bot/helper';
import { useSelector, useDispatch } from 'dva';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import FutureTag from 'Bot/components/Common/FutureTag';
import { handleNum } from 'Bot/utils/util';
import { Text, Flex } from 'Bot/components/Widgets';
import { Profit } from 'Bot/components/ColorText';

const DetailHold = ({ item, symbolInfo }) => {
  const { profitPrecision, precision } = symbolInfo;
  const columns = [
    {
      label: _t('holdcomprice'),
      value: item.isEmpty ? item.avgEntryPrice : formatNumber(item.avgEntryPrice, precision),
    },
    {
      label: _t('futrgrid.blowuppricenow'),
      value: item.isEmpty ? item.liquidationPrice : formatNumber(item.liquidationPrice, precision),
    },
    {
      label: _t('positionProfit'),
      value: item.isEmpty ? (
        item.unrealisedPnl
      ) : (
        <Profit as="div" fs={16} value={item.unrealisedPnl} precision={profitPrecision} />
      ),
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};

const DetailHoldTwo = ({ positionDetails, symbolInfo }) => {
  return positionDetails.map((item, index) => {
    return (
      <div>
        <Flex vc>
          <Text fs={14} fw={500} color="text" mr={8}>
            {symbolInfo.symbolNameText}
          </Text>
          <FutureTag direction={index === 0 ? 'short' : 'long'} leverage={item.leverage} fs={14} />
        </Flex>
        <div className="mb-12">
          <Text color="text40" fs={12} mr={4}>
            {_t('positionsNum')}
          </Text>
          <Text color="text" fs={14}>
            {item.currentQty}
          </Text>
        </div>
        <DetailHold item={item} symbolInfo={symbolInfo} />
      </div>
    );
  });
};

export default ({ isActive, onClose, runningData: { id, symbolCode, status }, mode }) => {
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const open = useSelector((state) => state.aiFutureBilater.open);
  const positionDetails = useSelector((state) => state.aiFutureBilater.positionDetails);
  const CurrentLoading = useSelector((state) => state.aiFutureBilater.CurrentLoading);

  const dispatch = useDispatch();
  const fresh = useCallback(() => {
    dispatch({
      type: 'aiFutureBilater/getOpenOrders',
      payload: {
        taskId: id,
        symbol: symbolCode,
      },
    });
  }, []);
  useTicker(fresh, 'immediately', null, isActive);

  const [buyNum, sellNum] = handleNum(open);
  if (CurrentLoading) return null;
  return (
    <div className="pt-16">
      <DetailHoldTwo positionDetails={positionDetails} symbolInfo={symbolInfo} />
      {status === 'RISK_PROTECTION' ? (
        <OpenOrdersLimit isActive={isActive} />
      ) : (
        (open.buyNum > 0 || open.sellNum > 0) && (
          <>
            <OpenOrderPK buyNum={buyNum} sellNum={sellNum} />
            <OpenOrderTable
              data={open.items}
              info={{
                base: _t('futrgrid.zhang'),
                quota: symbolInfo.quota,
                pricePrecision: symbolInfo.precision,
                basePrecision: 0,
              }}
            />
          </>
        )
      )}
    </div>
  );
};
