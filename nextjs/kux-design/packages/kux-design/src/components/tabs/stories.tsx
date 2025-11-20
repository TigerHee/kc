import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, type ITabsProps } from './index';
import { fn } from 'storybook/test';
import { useState } from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const componentMeta = {
  title: 'base/Tabs',
  component: Tabs,
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
} satisfies Meta<typeof Tabs>;

export default componentMeta;

type Story = StoryObj<typeof componentMeta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    onChange: fn(),
    value: 1,
    showUnderline: true,
    variant: 'slider',
    tabs: [
      { label: 'Deposit History', value: 0 },
      { label: 'Saved Address', value: 1 },
      { label: 'Tab 3', value: 2 },
      { label: 'Tab 4', value: 3 },
      { label: 'Tab 5', value: 4 },
      { label: 'Tab 6', value: 5 },
      { label: 'Tab 7', value: 6 },
      { label: 'Tab 8', value: 7 },
      { label: 'Tab 9', value: 8 },
      { label: 'Tab 10', value: 9 },
      { label: 'Tab 11', value: 10 },
      { label: 'Tab 12', value: 11 },
    ],
    size: 'medium',
  },
  render: (args: ITabsProps) => {
    const [value, setValue] = useState(1);
    const [stringValue, setStringValue] = useState('deposit');
    return (
      <>
        <Tabs {...args} value={value} onChange={setValue} />
        <Tabs {...args} value={value} onChange={setValue} variant="line" />
        <Tabs
          {...args}
          tabs={[
            { label: 'Deposit History', value: 'deposit' },
            { label: 'Saved Address', value: 'saved' },
          ]}
          onChange={setStringValue}
          value={stringValue}
          variant="bordered"
        />

        <Tabs
          {...args}
          tabs={[
            { label: 'Deposit History', value: 0 },
            { label: 'Saved Address', value: 1 },
            { label: 'Withdrawal History', value: 2 },
          ]}
          value={value}
          onChange={setValue}
          variant="slider"
        />
      </>
    );
  },
};
