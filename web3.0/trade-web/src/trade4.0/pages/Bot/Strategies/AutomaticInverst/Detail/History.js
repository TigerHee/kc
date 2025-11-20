/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { localDateTimeFormat, formatNumber } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { getDealAvg } from 'Bot/utils/util';

const formatFieldFunc = ({ items, symbolInfo }) => {
  const { base, quota, symbolNameText, pricePrecision, basePrecision, quotaPrecision } = symbolInfo;
  return items.map((item) => {
    const avgPrice = getDealAvg(item, pricePrecision);
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
        },
        {
          label: _t('clsgrid.dealede'),
          value: formatNumber(item.dealFunds, quotaPrecision),
          unit: quota,
        },
      ],
    };
  });
};
export default (props) => {
  return (
    <HistoryTemp
      {...props}
      modelName="automaticinverst"
      formatFieldFunc={formatFieldFunc}
      hasDetail={false}
    />
  );
};
