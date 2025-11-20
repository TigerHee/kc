/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Flex, Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { ICSortDownOutlined, ICSortUpOutlined } from '@kux/icons';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'dva';

const SortDown = styled(ICSortDownOutlined)`
  fill: ${({ theme, active }) => theme.colors[active ? 'primary' : 'icon60']};
  transform: translateY(-4px);
`;
const SortUp = styled(ICSortUpOutlined)`
  fill: ${({ theme, active }) => theme.colors[active ? 'primary' : 'icon60']};
  transform: translateY(2px);
`;

const sortSetting = () => ['down', 'up', 'none'];

const TH = ({ children, onSort, activeSort, keyName, ...rest }) => {
  const sorterRef = useRef(sortSetting());
  const [sort, setSort] = useState('none');
  const sortHandle = useCallback(() => {
    const now = sorterRef.current.shift();
    sorterRef.current.push(now);
    onSort && onSort(keyName, now);
  }, [onSort, keyName]);
  useEffect(() => {
    const { key, sort: outSort } = activeSort;
    // 不等于，就设置默认
    if (key !== keyName) {
      resetSort();
    } else {
      // 等于就激活
      setSort(outSort);
      // up => down none up
      // down => none up down
      // 设置当前排序顺序
      if (outSort === 'none') {
        sorterRef.current = sortSetting();
      } else {
        sorterRef.current = outSort === 'down' ? ['up', 'none', 'down'] : ['none', 'down', 'up'];
      }
    }
  }, [activeSort, keyName]);

  const resetSort = useCallback(() => {
    setSort('none');
    sorterRef.current = sortSetting();
  }, []);
  return (
    <Flex vc cursor {...rest} onClick={sortHandle}>
      <Text fs={12} lh="24px" color="text40" mr={2}>
        {children}
      </Text>
      <Flex v as="span">
        <SortUp active={sort === 'up'} size={12} />
        <SortDown active={sort === 'down'} size={12} />
      </Flex>
    </Flex>
  );
};
export default () => {
  const dispatch = useDispatch();
  const activeSort = useSelector((state) => state.smarttrade.createSort);
  //   const activeSort = {
  //     key: 'dailyChangeRate',
  //     sort: 'down',
  //   };
  const sortHandle = useCallback((key, sort) => {
    //   onSort(key, sort, sorter[key]);
    dispatch({
      type: 'smarttrade/update',
      payload: {
        createSort: {
          key,
          sort,
        },
      },
    });
  }, []);

  return (
    <Flex vc mb={8} mt={-4}>
      <TH keyName="dailyChangeRate" onSort={sortHandle} activeSort={activeSort} mr={16}>
        {_t('smart.24hours')}
      </TH>
      <TH keyName="weeklyChangeRate" onSort={sortHandle} activeSort={activeSort} mr={16}>
        {_t('smart.recent7days')}
      </TH>
      <TH keyName="monthlyChangeRate" onSort={sortHandle} activeSort={activeSort}>
        {_t('smart.recent30days')}
      </TH>
    </Flex>
  );
};
