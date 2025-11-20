import {useMemo} from 'react';

import useLang from 'hooks/useLang';
import {ActionType} from '../constant';
export const useMakeLeadPanelTableConfig = ({actionType}) => {
  const {_t} = useLang();
  const ruleColumns = useMemo(
    () => [
      {
        title: _t('2f3ab0d09e894000a84d'),
        dataIndex: 'orderType',
        width: '30%',
      },
      {
        title: _t('c9a560d280424000a6a3'),
        dataIndex: 'triggerMethod',
        width: '40%',
      },
      {
        title: _t('299df7d024ef4000a118'),
        dataIndex: 'followDelegation',
        width: '30%',
      },
    ],
    [],
  );

  const openActionRuleDatasource = useMemo(
    () => [
      {
        key: '1',
        orderType: _t('b3ed5cc0bca24000a9aa'),
        triggerMethod: _t('bf6e8408229e4000a836'),
        followDelegation: _t('f86bac9787634000afea'),
      },
      {
        key: '2',
        orderType: _t('fa0f6d0651af4000a58c'),
        triggerMethod: _t('bf6e8408229e4000a836'),
        followDelegation: _t('f86bac9787634000afea'),
      },
    ],
    [],
  );

  const closeActionRuleDatasource = useMemo(
    () => [
      {
        key: '1',
        orderType: _t('72790d742e044000ae6c'),
        triggerMethod: _t('498e0451f9df4000a8cd'),
        followDelegation: _t('5080272d1e0f4000a35b'),
      },
      {
        key: '2',
        orderType: _t('89b0c9d41d864000a863'),
        triggerMethod: _t('498e0451f9df4000a8cd'),
        followDelegation: _t('5080272d1e0f4000a35b'),
      },
    ],
    [],
  );

  const ruleTableConfig = useMemo(() => {
    return {
      columns: ruleColumns,
      dataSource:
        actionType === ActionType.Open
          ? openActionRuleDatasource
          : closeActionRuleDatasource,
    };
  }, [
    ruleColumns,
    actionType,
    openActionRuleDatasource,
    closeActionRuleDatasource,
  ]);

  const shareProfitExample = {
    columns: [
      {
        title: _t('fd3d2349b5d04000aeff'), // 时间
        dataIndex: 'time',
        width: '18%',
      },
      {
        title: _t('b4542a96d62c4000a0f5'), // 累计已实现收益
        dataIndex: 'cumulativeRealized',
        width: '24%',
      },
      {
        title: _t('1b50d02117304000a106'), // 已分配收益
        dataIndex: 'distributed',
        width: '24%',
      },
      {
        title: _t('fdcdd52feac84000af78'), // 带单者分润
        dataIndex: 'profitSharing',
        width: '24%',
      },
    ],
    dataSource: [
      {
        time: _t('3d13a73149fe4000a4b9'),
        cumulativeRealized: '+300',
        distributed: '0',
        profitSharing: '+30',
      },
      {
        time: `${_t('4749ffa9c7754000a0bd', {num: 2})} 00:00`,
        cumulativeRealized: '+50',
        distributed: '+300',
        profitSharing: '0',
      },
      {
        time: `${_t('4749ffa9c7754000a0bd', {num: 3})} 00:00`,
        cumulativeRealized: '+200',
        distributed: '+300',
        profitSharing: '0',
      },
      {
        time: `${_t('4749ffa9c7754000a0bd', {num: 4})} 00:00`,
        cumulativeRealized: '+400',
        distributed: '+300',
        profitSharing: '+10',
      },
      {
        time: `${_t('4749ffa9c7754000a0bd', {num: 5})} 00:00`,
        cumulativeRealized: '+300',
        distributed: '+400',
        profitSharing: '0',
      },
    ],
  };

  return {
    ruleTableConfig,
    shareProfitExample,
  };
};
