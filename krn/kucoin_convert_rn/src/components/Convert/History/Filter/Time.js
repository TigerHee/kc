/**
 * Owner: willen@kupotech.com
 */
import React, {useEffect, useState} from 'react';
import FilterItem from './FilterItem';
import moment from 'moment';
import useLang from 'hooks/useLang';
import {useSelector} from 'react-redux';

export default ({onPressTime}) => {
  const {_t} = useLang();
  const timeFilters = useSelector(state => state.order.timeFilters);

  const [timeList, setTimeList] = useState([
    {
      label: _t('wtvv4TWzteyPW4KUjDj2Er'),
      id: '1week',
      value: {
        startTime: moment().subtract(1, 'week').format('x') * 1,
        endTime: moment().endOf('day').format('x') * 1,
      },
      selected: false,
    },
    {
      label: _t('451xJEBwp6RUNMTwgGgR6k'),
      id: '1month',
      value: {
        startTime: moment().subtract(1, 'month').format('x') * 1,
        endTime: moment().endOf('day').format('x') * 1,
      },
      selected: true,
    },
    {
      label: _t('4njg455F9UoeXuFTTkV2pT'),
      id: '3months',
      value: {
        startTime: moment().subtract(3, 'months').format('x') * 1,
        endTime: moment().endOf('day').format('x') * 1,
      },
      selected: false,
    },
  ]);

  const onPress = item => {
    const newList = timeList.map(i => {
      i.selected = item.id === i.id ? (i.selected ? true : !i.selected) : false;
      return i;
    });
    setTimeList(newList);

    typeof onPressTime === 'function' && onPressTime(item);
  };

  useEffect(() => {
    const newList = timeList.map(i => {
      i.selected = timeFilters === i.id;

      return i;
    });
    setTimeList(newList);
  }, [timeFilters]);

  return (
    <FilterItem
      title={_t('hzsNyW2CNBX64z9uo1p1bp')}
      list={timeList}
      onPress={onPress}
    />
  );
};
