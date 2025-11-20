import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spacer } from './index';
import { HStack, VStack } from '../stack';

const meta = {
  title: 'base/Spacer',
  component: Spacer,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Spacer>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基础用法 - 两端对齐
export const Basic: Story = {
  args: {},
  name: '基础用法',
  render: (args) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }}>
      <div style={{ background: 'lightblue', padding: '12px' }}>左侧内容</div>
      <Spacer {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>右侧内容</div>
    </HStack>
  ),
};

// 最小间距
export const MinLength: Story = {
  name: '最小间距',
  render: (args) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }}>
      <div style={{ background: 'lightblue', padding: '12px' }}>左侧内容</div>
      <Spacer minLength={100} {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>右侧内容</div>
    </HStack>
  ),
};

// 固定间距
export const FixedLength: Story = {
  name: '固定间距',
  render: (args) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }}>
      <div style={{ background: 'lightblue', padding: '12px' }}>左侧内容</div>
      <Spacer length={100} {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>右侧内容</div>
    </HStack>
  ),
};

// 均匀分布
export const EvenlyDistributed: Story = {
  name: '均匀分布',
  render: (args) => (
    <HStack style={{ border: '1px solid #eee', padding: '16px' }}>
      <div style={{ background: 'lightblue', padding: '12px' }}>选项1</div>
      <Spacer {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>选项2</div>
      <Spacer {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>选项3</div>
    </HStack>
  ),
};

// 垂直布局
export const VerticalLayout: Story = {
  name: '垂直布局',
  render: (args) => (
    <VStack style={{ border: '1px solid #eee', padding: '16px', height: '400px' }}>
      <div style={{ background: 'lightblue', padding: '12px' }}>顶部内容</div>
      <Spacer {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>中间内容</div>
      <Spacer {...args} />
      <div style={{ background: 'lightblue', padding: '12px' }}>底部内容</div>
    </VStack>
  ),
};

// 复杂布局示例
export const ComplexLayout: Story = {
  name: '复杂布局示例',
  render: (args) => (
    <VStack style={{ border: '1px solid #eee', padding: '16px', maxWidth: '600px' }} spacing={16}>
      {/* 导航栏 */}
      <HStack style={{ background: '#f5f5f5', padding: '12px' }}>
        <div>Logo</div>
        <Spacer minLength={32} />
        <div>导航1</div>
        <Spacer length={16} />
        <div>导航2</div>
        <Spacer length={16} />
        <div>导航3</div>
        <Spacer />
        <div>用户信息</div>
      </HStack>

      {/* 内容区域 */}
      <HStack style={{ flex: 1 }}>
        {/* 侧边栏 */}
        <VStack style={{ width: '200px', background: '#f5f5f5', padding: '12px' }} spacing={8}>
          <div>菜单1</div>
          <div>菜单2</div>
          <Spacer />
          <div>底部菜单</div>
        </VStack>
        
        {/* 主内容区 */}
        <Spacer length={16} />
        <VStack style={{ flex: 1, background: '#f9f9f9', padding: '12px' }}>
          <div>主要内容区域</div>
          <Spacer minLength={32} />
          <HStack>
            <div style={{ background: 'lightblue', padding: '12px' }}>内容1</div>
            <Spacer length={16} />
            <div style={{ background: 'lightblue', padding: '12px' }}>内容2</div>
          </HStack>
        </VStack>
      </HStack>

      {/* 表单示例 */}
      <VStack style={{ background: '#f5f5f5', padding: '16px' }} spacing={16}>
        <HStack>
          <div style={{ width: '80px' }}>用户名：</div>
          <Spacer minLength={16} />
          <div style={{ flex: 1, background: 'white', padding: '8px' }}>输入框</div>
        </HStack>
        <HStack>
          <div style={{ width: '80px' }}>密码：</div>
          <Spacer minLength={16} />
          <div style={{ flex: 1, background: 'white', padding: '8px' }}>输入框</div>
        </HStack>
        <HStack>
          <Spacer />
          <div style={{ background: '#1890ff', padding: '8px 16px', color: 'white' }}>提交</div>
          <Spacer length={16} />
          <div style={{ background: '#f5f5f5', padding: '8px 16px' }}>取消</div>
        </HStack>
      </VStack>
    </VStack>
  ),
};

