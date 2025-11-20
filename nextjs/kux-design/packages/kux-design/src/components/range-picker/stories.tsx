import type { Meta, StoryObj } from '@storybook/react-vite';
import RangePicker from './index';

const componentMeta = {
  title: 'base/RangePicker',
  component: RangePicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    picker: {
      control: { type: 'select' },
      options: ['time', 'date', 'week', 'month', 'year'],
    },
  },
} satisfies Meta<typeof RangePicker>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

export const ShowCase: Story = {
  args: {
    placeholder: '请选择日期',
    size: 'medium',
    picker: 'date',
    onChange: (value) => {
      console.log(value);
    },
  },
  render: () => {
    return (
      <div>
        <RangePicker placeholder={['Start Date', 'End Date']} onChange={(value) => {
          console.log(value);
        }} />
        <br />
      </div>
    );
  }
};
