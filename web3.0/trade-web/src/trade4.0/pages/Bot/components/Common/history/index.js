/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { useMediaQuery } from '@kux/mui/hooks';
import StopLists from './OrderList';
import StopTable from './OrderTable';
import useTax from './useTax';

/**
 * @description: 已成交订单展示主入口
 * @param {*} props
 * @return {*}
 */
const StopOrder = React.memo((props) => {
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { items, ...rest } = props;
  if (!items.length) return null;

  const _items = useTax(items);

  return isH5 ? <StopLists items={_items} {...rest} /> : <StopTable items={_items} {...rest} />;
});

export default StopOrder;
