/**
 * Owner: harry.lai@kupotech.com
 */
import includes from 'lodash/includes';
import { _t } from 'utils/lang';
import {
  c_time,
  c_symbol,
  c_type,
  c_side,
  c_price,
  c_funds,
  c_trigger_price,
  c_amount,
  c_amount_stop,
  c_amount_history,
  c_amount_history_traded,
  c_fee,
  c_status,
  c_cancel_operator,
  c_symbol_mini,
} from '../columns';
import { filterList } from '../utils';
import { mergeColumns } from '../nodeHelper';
import { current_types, stop_types, types } from '../constants';

// 当前委托
export const currentCreator = ({
  side = '',
  type = '',
  ocoEnable,
  tradeType,
  tsoEnable,
  screen,
  onSelectChange,
  cancelAllOrder,
  cancelOrder,
  viewDetail,
  routeToSymbol,
  ...others
}) => {
  const cancel_operator = c_cancel_operator({
    onCancelAll: cancelAllOrder,
    onCancel: cancelOrder,
    config: { ...others },
  });

  let columns = [];
  // 当前委托 1024以下 使用card list
  if (includes(['sm', 'md', 'lg', 'lg1'], screen)) {
    // screen为sm、md、lg时，使用card list
    // 第一列是搜索条件
    columns = [
      [
        c_type(
          filterList(current_types, { ocoEnable, tradeType, tsoEnable }),
          type,
          onSelectChange,
          'openOrders',
          6,
        ),
        c_side(side, onSelectChange, 'openOrders', 7),
      ],
      c_symbol_mini(
        {
          timeKey: 'orderTime',
          operator: cancel_operator,
        },
        screen,
        '',
        routeToSymbol,
        'openOrder',
      ),
      c_price({ key: 'price', label: _t('orders.c.price') }),
      c_amount({ key: 'total', label: _t('orders.c.total') }),
      {
        ...c_amount({ key: 'traded', label: _t('orders.c.traded'), viewDetail }),
        needOperator: true,
      },
      c_amount({ key: 'size', label: _t('orders.c.size') }),
    ];
  } else {
     // 当前委托 1024以上 使用table
    columns = [
      c_time({ key: 'orderTime' }),
      c_symbol(routeToSymbol, 'openOrder'),
      c_type(
        filterList(current_types, { ocoEnable, tradeType, tsoEnable }),
        type,
        onSelectChange,
        'openOrders',
        6,
      ),
      c_side(side, onSelectChange, 'openOrders', 7),
      c_price({ key: 'price', label: _t('orders.c.price') }),
      c_amount({ key: 'total', label: _t('orders.c.total') }),
      {
        ...c_amount({ key: 'traded', label: _t('orders.c.traded'), viewDetail }),
        needOperator: true,
      },
      c_amount({ key: 'size', label: _t('orders.c.size') }),
      {
        ...cancel_operator,
        needOperator: true,
      },
    ];
  }
  return columns;
};

// 高级委托
export const stopCreator = ({
  side = '',
  type = '',
  ocoEnable,
  tsoEnable,
  tradeType,
  tipContainer,
  screen,
  onSelectChange,
  cancelAllOrder,
  cancelOrder,
  routeToSymbol,
  ...others
}) => {
  const cancel_operator = c_cancel_operator({
    onCancelAll: cancelAllOrder,
    onCancel: cancelOrder,
    config: { ...others },
  });

  let columns = [];
  if (includes(['sm', 'md', 'lg'], screen)) {
    // screen为sm、md、lg时，使用card list
    columns = [
      [
        c_type(
          filterList(stop_types, { ocoEnable, tradeType, tsoEnable }),
          type,
          onSelectChange,
          'openOrders',
          6,
        ),
        c_side(side, onSelectChange, 'openOrders', 7),
      ],
      c_symbol_mini(
        {
          timeKey: 'orderTime',
          operator: cancel_operator,
        },
        screen,
        '',
        routeToSymbol,
        'orderStop',
      ),
      c_trigger_price({ orderType: 'orderStop' }),
      c_price({ key: 'price', label: _t('orders.c.price') }),
      c_amount_stop(),
    ];
  } else {
    columns = [
      c_time({ key: 'orderTime' }),
      c_symbol(routeToSymbol, 'orderStop'),
      c_type(
        filterList(stop_types, { ocoEnable, tradeType, tsoEnable }),
        type,
        onSelectChange,
        'openOrders',
        6,
      ),
      c_side(side, onSelectChange, 'openOrders', 7),
    ];
    if (screen === 'lg1') {
      // screen为lg1时，合并部分列
      const otherColumns = [
        c_amount_stop(),
        {
          ...mergeColumns(
            c_trigger_price({ tipContainer, orderType: 'orderStop' }),
            c_price({ key: 'price', label: _t('orders.c.price') }),
          ),
        },
      ];
      columns = columns.concat(otherColumns);
    } else {
      const otherColumns = [
        c_trigger_price({ tipContainer, orderType: 'orderStop' }),
        c_price({ key: 'price', label: _t('orders.c.price') }),
        c_amount_stop(),
      ];
      columns = columns.concat(otherColumns);
    }

    columns.push({
      ...cancel_operator,
      needOperator: true,
    });
  }
  return columns;
};

