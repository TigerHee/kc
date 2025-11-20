import type { Meta, StoryObj } from '@storybook/react-vite';
import DatePicker from './index';

const componentMeta = {
  title: 'base/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    picker: {
      control: { type: 'select' },
      options: ['time', 'date', 'week', 'month', 'year'],
    },
  },
} satisfies Meta<typeof DatePicker>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

export const ShowCase: Story = {
  args: {
    placeholder: '请选择日期',
    size: 'medium',
    picker: 'date',
  },
  render: () => {
    return (
      <div>
        <DatePicker placeholder="Select Date" picker="date" />
        <br />
        <DatePicker label="Time" placeholder="Select Time" picker="time" format='MM/DD/yyyy HH:mm:ss' />
        <br />
        <DatePicker label="Year" placeholder="Select Year" picker="year" />
        <br />
        <DatePicker label="Month" placeholder="Select Month" picker="month" />
        <br />
      </div>
    );
  }
};
