import { Input } from '@kux/mui';
import NewFilterTable from 'src/components/NewFilterTable';
import { customRender } from 'test/setup';

const baseProps = {
  dataSource: [{}, {}],
  columns: [
    {
      title: 'title',
      dataIndex: 'dataIndex',
    },
  ],
  scroll: { x: 1024 },
  cards: {
    convert: {
      title: 'title',
      filters: [
        {
          id: 'side',
          label: 'label',
          ocx: <Input />,
        },
      ],
      columns: [
        {
          title: 'title',
          dataIndex: 'dataIndex',
        },
      ],
    },
  },
  activeTab: 'convert',
  convert: {
    title: 'title',
    filters: [
      {
        id: 'side',
        label: 'label',
        ocx: <Input />,
      },
    ],
    columns: [
      {
        title: 'title',
        dataIndex: 'dataIndex',
      },
    ],
    records: [{}, {}],
  },
  queryRecords: () => {},
  cancelPolling: () => {},
};

describe('test NewFilterTable ', () => {
  test('test NewFilterTable render', () => {
    customRender(<NewFilterTable {...baseProps} />);
    customRender(<NewFilterTable {...baseProps} showTab />);

    customRender(
      <NewFilterTable
        {...baseProps}
        showTab
        extra={<>extra</>}
        cards={{
          convert: {
            title: 'convert',
            filters: [
              {
                id: 'side',
                label: 'label',
                ocx: <Input />,
              },
            ],
            columns: [
              {
                title: 'title1',
                dataIndex: 'dataIndex',
              },
            ],
          },
          title2: {
            title: 'title2',
            filters: [
              {
                id: 'side',
                label: 'label',
                ocx: <Input />,
              },
            ],
            columns: [
              {
                title: 'title2',
                dataIndex: 'dataIndex',
              },
            ],
          },
        }}
      />,
    );
  });
});
