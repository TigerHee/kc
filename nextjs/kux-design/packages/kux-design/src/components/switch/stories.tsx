
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Switch } from './index';

const meta: Meta<typeof Switch> = {
  title: 'base/Switch',
  component: Switch,
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const Controlled = () => {
  const [checked, setChecked] = useState(false);
  return <Switch value={checked} onChange={setChecked} />;
};

export const Uncontrolled: Story = {
  args: {
    defaultValue: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16 }}>
    <Switch size="small" />
    <Switch size="medium" />
  </div>
);

