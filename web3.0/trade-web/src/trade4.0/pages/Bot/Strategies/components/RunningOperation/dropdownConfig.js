/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { Text, Flex } from 'Bot/components/Widgets';
import { ICPlusOutlined, ICEdit2Outlined, ICOrdersHistoryOutlined } from '@kux/icons';
import { strasMap } from 'Bot/config';
import { _t, _tHTML } from 'Bot/utils/lang';

const allMenuConfigs = {
  onTriggerInvestment: {
    value: 'onTriggerInvestment',
    label: () => (
      <Flex vc>
        <ICPlusOutlined />
        <Text fs={14} pl={8}>
          {_t('hLtxXSxhoBH7tkCiKy2pG9')}
        </Text>
      </Flex>
    ),
  },
  onTriggerPriceRange: {
    value: 'onTriggerPriceRange',
    label: () => (
      <Flex vc>
        <ICEdit2Outlined />
        <Text fs={14} pl={8}>
          {_t('3Kq6aEwxQZsqrDAShxfWp7')}
        </Text>
      </Flex>
    ),
  },
  onTriggerStopProfit: {
    value: 'onTriggerStopProfit',
    label: () => (
      <Flex vc>
        <ICPlusOutlined />
        <Text fs={14} pl={8}>
          {_t('futrgrid.stopprofitprice')}
        </Text>
      </Flex>
    ),
  },
  onTriggerStopLoss: {
    value: 'onTriggerStopLoss',
    label: () => (
      <Flex vc>
        <ICPlusOutlined />
        <Text fs={14} pl={8}>
          {_t('futrgrid.stoplossprice')}
        </Text>
      </Flex>
    ),
  },
  onDetail: {
    value: 'onDetail',
    label: () => (
      <Flex vc>
        <ICOrdersHistoryOutlined />
        <Text fs={14} pl={8}>
          {_t('1Ny8xqTe1wZNKuFyEno8fh')}
        </Text>
      </Flex>
    ),
  },
};
// 是否可以操作其他修改
// RUNNING状态显示可以修改
const canModify = (status) => {
  return ['RUNNING'].includes(status);
};
// 是否可以查看详情
const canSeeDetail = (status) => {
  return !['STOPPING'].includes(status);
};
/**
 * @description: 根据策略类型决定运行下拉的菜单项
 * @param {*} straType
 * @param {*} status
 * @return {*}
 */
const getMenus = (straType, status) => {
  const menusConfigs = strasMap.get(+straType).runningDropdownConfig?.menus;
  const _menus = [];
  if (canSeeDetail(status)) {
    _menus.push(allMenuConfigs.onDetail);
  }
  if (menusConfigs && canModify(status)) {
    menusConfigs.forEach((eventNameKey) => {
      _menus.unshift(allMenuConfigs[eventNameKey]);
    });
  }
  return _menus;
};

export default getMenus;
