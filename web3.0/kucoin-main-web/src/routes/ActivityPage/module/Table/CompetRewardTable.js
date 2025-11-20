/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import BaseTable from '../BaseTable';
import BaseComponent from '../BaseComponent';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';

export default ({ data }) => {
  useLocale();
  const formateData = () => {
    const dataSource = data.map((item, idx) => {
      const { list, ...others } = item;
      const newItem = {};
      list.forEach((l) => {
        newItem[`${l.currency}Amount`] = l.amount;
      });
      return {
        id: idx,
        ...newItem,
        ...others,
      };
    });
    return dataSource;
  };
  const formateColumns = () => {
    const columns = [
      {
        title: _t('ranking'),
        dataIndex: 'ranking',
        align: 'center',
      },
      {
        title: _t('winner.amount'),
        dataIndex: 'numberOfUsers',
        align: 'center',
      },
    ];
    const { list } = data[0];
    const target = list.map((l) => {
      const { currency } = l;
      return {
        title: `${_t('prize.amount')}(${currency})`,
        dataIndex: `${currency}Amount`,
        align: 'center',
      };
    });
    return [...columns, ...target];
  };
  const columns = formateColumns();
  const dataSource = formateData();
  return (
    <div className="mt-24">
      <BaseComponent baseHead={_t('activity.rewards')}>
        <BaseTable rowKey="id" dataSource={dataSource} columns={columns} pagination={false} />
      </BaseComponent>
    </div>
  );
};
