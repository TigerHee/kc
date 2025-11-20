/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { getAjustDetail } from 'SmartTrade/services';
import { getSymbolInfo } from 'Bot/hooks/useSpotSymbolInfo';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import Empty from '@mui/Empty';
import { getDealAvg } from 'Bot/utils/util';
import StopOrder from 'Bot/components/Common/history';
import { _t, _tHTML } from 'Bot/utils/lang';
import { Spin } from '@kux/mui';
/**
 * @description:
 * @param {*} items
 * @return {*}
 */
const formatFieldFunc = ({ items }) => {
  return items.map((item) => {
    const symbolInfo = getSymbolInfo(item.symbol);
    const { base, quota, symbolNameText, pricePrecision, basePrecision, quotaPrecision } =
      symbolInfo;
    const avgPrice = getDealAvg(item, pricePrecision);
    return {
      id: item.id,
      symbolNameText,
      side: item.side,
      type: item.type, // 订单类型
      time: localDateTimeFormat(item.completionAt),
      _item: item,
      _symbolInfo: symbolInfo,
      hasArrow: Number(item.profit) > 0,
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
          label: _t('fee'),
          value: Number(item.fee) ? formatEffectiveDecimal(item.fee, quotaPrecision) : null,
          unit: quota,
        },
      ],
    };
  });
};
const HistoryDetail = ({ list: params, botTaskId }) => {
  const changeId = params.id;
  const taskId = botTaskId;
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getAjustDetail({ taskId, changeId })
      .then(({ data }) => {
        setLists(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [changeId, taskId]);

  if (loading) {
    return <Spin style={{ height: 260, width: '100%' }} size="small" />;
  }
  if (!loading && lists.length === 0) {
    return <div style={{ height: 260 }}><Empty /></div>;
  }
  return (
    <StopOrder
      items={formatFieldFunc({
        items: lists,
      })}
    />
  );
};

export default ({ dialogRef }) => {
  return (
    <DialogRef
      cancelText={null}
      okText={null}
      onCancel={() => dialogRef.current.toggle()}
      ref={dialogRef}
      title={_t('card16')}
      size="large"
      maskClosable
    >
      <HistoryDetail />
    </DialogRef>
  );
};
