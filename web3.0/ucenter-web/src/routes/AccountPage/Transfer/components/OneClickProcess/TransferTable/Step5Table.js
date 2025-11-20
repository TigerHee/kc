/**
 * Owner: eli@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import CommonTable from '../components/CommonTable';
import H5Table, { H5TableTitle } from '../components/H5CommonTable';

export default function Step5Table({ data, onRow }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const voucherData = data?.voucherList || [];

  const total = voucherData.length || 0;

  return isH5 ? (
    <H5Table
      columns={h5Columns}
      dataSource={voucherData}
      pagination={{ total }}
      H5TableTitle={H5TableT}
    />
  ) : (
    <CommonTable columns={columns} dataSource={voucherData} pagination={{ total }} onRow={onRow} />
  );
}

const columns = [
  {
    title: _t('ee3cdddd918f4000ac38'),
    dataIndex: 'voucherName',
    key: 'voucherName',
  },
  {
    title: _t('9b13c86401e44000a846'),
    dataIndex: 'voucherCount',
    key: 'voucherCount',
    render: (text) => <div>{text}</div>,
  },
];

const h5Columns = [
  // 张数
  {
    title: _t('9b13c86401e44000a846'),
    dataIndex: 'voucherCount',
    key: 'voucherCount',
  },
];

const H5TableT = ({ record }) => {
  return <H5TableTitle title={record.voucherName} />;
};
