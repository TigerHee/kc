/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { DashText } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useFutureSymbolInfo from 'Bot/hooks/useFutureSymbolInfo';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import Popover from 'Bot/components/Common/Popover';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import { getTrendText } from 'AiSpotTrend/config';
import { OpenOrderPageChart } from 'AiSpotTrend/components/charts';
import moment from 'moment';
import Decimal from 'decimal.js';
import CardWrap from 'Bot/components/Common/history/OrderList';
import isEmpty from 'lodash/isEmpty';

const DetailHold = ({ open }) => {
  const { trend, trendValue, currentQty } = open;
  const columns = [
    {
      label: _t('shorttimetrend'),
      value: getTrendText(trend),
    },
    {
      label: (
        <Popover placement="top" content={<p className="fs-14">{_t('tendsize.hint')}</p>}>
          <DashText fs={12} lh="130%">
            {_t('tendsize')}
          </DashText>
        </Popover>
      ),
      value: trendValue ? formatEffectiveDecimal(trendValue, 2) : '--',
    },
    {
      label: `${_t('futrgrid.chichangnum')}(${_t('futrgrid.zhang')})`,
      value: currentQty ? formatNumber(currentQty) : '--',
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};

const getDealValue = (activeOrder, multiplier) => {
  if (activeOrder.size && activeOrder.price) {
    return Decimal(activeOrder.size)
      .times(multiplier)
      .times(activeOrder.price)
      .toFixed(14, Decimal.ROUND_DOWN);
  }
  return null;
};
const Orders = ({ activeOrder = [], symbolInfo }) => {
  if (isEmpty(activeOrder)) return null;
  const { symbolNameText, quota, precision, multiplier } = symbolInfo;
  const items = activeOrder?.map((item) => {
    const dealValue = getDealValue(item, multiplier);
    const meta = {
      id: item.id,
      symbolNameText,
      side: item.side,
      type: item.type, // 订单类型
      time: localDateTimeFormat(item.completionAt),
      _item: item,
      _symbolInfo: symbolInfo,
      hasArrow: false,
      onClick: () => {},
      lists: [
        {
          label: _t('stoporders4'),
          value: formatNumber(item.size, precision),
          unit: _t('futrgrid.zhang'),
        },
        {
          label: _t('39PAVxwJpAU9LKqJP8q23m'),
          value: formatNumber(item.price, precision),
          unit: quota,
        },
        {
          label: _t('wWW3JmsPNhw76rPKWUPU58'),
          value: dealValue ? formatNumber(dealValue, precision) : null,
          unit: quota,
        },
      ],
    };
    return meta;
  });
  return <CardWrap items={items} notState />;
};

const modelName = 'aifuturetrend';
export default ({ isActive, onClose, runningData: { id, symbolCode }, mode }) => {
  const open = useSelector((state) => state[modelName].open);
  const CurrentLoading = useSelector((state) => state[modelName].CurrentLoading);
  const symbolInfo = useFutureSymbolInfo(symbolCode);
  const dispatch = useDispatch();

  const noMore = open.noMore;
  const onFetchMore = useCallback(
    (endTime = Date.now()) => {
      if (noMore) return;
      dispatch({
        type: `${modelName}/getOpenOrders`,
        payload: {
          taskId: id,
          endTime: moment(endTime).valueOf(),
        },
      });
    },
    [noMore],
  );
  useEffect(() => {
    onFetchMore();
  }, []);
  if (CurrentLoading) return null;
  const { speedLines, arbitrageInfo } = open;
  return (
    <div>
      <DetailHold open={open} />
      {speedLines.length > 0 && (
        <OpenOrderPageChart
          speedLines={speedLines}
          arbitrageInfo={arbitrageInfo}
          onScrollLeftFetch={onFetchMore}
          symbolInfo={symbolInfo}
          hint={_t('futurecta.openorderchart')}
          mb={10}
        />
      )}
      <Orders symbolInfo={symbolInfo} activeOrder={open.activeOrder} />
    </div>
  );
};
