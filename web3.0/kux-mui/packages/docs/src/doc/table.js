/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { Table, Box, Button, VirtualTable, styled } from '@kux/mui';

import Wrapper from './wrapper';

const CusTable = styled(Table)`
  min-height: 450px;
`;

const columns = [
  {
    title: 'Full Name',
    dataIndex: 'name',
    key: 'name',  
    align: 'left',
    fixed: 'left',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.age - b.age,
  },
  { title: 'Column 1', dataIndex: 'address', key: '1' },
  { title: 'Column 2', dataIndex: 'address', key: '2' },
  { title: 'Column 3', dataIndex: 'address', key: '3' },
  { title: 'Column 5', dataIndex: 'address', key: '5', align: 'right' },

  { title: 'Column 1', dataIndex: 'address', key: '6' },
  { title: 'Column 2', dataIndex: 'address', key: '7' },
  { title: 'Column 3', dataIndex: 'address', key: '8' },
  { title: 'Column 5', dataIndex: 'address', key: '9', align: 'right' },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '3',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '4',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '5',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '6',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '7',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '8',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '9',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '10',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '11',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '12',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '13',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '14',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '15',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '16',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '18',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '19',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
  {
    key: '20',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];

const data1 = [];

for (let i = 0; i < 10; i++) {
  data1.push({
    key: i,
    name: `John Brown _${i}`,
    age: i,
    address: `New York Park _${i}`,
  });
}

const expandedRowRender = () => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      key: 'state',
      render: () => <span>Finished</span>,
    },
    {
      title: 'Upgrade Status',
      dataIndex: 'upgradeNum',
      key: 'upgradeNum',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      key: 'operation',
      render: () => (
        <div>
          <span>Pause</span>
          <span>Stop</span>
        </div>
      ),
    },
  ];
  const data = [];

  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      date: '2014-12-24 23:12:00',
      name: 'This is production name',
      upgradeNum: 'Upgraded: 56',
    });
  }

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

const TableDoc = () => {
  const [size, setSize] = useState('small');
  const [loading, setLoading] = useState(false);
  const [filled, setFilled] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDataSource(data1);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Box style={{ paddingLeft: 100 }}>
      <div>
        <Button onClick={() => setSize(size === 'small' ? 'basic' : 'small')}>
          Current Size: {size}
        </Button>
        <Button onClick={() => setLoading(!loading)}>Loading</Button>
        <Button onClick={() => setFilled(!filled)}>Header Filled</Button>
      </div>
      <div style={{ width: '800px', marginTop: 40, height: 1200 }}>
        <CusTable
          headerBorder={true}
          size={size} // virtual scroll not support dynamic
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
          bordered={true}
          headerType={filled ? 'filled' : 'transparent'}
          loading={loading}
          locale={loading ? null : undefined}
          style={{ height: 400 }}
          direction="rtl"
          // expandable={{
          //   expandedRowRender,
          //   expandRowByClick: true,
          // }}
                  //  sticky
          scroll={{ x: 1200 }}
        />
      </div>
    </Box>
  );
};

export default () => {
  return (
    <Wrapper>
      <TableDoc />
    </Wrapper>
  );
};
