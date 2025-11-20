import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack, HStack, VStack, AutoStack } from './index';
import { Spacer } from '../spacer';
import type { ComponentProps } from 'react';

type StackProps = ComponentProps<typeof Stack>;

const meta = {
  title: 'base/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    direction: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
    },
    spacing: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

// 基础水平布局
export const HStackBasic: Story = {
  args: {},
  name: '基础水平布局',
  render: (args: StackProps) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }} spacing={16} {...args}>
      <div style={{ background: 'lightblue', padding: '12px' }}>左侧</div>
      <div style={{ background: 'lightblue', padding: '12px' }}>中间</div>
      <Spacer />
      <div style={{ background: 'lightblue', padding: '12px' }}>右侧</div>
    </HStack>
  ),
};

// 基础垂直布局
export const VStackBasic: Story = {
  args: {},
  name: '基础垂直布局',
  render: (args: StackProps) => (
    <VStack style={{ border: '1px solid #eee', padding: '16px', height: '300px' }} spacing={16} {...args}>
      <div style={{ background: 'lightblue', padding: '12px' }}>顶部</div>
      <div style={{ background: 'lightblue', padding: '12px' }}>中间</div>
      <Spacer />
      <div style={{ background: 'lightblue', padding: '12px' }}>底部</div>
    </VStack>
  ),
};

// 导航栏布局
export const NavigationBar: Story = {
  args: {},
  name: '导航栏布局',
  render: (args: StackProps) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }} spacing={16} {...args}>
      <div style={{ background: 'lightblue', padding: '12px' }}>Logo</div>
      <Spacer />
      <div>菜单1</div>
      <Spacer />
      <div>菜单2</div>
      <Spacer />
      <div>菜单3</div>
      <Spacer minLength={32} />
      <div style={{ background: 'lightblue', padding: '12px' }}>用户信息</div>
    </HStack>
  ),
};

// 基础响应式布局
export const AutoStackBasic: Story = {
  args: {},
  name: '基础响应式布局',
  render: (args: StackProps) => (
    <>
      <div style={{textAlign: 'center'}}> 调整宽度以查看效果 </div>
      <AutoStack 
        breakpoint="S" 
        style={{ border: '1px solid #eee', padding: '16px' }} 
        spacing={16}
        fullWidth
        {...args}
      >
        <div style={{ background: 'lightblue', padding: '12px' }}>内容区块 1</div>
        <Spacer />
        <div style={{ background: 'lightblue', padding: '12px' }}>内容区块 2</div>
        <Spacer minLength={32} />
        <div style={{ background: 'lightblue', padding: '12px' }}>内容区块 3</div>
      </AutoStack>
    </>
  ),
};

// 响应式卡片布局
export const AutoStackCard: Story = {
  args: {},
  name: '响应式卡片布局',
  render: (args: StackProps) => (
    <VStack spacing={16} {...args}>
      <div style={{ background: '#f5f5f5', padding: '16px' }}>响应式卡片示例: 调整宽度以查看效果</div>
      <AutoStack breakpoint="sm" spacing={16}>
        {[1, 2, 3].map(i => (
          <VStack 
            key={i} 
            style={{ background: 'white', padding: '16px', border: '1px solid #eee' }}
            spacing={8}
          >
            <div>卡片标题 {i}</div>
            <div style={{ color: '#666' }}>卡片内容</div>
            <Spacer />
            <div>底部信息</div>
          </VStack>
        ))}
      </AutoStack>
    </VStack>
  ),
};

// 表单布局
export const FormLayout: Story = {
  args: {},
  name: '表单布局',
  render: (args: StackProps) => (
    <VStack style={{ border: '1px solid #eee', padding: '16px', width: '400px' }} spacing={16} {...args}>
      <HStack fullWidth>
        <div style={{ width: '80px' }}>用户名：</div>
        <Spacer />
        <div style={{ flex: 1, background: '#f5f5f5', padding: '8px' }}>输入框</div>
      </HStack>
      <HStack fullWidth>
        <div style={{ width: '80px' }}>密码：</div>
        <Spacer />
        <div style={{ flex: 1, background: '#f5f5f5', padding: '8px' }}>输入框</div>
      </HStack>
      <HStack spacing={8}>
        <div style={{ background: '#1890ff', padding: '8px 16px', color: 'white' }}>提交</div>
        <Spacer />
        <div style={{ background: '#f5f5f5', padding: '8px 16px' }}>取消</div>
      </HStack>
    </VStack>
  ),
};

// 嵌套布局
export const NestedLayout: Story = {
  args: {},
  name: '嵌套布局',
  render: (args: StackProps) => (
    <VStack style={{ border: '1px solid #eee' }} spacing={16} {...args}>
      <HStack fullWidth style={{ padding: '16px', background: '#f5f5f5' }}>
        <div>Header Logo</div>
        <Spacer />
        <div>用户信息</div>
      </HStack>
      <HStack fullWidth style={{ padding: '16px' }}>
        <VStack style={{ width: '200px' }}>
          <div style={{ background: 'lightblue', padding: '8px' }}>菜单 1</div>
          <div style={{ background: 'lightblue', padding: '8px' }}>菜单 2</div>
          <div style={{ background: 'lightblue', padding: '8px' }}>菜单 3</div>
        </VStack>
        <VStack style={{ flex: 1 }}>
          <div style={{ background: '#f5f5f5', padding: '16px' }}>主要内容区域</div>
          <HStack>
            <div style={{ flex: 1, background: 'lightblue', padding: '16px' }}>内容 1</div>
            <div style={{ flex: 1, background: 'lightblue', padding: '16px' }}>内容 2</div>
          </HStack>
        </VStack>
      </HStack>
    </VStack>
  ),
};