// 历史委托
export const historyCreator = ({
  side = '',
  type = '',
  cancelExist = '',
  screen,
  ocoEnable,
  tsoEnable,
  tradeType,
  tipContainer,
  onSelectChange,
  viewDetail,
  routeToSymbol,
}) => {
  const status_operator = c_status({
    value: cancelExist,
    onChange: onSelectChange,
    sensorKey: 'orderHistory',
    sensorType: 6,
  });

  let columns = [];
  if (includes(['sm', 'md', 'lg', 'lg1'], screen)) {
    // screen为sm、md、lg、lg1时，使用card list
    columns = [
      [
        c_type(
          filterList(types, { ocoEnable, tradeType, tsoEnable }),
          type,
          onSelectChange,
          'orderHistory',
          4,
        ),
        c_side(side, onSelectChange, 'orderHistory', 5),
        {
          ...status_operator,
        },
      ],
      c_symbol_mini(
        {
          timeKey: 'createdAt',
          describe: status_operator,
        },
        screen,
        '',
        routeToSymbol,
        'orderHis',
      ),
      c_trigger_price({ orderType: 'history' }),
      c_price({ key: 'price', label: _t('orders.c.price') }),
      c_amount_history(),
      c_amount_history_traded({ viewDetail }),
      c_price({ key: 'avgPrice', label: _t('orders.c.avg') }),
    ];
  } else {
    columns = [
      c_time({ key: 'createdAt', label: _t('orders.c.time') }),
      c_symbol(routeToSymbol, 'orderHis'),
      c_type(
        filterList(types, { ocoEnable, tradeType, tsoEnable }),
        type,
        onSelectChange,
        'orderHistory',
        4,
      ),
      c_side(side, onSelectChange, 'orderHistory', 5),
      c_trigger_price({ orderType: 'history', tipContainer }),
    ];
    if (screen === 'lg2') {
      const otherColumns = [
        c_price({ key: 'price', label: _t('orders.c.price') }),
        c_amount_history(),
        {
          ...mergeColumns(
            c_amount_history_traded({ viewDetail }),
            c_price({ key: 'avgPrice', label: _t('orders.c.avg') }),
          ),
        },
      ];
      columns = columns.concat(otherColumns);
    } else {
      const otherColumns = [
        c_price({ key: 'price', label: _t('orders.c.price') }),
        c_amount_history(),
        c_amount_history_traded({ viewDetail }),
        c_price({ key: 'avgPrice', label: _t('orders.c.avg') }),
      ];
      columns = columns.concat(otherColumns);
    }
    columns.push({
      ...status_operator,
    });
  }

  return columns;
};

// 成交明细
export const dealCreator = ({
  side = '',
  type = '',
  screen,
  ocoEnable,
  tsoEnable,
  tradeType,
  onSelectChange,
  event: { onFeeDetailClick: onClick },
  routeToSymbol,
}) => {
  let columns = [];
  if (includes(['sm', 'md', 'lg', 'lg1'], screen)) {
    // screen为sm、md、lg时，使用card list
    columns = [
      [
        c_type(
          filterList(types, { ocoEnable, tradeType, tsoEnable }),
          type,
          onSelectChange,
          'tradeHistory',
          4,
        ),
        c_side(side, onSelectChange, 'tradeHistory', 5),
      ],
      c_symbol_mini(
        {
          timeKey: 'createdAt',
        },
        screen,
        '',
        routeToSymbol,
        'tradeHistory',
      ),
      c_price({ key: 'price', label: _t('orders.c.dealprice') }),
      c_amount({ key: 'size', label: _t('orders.c.dealsize') }),
      c_funds(),
      c_fee({ onClick }),
    ];
  } else {
    columns = [
      c_time({ key: 'createdAt', label: _t('orders.c.created') }),
      c_symbol(routeToSymbol, 'tradeHistory'),
      c_type(
        filterList(types, { ocoEnable, tradeType, tsoEnable }),
        type,
        onSelectChange,
        'tradeHistory',
        4,
      ),
      c_side(side, onSelectChange, 'tradeHistory', 5),
      c_price({ key: 'price', label: _t('orders.c.dealprice') }),
      c_amount({ key: 'size', label: _t('orders.c.dealsize') }),
      c_funds(),
      c_fee({ onClick }),
    ];
  }

  return columns;
};
