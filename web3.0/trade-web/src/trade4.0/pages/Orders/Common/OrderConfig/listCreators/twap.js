/**
 * Owner: harry.lai@kupotech.com
 */
import { _t } from 'utils/lang';
import {
  c_time,
  c_symbol,
  c_side,
  c_amount,
  c_symbol_mini,
  createTwapConditionColumn,
  createTwapAvgPriceColumn,
  createTwapCancelOperatorColumn,
  createTwapHistoryStatusColumn,
} from '../columns';
import { mergeColumnElementsWithRange } from '../utils';

// 当前委托
export const twapOrderCreator = ({
  side = '',
  screen,
  onSelectChange,
  cancelAllOrder,
  cancelOrder,
  viewDetail,
  routeToSymbol,
  runOrPauseOrder, // twap 订单暂停或者运行
  ...others
}) => {
  const cancel_operator = createTwapCancelOperatorColumn({
    onCancelAll: cancelAllOrder,
    onCancel: cancelOrder,
    runOrPauseOrder,
    config: { ...others },
  });

  // screen为sm、md时，使用card list
  if (['sm', 'md', 'lg'].includes(screen)) {
    // 第一列是搜索条件
    return [
      [c_side(side, onSelectChange, 'orderTwap', 7)],
      c_symbol_mini(
        {
          timeKey: 'createdAt',
          operator: cancel_operator,
        },
        screen,
        '',
        routeToSymbol,
        'orderTwap',
        { hiddenTypeText: true, isTwapStyle: true }, // hiddenTypeTexttwap订单展示时不显示交易类型 ,isTwapStyle 启用twap样式
      ),
      createTwapConditionColumn(),
      c_amount({ key: 'singleOrderSize', label: _t('3Vxdu1Xchn2NhqKtXcA5kR') }),
      createTwapAvgPriceColumn(),
      c_amount({ key: 'size', label: _t('orders.c.total.size') }),
      c_amount({ key: 'filledSize', label: _t('orders.c.traded'), viewDetail }),
    ];
  }

  const fullColumnList = [
    c_time({ key: 'createdAt' }),
    c_symbol(routeToSymbol, 'orderTwap'),
    c_side(side, onSelectChange, 'orderTwap', 7),
    createTwapConditionColumn(),
    c_amount({ key: 'singleOrderSize', label: _t('3Vxdu1Xchn2NhqKtXcA5kR') }),
    createTwapAvgPriceColumn(),
    c_amount({ key: 'size', label: _t('orders.c.total.size') }),
    c_amount({ key: 'filledSize', label: _t('orders.c.traded'), viewDetail }),
    cancel_operator,
  ];

  if (screen === 'lg1') {
    return mergeColumnElementsWithRange(fullColumnList, [
      { leftIndex: 1, rightIndex: 2, options: { align: 'left' } },
      { leftIndex: 3, rightIndex: 4, options: { align: 'left' } },
      { leftIndex: 6, rightIndex: 7, options: { align: 'right' } },
    ]);
  }

  if (screen === 'lg2') {
    return mergeColumnElementsWithRange(fullColumnList, [{ leftIndex: 6, rightIndex: 7 }]);
  }
  // lg3
  return fullColumnList;
};

/** 时间加权历史订单创建器 */
export const twapHistoryOrderCreator = ({
  side = '',
  status = '',
  screen,
  onSelectChange,
  viewDetail,
  routeToSymbol,
}) => {
  const statusOperator = createTwapHistoryStatusColumn({
    value: status,
    onChange: onSelectChange,
    sensorKey: 'orderTwapHistory',
    sensorType: 6,
  });

  // screen为sm、md时，使用card list
  if (['sm', 'md', 'lg', 'lg1'].includes(screen)) {
    // 第一列是搜索条件
    return [
      [c_side(side, onSelectChange, 'orderTwapHistory', 7)],
      c_symbol_mini(
        {
          timeKey: 'createdAt',
          operator: statusOperator,
        },
        screen,
        '',
        routeToSymbol,
        'orderTwapHistory',
        { hiddenTypeText: true }, // 隐藏交易类型
      ),
      createTwapConditionColumn(),
      createTwapAvgPriceColumn(),
      c_amount({ key: 'size', label: _t('orders.c.total.size') }),
      c_amount({ key: 'filledSize', label: _t('orders.c.traded'), viewDetail }),
    ];
  }
  const fullColumnList = [
    c_time({ key: 'createdAt' }),
    c_symbol(routeToSymbol, 'orderTwapHistory'),
    c_side(side, onSelectChange, 'orderTwapHistory', 7),
    createTwapConditionColumn(),
    createTwapAvgPriceColumn(),
    c_amount({ key: 'size', label: _t('orders.c.total.size') }),
    c_amount({ key: 'filledSize', label: _t('orders.c.traded'), viewDetail }),
    statusOperator,
  ];

  // if (screen === 'lg1') {
  //   return mergeColumnElementsWithRange(fullColumnList, [
  //     { leftIndex: 3, rightIndex: 4, options: { align: 'left' } },
  //     { leftIndex: 5, rightIndex: 6, options: { align: 'left' } },
  //   ]);
  // }
  if (screen === 'lg2') {
    return mergeColumnElementsWithRange(fullColumnList, [{ leftIndex: 5, rightIndex: 6 }]);
  }
  // lg3
  return fullColumnList;
};
