
import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';
import { Segmented } from './index';
import { VStack } from '../stack';

const meta: Meta<typeof Segmented> = {
  title: 'base/Segmented',
  component: Segmented,
  parameters: { layout: 'padded' },
};
export default meta;


import type { StoryObj } from '@storybook/react-vite';

type Story<T = any> = StoryObj<typeof Segmented<T>>;

export const Controlled: Story<string> = {
  render: (args) => {
    const [val, setVal] = useState('A');
    return <Segmented {...args} options={['A', 'B', 'C']} value={val} onChange={setVal} />;
  },
};

export const Uncontrolled: Story<string> = {
  args: {
    options: ['A', 'B', 'C'],
    defaultValue: 'B',
    onChange: (val: string) => { console.log(val); },
  },
};

export const ObjectOptions: Story = {
  args: {
    options: [
      { label: 'Option A', value: 'A' },
      { label: 'Option B', value: 'B', disabled: true },
      { label: 'Option C', value: 'C' },
    ],
    defaultValue: 'A',
  },
  render: (args) => {
    const [val, setVal] = useState('A');
    return (
      <Segmented
        {...args}
        onChange={setVal}
      />
    );
  },
};

export const Variants: Story = {
  render: (args) => {
    const [val, setVal] = useState('plain');
    return (
      <VStack style={{ gap: 20 }}>
        <Segmented {...args} options={['plain', 'slider', 'underlined']} value={val} onChange={setVal} variant="plain" />
        <Segmented {...args} options={['plain', 'slider', 'underlined']} value={val} onChange={setVal} variant="slider" />
        <Segmented {...args} options={['plain', 'slider', 'underlined']} value={val} onChange={setVal} variant="underlined" />
      </VStack>
    );
  },
};

export const SizesAndLayout: Story = {
  render: (args) => (
    <VStack style={{ gap: 20 }}>
      <Segmented {...args} options={['S', 'M', 'L']} size="small" />
      <Segmented {...args} variant='underlined' options={['S', 'M', 'L']} size="medium" fullWidth />
      <Segmented {...args} options={['S', 'M', 'L']} size="large" justified="stretch" fullWidth />
      <Segmented {...args} options={['S', 'M', 'L']} size="large" justified="auto" fullWidth />
    </VStack>
  ),
};

export const Disabled: Story = {
  args: {
    options: ['A', 'B', 'C'],
    value: 'A',
    disabled: true,
  },
};

