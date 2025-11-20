import { _t } from '@/tools/i18n';
import CoinBalanceFormat from './CoinBalanceFormat';
import CoinDisplay from './CoinDisplay';

export const getColumns = () => {
  return [
    {
      title: _t('822b96607e8a4000a44f'),
      dataIndex: 'currency',
      key: 'currency',
      render: (value: string) => <CoinDisplay currency={value} />,
    },

    {
      title: _t('fbdbedb91b7f4800ac19'),
      dataIndex: 'totalBalance',
      key: 'totalBalance',
      render: (value: string, record: any) => (
        <CoinBalanceFormat count={value} currency={record?.currency} />
      ),
    },
  ];
};
