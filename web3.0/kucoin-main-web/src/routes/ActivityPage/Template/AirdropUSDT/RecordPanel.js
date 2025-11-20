/**
 * Owner: willen@kupotech.com
 */
// i18n todo
import React from 'react';
import BaseTable from '../../module/BaseTable';
import { _t } from 'tools/i18n';
import { showDatetime } from 'helper';
import BaseComponent from '../../module/BaseComponent';
import { useLocale } from '@kucoin-base/i18n';
import SpanForA from 'src/components/common/SpanForA';
const optStatusMap = {
  0: 'trxAirdrop.deposit',
  1: 'trxAirdrop.withdraw',
  2: 'trxAirdrop.reward',
};

export default ({ data = [], pagination, handleWithdraw }) => {
  useLocale();
  const formateData = () => {
    return data;
  };
  const formateColumns = () => {
    const columns = [
      {
        title: _t('trxAirdrop.time'),
        dataIndex: 'time',
        align: 'left',
        render: (val) => {
          return showDatetime(val);
        },
      },
      {
        title: _t('trxAirdrop.type'),
        dataIndex: 'optType',
        align: 'left',
        render: (val) => {
          return _t(optStatusMap[val]);
        },
      },
      {
        title: _t('trxAirdrop.amount'),
        dataIndex: 'size',
        align: 'left',
        render: (val) => {
          return `${val}USDT`;
        },
      },
      {
        title: _t('trxAirdrop.operate'),
        align: 'right',
        render: (item) => {
          const { optStatus } = item;
          if (optStatus === -1) return '--';
          if (optStatus === 1) return _t('trxAirdrop.extracted');
          return (
            <SpanForA onClick={() => handleWithdraw(item.id)}>{_t('trxAirdrop.withdraw')}</SpanForA>
          );
        },
      },
    ];

    return columns;
  };
  const columns = formateColumns();
  const dataSource = formateData();
  return (
    <div className="mt-24">
      <BaseComponent baseHead={_t('trxAirdrop.fund.record')}>
        <BaseTable rowKey="id" dataSource={dataSource} columns={columns} pagination={pagination} />
      </BaseComponent>
    </div>
  );
};
