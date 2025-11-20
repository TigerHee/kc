/**
 * Owner: tiger@kupotech.com
 */
import { RangePicker, Select } from '@kux/mui';
// import { ACCOUNT_MAP } from 'components/TransferModal/config';
import { ACCOUNT_MAP } from 'components/KuxTransferModal/config';
import { separateNumber } from 'helper';
import { map } from 'lodash-es';
import moment from 'moment';
import { _t } from 'tools/i18n';

const getOption = (arr) => {
  const options = map(arr, ({ text, value }) => {
    return {
      label: text,
      code: value,
      value: value,
      title: text,
    };
  });
  return options;
};

const f_range_date = () => ({
  id: 'rangeDate',
  label: _t('time'),
  ocx: (
    <RangePicker
      placeholder={_t('time')}
      allowClear={false} // 限制最大时间为当前时间的3个月前
      disabledDate={(current) =>
        current > moment().endOf('day') || current < moment().subtract(3, 'months')
      }
    />
  ),
});

const f_export_account = (accountList) => ({
  id: 'payOwnerId',
  label: _t('wYq6gpdBE94CVpr8AqmwSX'), // 转出账户
  ocx: (
    <Select
      placeholder={_t('wYq6gpdBE94CVpr8AqmwSX')}
      options={getOption(accountList)}
      getOptionLabel={(option) => option.label}
      allowClear={true}
    />
  ),
});

const f_income_account = (accountList) => ({
  id: 'recOwnerId',
  label: _t('2REfF25C2mgeFny2nYrRRc'), // 转入账户
  ocx: (
    <Select
      placeholder={_t('2REfF25C2mgeFny2nYrRRc')}
      options={getOption(accountList)}
      getOptionLabel={(option) => option.label}
      allowClear={true}
    />
  ),
});

const f_sub_account = (subAccountList) => {
  return {
    id: 'subName',
    label: _t('b3ZQna2k1NGzWKCfmbC8vr'), // 子账号
    ocx: (
      <Select
        placeholder={_t('b3ZQna2k1NGzWKCfmbC8vr')}
        options={getOption(subAccountList)}
        getOptionLabel={(option) => option.label}
        allowClear={true}
      />
    ),
  };
};

const c_deal_at = () => ({
  key: 'time',
  title: _t('oyZE2VNU6nRe1kxpqVnjTM'),
  dataIndex: 'time',
  width: 160,
  align: 'right',
});

const c_export_account = () => ({
  title: _t('wYq6gpdBE94CVpr8AqmwSX'), // 转出账户
  dataIndex: 'subPayOwnerName',
  render: (val) => val || _t('master.account'),
});

const c_export_asset_account = () => ({
  title: _t('3A8uNAG5g4BUzP15749HpJ'), // 转出资产账户
  dataIndex: 'payAccountType',
  render: (val, item) =>
    ACCOUNT_MAP[val] ? ACCOUNT_MAP[val].label(item?.payTag?.replace(/-/g, '/')) : val,
});

const c_income_account = () => ({
  title: _t('2REfF25C2mgeFny2nYrRRc'), // 转入账户
  dataIndex: 'subRecOwnerName',
  render: (val) => val || _t('master.account'),
});

const c_income_asset_account = () => ({
  title: _t('f5Xf1dMRPACvJMXYRxNChx'), // 转入资产账户
  dataIndex: 'recAccountType',
  render: (val, item) =>
    ACCOUNT_MAP[val] ? ACCOUNT_MAP[val].label(item?.recTag?.replace(/-/g, '/')) : val,
});

const c_coin = () => ({
  title: _t('9z4QEvBgJkU2aVy8gEFXHV'), // 币种
  dataIndex: 'currency',
});

const c_count = () => ({
  title: _t('tz6gajDV6bHF65ruG3Uajy'), // 数量
  dataIndex: 'amount',
  render: separateNumber,
});

const c_sub_account = () => ({
  title: _t('b3ZQna2k1NGzWKCfmbC8vr'), // 子账号
  dataIndex: 'subName',
});

const uglifyIp = (ip) => {
  try {
    const arr = ip.split('.');
    return arr[0] + '.***.' + arr[arr.length - 1];
  } catch (error) {
    console.error(error);
    return ip;
  }
};

const c_login_site = () => ({
  key: 'area',
  title: _t('3HNXvFDJiNpDHVeNBRnoG4'),
  dataIndex: 'area',
  render(record, row) {
    return (
      <div>
        {record} ({uglifyIp(row.ip)})
      </div>
    );
  },
});

const c_login_device = () => ({
  key: 'device',
  title: _t('bkP71ed4HibJ1NRT7qvhdD'),
  dataIndex: 'device',
});

const transferCreator = ({ accountList, user }) => {
  return {
    transfer: {
      title: _t('sRQ5mGRym4iZb4aCSVdV2u'),
      initialFilters: {
        currentPage: 1,
        pageSize: 10,
        rangeDate: [
          moment(`${moment().subtract(1, 'months').format('YYYY-MM-DD')} 00:00:00`),
          moment(`${moment().format('YYYY-MM-DD')} 23:59:59`),
        ],
        // payOwnerId: user?.uid,
      },
      filters: [f_export_account(accountList), f_income_account(accountList), f_range_date()],
      columns: [
        c_export_account(),
        c_export_asset_account(),
        c_income_account(),
        c_income_asset_account(),
        c_coin(),
        c_count(),
        c_deal_at(),
      ],
    },
  };
};

const loginCreator = ({ subAccountList }) => {
  return {
    login: {
      title: _t('iBuBZDTHtpkYUPrUE3vMeA'),
      initialFilters: {
        currentPage: 1,
        pageSize: 5,
        rangeDate: [
          moment(`${moment().subtract(1, 'months').format('YYYY-MM-DD')} 00:00:00`),
          moment(`${moment().format('YYYY-MM-DD')} 23:59:59`),
        ],
      },
      filters: [f_sub_account(subAccountList), f_range_date()],
      columns: [c_sub_account(), c_login_site(), c_login_device(), c_deal_at()],
    },
  };
};

export { transferCreator, loginCreator };
