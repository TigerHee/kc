/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import { _t } from 'tools/i18n';
import { showDatetime } from 'helper';
import BaseTable from '../../module/BaseTable';
import BaseComponent from '../../module/BaseComponent';
import { useLocale } from '@kucoin-base/i18n';

export default ({ data = [], pagination }) => {
  useLocale();
  const formateData = () => {
    return data;
  };
  const formateColumns = () => {
    const columns = [
      {
        title: _t('trxAirdrop.snapshot.time'),
        dataIndex: 'time',
        align: 'left',
        render: (val) => {
          return showDatetime(val);
        },
      },
      {
        title: _t('trxAirdrop.activity.amount'),
        dataIndex: 'totalSize',
        align: 'left',
        render: (val) => {
          return `${val}USDT`;
        },
      },
      {
        title: _t('trxAirdrop.airdrop.amount'),
        dataIndex: 'rewardSize',
        align: 'left',
        render: (val) => {
          return `${val}USDT`;
        },
      },
      {
        title: _t('trxAirdrop.state'),
        dataIndex: 'status',
        align: 'right',
        render: (val) => {
          return _t(val === 1 ? 'trxAirdrop.reward.done' : 'trxAirdrop.reward.pending');
        },
      },
    ];

    return columns;
  };
  const columns = formateColumns();
  const dataSource = formateData();
  return (
    <div className="mt-24">
      <BaseComponent baseHead={_t('trxAirdrop.airdrop.record')}>
        <BaseTable rowKey="id" dataSource={dataSource} columns={columns} pagination={pagination} />
      </BaseComponent>
    </div>
  );
};
