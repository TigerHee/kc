import type { Meta, StoryObj } from '@storybook/react-vite';
import Checkbox from './checkbox';
import { CheckboxGroup } from './group';

const meta: Meta<typeof Checkbox> = {
  title: 'Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'radio',
      options: ['small', 'basic', 'large'],
    },
    children: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  args: {
    children: 'Checkbox',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    children: '选中状态',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '禁用状态',
  },
};

export const Sizes: Story = {
  render: () => (
    <>
      <Checkbox size="small">小</Checkbox>
      <Checkbox size="basic" style={{ marginLeft: 12 }}>中</Checkbox>
      <Checkbox size="large" style={{ marginLeft: 12 }}>大</Checkbox>
    </>
  ),
};

export const Group: Story = {
  render: () => (
    <CheckboxGroup
      options={['苹果', '香蕉', '橙子']}
      defaultValue={['苹果']}
    />
  ),
};