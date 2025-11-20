/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import HistoryTemp from 'Bot/components/Common/history/template/HistoryTemp';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber, isNull } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import HistoryDetail from './HistoryDetail';

// 合约检查利润 该如何显示
export const checkStatus = (list, profitPrecision, mode) => {
  // 显示文字条件
  const isToBeClosed = Number(list.profit) === 0 && list.side === 'sell';
  let profitText;
  if (isToBeClosed) {
    if (mode === 'STOPPED') {
      // 强制平仓 只在历史记录显示
      if (list.stopReason === 'STOP_LIQUIDATED') {
        profitText = _t('futrgrid.hasblowup');
      } else {
        // 成交历史中 这种情况 直接显示 已平仓
        profitText = _t('futrgrid.hassell');
      }
    } else {
      // 卖单 profit为0 显示文字：待平仓 tooltip提示
      profitText = _t('futrgrid.waitsell');
    }
  } else {
    // 显示网格利润
    profitText = formatEffectiveDecimal(list.profit, profitPrecision);
  }

  return {
    profitText,
    isToBeClosed,
  };
};
const formatFieldFunc = ({ items, symbolInfo, onClick, showDetail, runningData: { status } }) => {
  const { quota, symbolNameText, precision, profitPrecision } = symbolInfo;

  return items.map((item) => {
    const { profitText, isToBeClosed } = checkStatus(item, profitPrecision, status);
    const profit = !!item.profit && item.side !== 'buy' ? profitText : null;
    return {
      id: item.id,
      symbolNameText,
      side: item.side,
      type: item.type, // 订单类型
      time: localDateTimeFormat(item.completionAt),
      _item: item,
      _symbolInfo: symbolInfo,
      hasArrow: true,
      onClick: () => {
        showDetail(item);
      },
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
          value: formatNumber(item.dealValue),
          unit: quota,
          inSameColumn: 1,
        },
        {
          label: _t('card8'),
          value: profit,
          className: isToBeClosed ? 'color-gray-bk' : profit ? 'color-primary-bk' : '',
          unit: isToBeClosed ? undefined : quota,
        },
      ],
    };
  });
};
export default (props) => {
  return (
    <HistoryTemp
      {...props}
      modelName="futuregrid"
      formatFieldFunc={formatFieldFunc}
      HistoryDetail={HistoryDetail}
    />
  );
};
