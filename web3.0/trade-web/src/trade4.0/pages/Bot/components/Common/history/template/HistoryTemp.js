/**
 * Owner: mike@kupotech.com
 */
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import StopOrder from 'Bot/components/Common/history';
import { _t, _tHTML } from 'Bot/utils/lang';
import useSymbolInfo from 'Bot/hooks/useSymbolInfo';
import HistoryPage from 'Bot/Strategies/components/HistoryPage';
import { formatEffectiveDecimal, localDateTimeFormat, formatNumber } from 'Bot/helper';
import { getDealAvg } from 'Bot/utils/util';
import { DialogRefWrapper } from 'Bot/components/Common/history/detail';
import isEmpty from 'lodash/isEmpty';
/**
 * @description: 现货网格/无限网格/杠杆网格
 * @param {*} items
 * @param {*} symbolInfo
 * @param {*} onClick
 * @return {*}
 */
const formatField = ({ items, symbolInfo, onClick, profitLabel }) => {
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
      hasArrow: Number(item.profit) > 0,
      onClick: () => {
        onClick(item);
      },
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
        // {
        //   label: (
        //     <LabelPopoverTemp
        //       title={_t('tax')}
        //       content={_t('tax.hint', { taxRate: floatToPercent(item._item.taxRate || dftTaxRate) })}
        //       viewMoreUrl="/support/30538829815833"
        //     >
        //       {_t('tax')}
        //     </LabelPopoverTemp>
        //   ),
        //   value: Number(item.tax) > 0 ? formatEffectiveDecimal(item.tax, quotaPrecision) : null,
        //   unit: quota,
        //   inSameColumn: 2,
        // },
        {
          label: profitLabel ?? _t('card8'),
          value: Number(item.profit) ? formatEffectiveDecimal(item.profit, quotaPrecision) : null,
          unit: quota,
          isProfitField: true,
          rawValue: item.profit,
          // inSameColumn: 2,
        },
      ],
    };
  });
};
/**
 * @description: 现货/无限/超级网格基本通用
 * @return {*}
 */
export default ({
  isActive,
  onClose,
  runningData, // 运行中的数据
  mode,
  modelName, // model名字
  formatFieldFunc = formatField, // 数据格式化函数
  Append,
  HistoryDetail,
  hasDetail = true, // 是否有匹配详情页面
  profitLabel,
}) => {
  const { id, symbolCode, symbol, status } = runningData;
  const code = symbolCode || symbol;
  // 内含hook判断
  // NOTICE
  const symbolInfo = useSymbolInfo(code);
  const dispatch = useDispatch();
  const stop = useSelector((state) => state[modelName].stop);
  const HistoryLoading = useSelector((state) => state[modelName].HistoryLoading);
  const dialogRef = useRef();
  useEffect(() => {
    isActive &&
      dispatch({
        type: `${modelName}/getStopOrders`,
        payload: {
          taskId: id,
          symbolCode: code,
        },
      });
  }, [isActive]);
  const showDetail = (item) => {
    dialogRef.current.toggle({
      stopOrderItem: item,
      symbolInfo,
      status,
    });
  };
  const onClick = (item) => {
    // 市价订单不能进入
    if (item.side !== 'sell' || item.type === 'market' || Number(item.profit) === 0) return;
    showDetail(item);
  };

  if (HistoryLoading) return null;
  const items = formatFieldFunc({
    items: stop.items,
    symbolInfo,
    onClick,
    showDetail,
    runningData,
    profitLabel,
  });
  return (
    <HistoryPage isShowHint={!isEmpty(items)} isEmpty={isEmpty(items) && !Append}>
      {Append}
      <StopOrder items={items} />
      {hasDetail && (
        <DialogRefWrapper dialogRef={dialogRef}>
          <HistoryDetail />
        </DialogRefWrapper>
      )}
    </HistoryPage>
  );
};
