/**
 * Owner: tiger@kupotech.com
 */
import { fireEvent } from '@testing-library/react';
import MiniTable from 'src/components/Account/MiniTable';
import { customRender } from 'test/setup';

describe('test MiniTable', () => {
  test('test MiniTable render 1', () => {
    const props = {
      dataSource: [
        {
          id: '1',
          userId: '646dcbd9f7560e00016778eb',
          categoryCodes: ['INOUT-RECHARGE', 'INOUT-WITHDRAW'],
          status: 3,
          fileUrl: null,
          createdAt: 1697011408000,
          begin: 1696089600000,
          end: 1696348800000,
          currency: null,
          message: 'NO_USER',
        },
        {
          id: '2',
          userId: '646dcbd9f7560e00016778eb',
          categoryCodes: ['INOUT-RECHARGE', 'INOUT-WITHDRAW'],
          status: 3,
          fileUrl: null,
          createdAt: 1697011229000,
          begin: 1696089600000,
          end: 1696348800000,
          currency: null,
          message: 'NO_USER',
        },
      ],
      loading: false,
      columns: [
        {
          title: () => 'title',
          labelColorKey: 'text',
          dataIndex: 'h5',
          render: () => 'render',
          expandedIcon: () => 'expandedIcon',
          reverse: true,
        },
        {
          title: () => 'title2',
          dataIndex: 'createdAt',
          width: '20%',
        },
        { title: '幣種', dataIndex: 'currency', width: '10%' },
        {
          title: '記錄區間',
          key: 'begin',
          dataIndex: 'begin',
          width: '20%',
          expandedIcon: 'expandedIcon str',
          reverse: true,
        },
        { title: '狀態', dataIndex: 'status', width: '10%', reverse: true },
      ],
      rowKey: 'id',
      expandedRowKeys: [],
      locale: {},
      onRowClick: () => {},
    };

    customRender(<MiniTable {...props} />);
    customRender(
      <MiniTable
        {...props}
        expandedRowKeys={['2']}
        expandedRowRender={() => <>expandedRowRender</>}
      />,
    );
    fireEvent.click(document.querySelector('.miniTableItem'));
  });

  test('test MiniTable render 2', () => {
    const props = {
      dataSource: [],
      loading: false,
      columns: [
        { labelColorKey: 'text', dataIndex: 'h5', hide: false },
        { title: '時間', dataIndex: 'createdAt', width: '20%' },
        { title: '幣種', dataIndex: 'currency', width: '10%' },
        { title: '記錄區間', key: 'begin', dataIndex: 'begin', width: '20%' },
        { title: '狀態', dataIndex: 'status', width: '10%' },
      ],
      rowKey: 'id',
    };

    customRender(<MiniTable {...props} />);
  });
});
