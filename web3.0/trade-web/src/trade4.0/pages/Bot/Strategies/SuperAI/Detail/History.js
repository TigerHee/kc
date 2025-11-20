/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import Decimal from 'decimal.js';
import { _t, _tHTML } from 'Bot/utils/lang';

// 卖单均价：( dealFunds-fee) / dealSize
// 买单均价：( dealFunds+fee) / dealSize
const getAvgPrice = (list, pricePrecision) => {
  const { side, dealFunds, dealSize } = list || {};
  let { fee } = list || {};
  if (!dealSize || !dealFunds) return 0;
  fee = fee || 0;
  if (side === 'sell') {
    return formatNumber(
      Decimal(dealFunds).sub(fee).div(dealSize).toFixed(pricePrecision, Decimal.ROUND_DOWN),
    );
  }
  return formatNumber(
    Decimal(dealFunds).add(fee).div(dealSize).toFixed(pricePrecision, Decimal.ROUND_DOWN),
  );
};
const formatFieldFunc = ({ items, symbolInfo }) => {
  const { base, quota, symbolNameText, pricePrecision, basePrecision, quotaPrecision } = symbolInfo;
  return items.map((item) => {
    const avgPrice = getAvgPrice(item, pricePrecision);
    return {
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
          label: _t('stoporders6'),
          value: avgPrice,
          unit: quota,
        },
        {
          label: _t('clsgrid.dealednum'),
          value: formatNumber(item.dealSize, basePrecision),
          unit: base,
          inSameColumn: 1,
        },
        {
          label: _t('clsgrid.dealede'),
          value: formatNumber(item.dealFunds, quotaPrecision),
          unit: quota,
          inSameColumn: 1,
        },
        {
          label: _t('card8'),
          value:
            item.side === 'sell' && item.type === 'limit' && Number(item.profit)
              ? formatEffectiveDecimal(item.profit, quotaPrecision)
              : null,
          unit: quota,
          rawValue: item.profit,
          isProfitField: true,
        },
      ],
    };
  });
};
export default (props) => {
  return (
    <HistoryTemp
      {...props}
      modelName="superai"
      formatFieldFunc={formatFieldFunc}
      hasDetail={false}
    />
  );
};
