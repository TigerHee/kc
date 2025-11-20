/**
 * Owner: eli@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import CommonTable from '../components/CommonTable';
import H5Table, { RowTextTitle, SpaceBetween } from '../components/H5CommonTable';

const columns = [
  {
    title: _t('064f3551b5c34800ab24'),
    dataIndex: 'activityName',
    key: 'activityName',
    width: '30%',
  },
  {
    title: _t('a93345afaefb4800a9ca'),
    dataIndex: 'transferAffect',
    key: 'transferAffect',
    render: (text) => text || '--',
    width: '70%',
  },
];

function H5TableTitle({ record }) {
  return (
    <div>
      <SpaceBetween>
        <span>{record.activityName}</span>
      </SpaceBetween>
      <RowTextTitle>{record.transferAffect || '--'}</RowTextTitle>
    </div>
  );
}

export default function Step1Table({ data, onRow }) {
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const total = data?.campaignList?.length || 0;
  const dataSource = data?.campaignList || [];

  return isH5 ? (
    <H5Table
      columns={[]}
      dataSource={dataSource}
      pagination={{ total }}
      H5TableTitle={H5TableTitle}
    />
  ) : (
    <CommonTable columns={columns} dataSource={dataSource} pagination={{ total }} onRow={onRow} />
  );
}
