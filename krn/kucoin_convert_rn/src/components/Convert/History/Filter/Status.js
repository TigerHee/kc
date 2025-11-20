/**
 * Owner: willen@kupotech.com
 */
import React, {useState, useEffect} from 'react';
import FilterItem from './FilterItem';
import useLang from 'hooks/useLang';
import {useSelector} from 'react-redux';
import {ORDER_STATUS_ENUM} from 'components/Convert/config';

const getStatusByArr = (arr = [], data) => arr.map(item => data[item]);

const getStatusList = (historyOrderType = 'MARKET') => {
  const mid = historyOrderType === 'MARKET' ? 'IN_ORDER' : 'FAIL';
  const arr = ['SUCCESS', mid, 'CANCEL'];
  return getStatusByArr(arr, ORDER_STATUS_ENUM);
};

export default ({onPressStatus}) => {
  const {_t} = useLang();
  const filters = useSelector(state => state.order.filters);
  const historyOrderType = useSelector(state => state.order.historyOrderType);

  const [statusList, setStatusList] = useState([]);

  const onPress = item => {
    const newList = statusList.map(i => ({
      ...i,
      selected: item.id === i.id ? (i.selected ? true : !i.selected) : false,
    }));
    setStatusList(newList);
    typeof onPressStatus === 'function' && onPressStatus(item.value);
  };

  useEffect(() => {
    const list = [
      {
        label: 'm6TjFvWkxDKvWjD4wm7Xvi',
        id: 'ALL',
        value: 'ALL',
        selected: true,
      },
      ...getStatusList(historyOrderType),
    ];
    const newList = list.map(i => ({
      ...i,
      selected: filters.status === i?.value,
      label: _t(i.label),
    }));
    setStatusList(newList);
  }, [filters, historyOrderType]);

  return (
    <FilterItem
      title={_t('2CCL8v5vo9vmXZZfr8fHYC')}
      list={statusList}
      onPress={onPress}
      style={{paddingBottom: 24}}
    />
  );
};
