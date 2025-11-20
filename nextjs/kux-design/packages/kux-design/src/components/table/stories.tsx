import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type ITableProps } from './index';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Table',
  component: Table,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} satisfies Meta<typeof Table>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    rowKey: 'key',
    // border: true,
    columns:[
    { title: <span className='kux-ellipsis-2'>Name Name Name Name Name Name Name Name </span>, dataIndex: 'name', width: 150 },
    { title: 'Age', dataIndex: 'age', width: 100 },
    { title: 'Address', dataIndex: 'address', width: 300 },
    { title: 'c', dataIndex: 'c', width: 300 },
    { title: 'd', dataIndex: 'd', width: 300 },
    { title: 'e', dataIndex: 'e', width: 300 },
    { title: 'f', dataIndex: 'f', width: 300 },
    { title: 'g', dataIndex: 'g', width: 300 },
    { title: 'h', dataIndex: 'h', width: 300, align: 'end' },
  ],
  dataSource: [
    { key: 1, name: 'John', age: 32, address: 'Street A', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h' },
    { key: 2, name: 'Mary', age: 28, address: 'Street B', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g', h: 'h' },
  ],
  fixedStartCount: 1,
  fixedEndCount: 1,
  },
  render: (args: ITableProps) => {
    return (
      <>
        <Table {...args} />
        <Table
          columns={[
            { title: 'Name', dataIndex: 'name', width: 150 },
            { title: 'Age', dataIndex: 'age', width: 300 },
            { title: 'Address', dataIndex: 'address', render(value) {
              return <div className='kux-leading-ellipsis'>{value}</div>;
            }, width: 100 },
          ]}
          dataSource={[
            { key: 1, name: 'John', age: 32, address: 'Street A' },
            { key: 2, name: 'Mary', age: 28, address: 'Street B http://localhost:6006/?path=/story/base-table--primary' },
          ]}
          rowKey={'key'}
        />
      </>
    );
  },
};

