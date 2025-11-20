/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import { DashText } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSpotSymbolInfo from 'Bot/hooks/useSpotSymbolInfo';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import Popover from 'Bot/components/Common/Popover';
import { DetailHoldTemp } from 'Bot/components/Common/DetailHold';
import { getTrendText } from 'AiSpotTrend/config';
import { OpenOrderPageChart } from 'AiSpotTrend/components/charts';
import moment from 'moment';
import Decimal from 'decimal.js';
import isEmpty from 'lodash/isEmpty';
import CardWrap from 'Bot/components/Common/history/OrderList';

const DetailHold = ({ open }) => {
  const { trend, trendValue, baseAmount } = open;
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
      label: _t('currentpositions'),
      value: baseAmount || '--',
    },
  ];
  return <DetailHoldTemp columns={columns} />;
};

const getDealValue = (activeOrder) => {
  if (activeOrder.size && activeOrder.price) {
    return Decimal(activeOrder.size).times(activeOrder.price).toFixed(14, Decimal.ROUND_DOWN);
  }
  return null;
};
const Orders = ({ activeOrder = [], symbolInfo }) => {
  if (isEmpty(activeOrder)) return null;
  const { symbolNameText, quota, quotaPrecision, base, basePrecision } = symbolInfo;

  const items = activeOrder?.map((item) => {
    const dealValue = getDealValue(item);
    return {
      id: item.id,
      symbolNameText,
      side: item.side,
      type: item.type, // 订单类型
      time: localDateTimeFormat(item.completionAt),
      hasArrow: false,
      onClick: () => {},
      lists: [
        {
          label: _t('stoporders4'),
          value: formatNumber(item.size, basePrecision),
          unit: quota,
        },
        {
          label: _t('39PAVxwJpAU9LKqJP8q23m'),
          value: formatNumber(item.price, quotaPrecision),
          unit: base,
        },
        {
          label: _t('wWW3JmsPNhw76rPKWUPU58'),
          value: dealValue ? formatNumber(dealValue, quotaPrecision) : null,
          unit: quota,
        },
      ],
    };
  });

  return <CardWrap items={items} notState />;
};

const modelName = 'aispottrend';
export default ({ isActive, onClose, runningData: { id, symbol }, mode }) => {
  const open = useSelector((state) => state[modelName].open);
  const CurrentLoading = useSelector((state) => state[modelName].CurrentLoading);
  const symbolInfo = useSpotSymbolInfo(symbol);
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
          mb={10}
        />
      )}
      <Orders symbolInfo={symbolInfo} activeOrder={open.activeOrder} />
    </div>
  );
};
