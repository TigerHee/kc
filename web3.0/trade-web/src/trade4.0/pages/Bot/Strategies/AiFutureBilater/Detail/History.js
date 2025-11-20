/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber, isNull } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Tag } from 'Bot/components/Common/FutureTag';

const MTag = ({ item }) => {
  const statusText = {
    GO_LONG: _t('kaiduo'),
    CLOSE_LONG: _t('pingduo'),
    GO_SHORT: _t('kaikong'),
    CLOSE_SHORT: _t('pingkong'),
  };
  let CTag = null;
  if (item.actionLabel) {
    CTag = (
      <Tag
        color={['CLOSE_SHORT', 'GO_LONG'].includes(item.actionLabel) ? 'primary' : 'secondary'}
      >
        {statusText[item.actionLabel]}
      </Tag>
    );
  }
  return CTag;
};
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
      Tag: <MTag item={item} />,
      lists: [
        {
          label: _t('stoporders6'),
          value: !isNull(item.price) ? formatNumber(item.price, precision) : '--',
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
          value: formatNumber(item.dealFunds),
          unit: quota,
          inSameColumn: 1,
        },
        {
          label: _t('card8'),
          value: item.profit ? formatEffectiveDecimal(item.profit, profitPrecision) : null,
          unit: quota,
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
      modelName="aiFutureBilater"
      formatFieldFunc={formatFieldFunc}
      hasDetail={false}
    />
  );
};
