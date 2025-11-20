import React from 'react';

import Table from 'components/Common/Table';
import {customRender as render} from '../../setup';

describe('Table', () => {
  const columns = [
    {title: 'Name', dataIndex: 'name'},
    {title: 'Age', dataIndex: 'age'},
  ];
  const dataSource = [
    {key: '1', name: 'Alice', age: 18},
    {key: '2', name: 'Bob', age: 20},
  ];

  it('renders table header and data', () => {
    const {getByText} = render(
      <Table columns={columns} dataSource={dataSource} />,
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('Age')).toBeTruthy();
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
  });

  it('supports custom column render', () => {
    const customColumns = [
      ...columns,
      {title: 'Custom', dataIndex: 'custom', render: () => <>{'X'}</>},
    ];
    render(<Table columns={customColumns} dataSource={dataSource} />);
  });

  it('applies custom styles', () => {
    const {toJSON} = render(
      <Table
        columns={columns}
        dataSource={dataSource}
        containerStyle={{backgroundColor: 'red'}}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
