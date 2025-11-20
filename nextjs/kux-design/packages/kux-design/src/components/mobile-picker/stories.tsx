import type { Meta, StoryObj } from '@storybook/react-vite';
import { MobileDatePicker, MobileTimePicker, MobileRangePicker } from './index';
import { useState } from 'storybook/internal/preview-api';
import { Button } from '../button';
import moment from 'moment';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/MobilePicker',
  component: MobileDatePicker,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info:
    // https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
    delay: 4000,
  },
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked:
  // https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    show: false,
    onClose: () => {},
    onCancel: () => {},
    onOk: () => {},
    onChange: () => {},
  },
} satisfies Meta<typeof MobileDatePicker>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const ShowCase: Story = {
  render: (args) => {
    const [showType, setShowType] = useState<'date' | 'time' | 'range' | undefined>(undefined);

    const handleShow = (type: 'date' | 'time' | 'range') => {
      setShowType(type);
    };

    return (
      <div>
        <MobileDatePicker onOk={() => console.log('date: ok')} onChange={(date) => console.log('date:', date)} show={showType === 'date'} onClose={() => setShowType(undefined)} />
        <MobileTimePicker onOk={() => console.log('time: ok')} onChange={(date) => console.log('time:', date)} show={showType === 'time'} onClose={() => setShowType(undefined)} />
        <MobileRangePicker onOk={() => console.log('range: ok')} onChange={(date) => console.log('range:', date)} defaultValue={[moment(), moment()]} show={showType === 'range'} onClose={() => setShowType(undefined)} />

        <Button sync type='primary' onClick={() => handleShow('date')}>DatePicker</Button>
        <Button sync type='primary' onClick={() => handleShow('time')}>TimePicker</Button>
        <Button sync type='primary' onClick={() => handleShow('range')}>RangePicker</Button>
      </div>
    );
  },
};
