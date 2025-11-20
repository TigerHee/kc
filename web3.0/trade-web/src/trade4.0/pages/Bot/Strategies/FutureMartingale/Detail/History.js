/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber, isNull } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';

const formatFieldFunc = ({ items, symbolInfo }) => {
  const { quota, symbolNameText, precision, profitPrecision } = symbolInfo;
  return items.map((item) => {
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
          value: !isNull(item.realPrice) ? formatNumber(item.realPrice, precision) : '--',
          unit: quota,
        },
        {
          label: _t('clsgrid.dealednum'),
          value: formatNumber(item.dealSize),
          unit: _t('futrgrid.zhang'),
          inSameColumn: 1,
        },
        {
          label: _t('clsgrid.dealede'),
          value: formatNumber(item.dealValue),
          unit: quota,
          inSameColumn: 1,
        },
        {
          label: _t('soJMwxHAKzNREmaAgBB4Ki'),
          value:
            Number(item.profit) !== 0 ? formatEffectiveDecimal(item.profit, profitPrecision) : null,
          rawValue: item.profit,
          isProfitField: true,
          unit: item.profit ? quota : undefined,
        },
      ],
    };
  });
};
export default (props) => {
  return (
    <HistoryTemp
      {...props}
      modelName="futuremartingale"
      formatFieldFunc={formatFieldFunc}
      hasDetail={false}
    />
  );
};
